-- ============================================================================
-- SAKHRTI — سخرتي — DATABASE SCHEMA
-- PostgreSQL 15+ / Supabase
-- ============================================================================
-- هذا الملف جاهز للتنفيذ مباشرة داخل Supabase SQL Editor.
-- الترتيب مهم: Extensions -> Enums -> Tables -> Indexes -> Functions/Triggers
-- -> RLS Policies -> Storage Buckets -> Realtime.
--
-- ملاحظة أمنية (تطبيقاً لـ section 45-46 من المواصفات):
-- لا يحتوي هذا الملف على أي مفتاح API أو Secret أو كلمة مرور.
-- كل الصلاحيات مبنية على auth.uid() و JWT claims عبر Supabase Auth.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";      -- للبحث النصي السريع (fuzzy search)
create extension if not exists "postgis";       -- للإحداثيات الجغرافية والمسافة

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
create type user_role        as enum ('customer', 'vendor', 'admin', 'driver');
create type store_status     as enum ('pending', 'active', 'suspended', 'closed');
create type store_kind       as enum ('restaurant', 'grocery', 'pharmacy', 'bakery', 'shop', 'other');
create type order_status     as enum (
  'pending', 'confirmed', 'preparing', 'ready',
  'picked_up', 'on_the_way', 'delivered', 'cancelled'
);
create type payment_method   as enum ('cash', 'card', 'online');
create type payment_status   as enum ('pending', 'paid', 'failed', 'refunded');
create type coupon_type      as enum ('percentage', 'fixed');
create type driver_status    as enum ('available', 'busy', 'offline');
create type address_label    as enum ('home', 'work', 'other');
create type notif_channel    as enum ('order_update', 'offer', 'coupon', 'system');

-- ----------------------------------------------------------------------------
-- 2. PROFILES & ROLES
-- profiles تمتد auth.users (الجدول المُدار من Supabase Auth) بعلاقة 1:1
-- ----------------------------------------------------------------------------
create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  phone         text unique not null,
  avatar_url    text,
  role          user_role not null default 'customer',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_profiles_role on profiles(role);
create index idx_profiles_phone on profiles(phone);

-- ----------------------------------------------------------------------------
-- 3. CATEGORIES (تصنيفات عامة تظهر فالـ Homepage)
-- ----------------------------------------------------------------------------
create table categories (
  id            uuid primary key default uuid_generate_v4(),
  name_ar       text not null,
  name_en       text,
  image_url     text,
  icon          text,
  display_order integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);
create index idx_categories_order on categories(display_order);

-- ----------------------------------------------------------------------------
-- 4. STORES (مطاعم + متاجر بنفس الجدول، يميّز بينهم kind)
-- ----------------------------------------------------------------------------
create table stores (
  id                uuid primary key default uuid_generate_v4(),
  owner_id          uuid references profiles(id) on delete set null,   -- صاحب المحل (role = vendor)
  name              text not null,
  slug              text unique not null,
  kind              store_kind not null default 'restaurant',
  description       text,
  logo_url          text,
  cover_url         text,
  phone             text not null,
  city              text not null,
  address           text not null,
  location          geography(point, 4326),                            -- lat/lng حقيقية
  delivery_fee      numeric(8,2) not null default 0,
  min_order         numeric(8,2) not null default 0,
  delivery_radius_km numeric(5,2) not null default 5,
  commission_pct    numeric(5,2) not null default 10,
  rating_avg        numeric(3,2) not null default 0,
  rating_count      integer not null default 0,
  opening_hours     jsonb not null default '{}',                       -- {"mon":[["09:00","23:00"]], ...}
  status            store_status not null default 'pending',
  is_open           boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index idx_stores_status on stores(status);
create index idx_stores_kind on stores(kind);
create index idx_stores_owner on stores(owner_id);
create index idx_stores_location on stores using gist(location);
create index idx_stores_name_trgm on stores using gin (name gin_trgm_ops);

-- ربط المحلات بتصنيفات متعددة (Many-to-Many)
create table store_categories (
  store_id     uuid references stores(id) on delete cascade,
  category_id  uuid references categories(id) on delete cascade,
  primary key (store_id, category_id)
);

-- ----------------------------------------------------------------------------
-- 5. PRODUCTS
-- ----------------------------------------------------------------------------
create table products (
  id            uuid primary key default uuid_generate_v4(),
  store_id      uuid not null references stores(id) on delete cascade,
  name          text not null,
  description   text,
  image_url     text,
  price         numeric(8,2) not null,
  old_price     numeric(8,2),
  is_available  boolean not null default true,
  is_popular    boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_products_store on products(store_id);
create index idx_products_available on products(is_available);
create index idx_products_name_trgm on products using gin (name gin_trgm_ops);

create table product_categories (
  id            uuid primary key default uuid_generate_v4(),
  store_id      uuid not null references stores(id) on delete cascade,
  name          text not null,        -- مثال: "البرغر"، "المشروبات" (قوائم داخل المطعم)
  display_order integer not null default 0
);
alter table products add column category_id uuid references product_categories(id) on delete set null;

-- خيارات إلزامية (مثال: الحجم: صغير/وسط/كبير) — قابلة للتوسعة لاحقاً
create table product_options (
  id            uuid primary key default uuid_generate_v4(),
  product_id    uuid not null references products(id) on delete cascade,
  name          text not null,
  price_delta   numeric(8,2) not null default 0,
  is_default    boolean not null default false
);

-- إضافات اختيارية (مثال: Extra Cheese +5DH)
create table product_extras (
  id            uuid primary key default uuid_generate_v4(),
  product_id    uuid not null references products(id) on delete cascade,
  name          text not null,
  price         numeric(8,2) not null default 0
);

-- ----------------------------------------------------------------------------
-- 6. ADDRESSES
-- ----------------------------------------------------------------------------
create table addresses (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  label         address_label not null default 'home',
  full_address  text not null,
  location      geography(point, 4326),
  notes         text,
  is_default    boolean not null default false,
  created_at    timestamptz not null default now()
);
create index idx_addresses_user on addresses(user_id);

-- ----------------------------------------------------------------------------
-- 7. ORDERS
-- ----------------------------------------------------------------------------
create table orders (
  id                uuid primary key default uuid_generate_v4(),
  order_number      text unique not null,                 -- مثال: SKH-102938
  customer_id       uuid not null references profiles(id),
  store_id          uuid not null references stores(id),
  driver_id         uuid references profiles(id),
  address_id        uuid references addresses(id),
  delivery_address  text not null,                         -- نسخة نصية ثابتة وقت الطلب
  delivery_location geography(point, 4326),
  status            order_status not null default 'pending',
  subtotal          numeric(10,2) not null,
  delivery_fee      numeric(8,2) not null default 0,
  service_fee       numeric(8,2) not null default 0,
  discount_amount   numeric(8,2) not null default 0,
  coupon_code       text,
  total             numeric(10,2) not null,
  commission_amount numeric(10,2) not null default 0,       -- نصيب المنصة
  vendor_earning    numeric(10,2) not null default 0,        -- نصيب صاحب المحل
  payment_method    payment_method not null default 'cash',
  payment_status    payment_status not null default 'pending',
  delivery_instructions text,
  eta_minutes       integer,
  placed_at         timestamptz not null default now(),
  confirmed_at      timestamptz,
  delivered_at      timestamptz,
  cancelled_at      timestamptz,
  cancel_reason     text
);
create index idx_orders_customer on orders(customer_id);
create index idx_orders_store on orders(store_id);
create index idx_orders_driver on orders(driver_id);
create index idx_orders_status on orders(status);
create index idx_orders_placed_at on orders(placed_at desc);

create table order_items (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid not null references products(id),
  product_name  text not null,        -- Snapshot وقت الطلب (السعر ممكن يتبدل لاحقاً)
  unit_price    numeric(8,2) not null,
  quantity      integer not null default 1,
  notes         text,
  line_total    numeric(10,2) not null
);
create index idx_order_items_order on order_items(order_id);

create table order_item_extras (
  id              uuid primary key default uuid_generate_v4(),
  order_item_id   uuid not null references order_items(id) on delete cascade,
  extra_name      text not null,
  extra_price     numeric(8,2) not null default 0
);

-- ----------------------------------------------------------------------------
-- 8. FAVORITES
-- ----------------------------------------------------------------------------
create table favorites (
  user_id       uuid references profiles(id) on delete cascade,
  store_id      uuid references stores(id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (user_id, store_id)
);

-- ----------------------------------------------------------------------------
-- 9. REVIEWS
-- ----------------------------------------------------------------------------
create table reviews (
  id              uuid primary key default uuid_generate_v4(),
  order_id        uuid unique references orders(id) on delete cascade,
  customer_id     uuid not null references profiles(id),
  store_id        uuid not null references stores(id),
  store_rating    smallint check (store_rating between 1 and 5),
  product_rating  smallint check (product_rating between 1 and 5),
  delivery_rating smallint check (delivery_rating between 1 and 5),
  comment         text,
  is_visible      boolean not null default true,           -- تعديل الأدمن (moderation)
  created_at      timestamptz not null default now()
);
create index idx_reviews_store on reviews(store_id);

-- ----------------------------------------------------------------------------
-- 10. COUPONS
-- ----------------------------------------------------------------------------
create table coupons (
  id                uuid primary key default uuid_generate_v4(),
  code              text unique not null,
  type              coupon_type not null,
  value             numeric(8,2) not null,          -- نسبة % أو مبلغ ثابت
  min_order         numeric(8,2) not null default 0,
  max_discount      numeric(8,2),
  usage_limit       integer,                          -- إجمالي مرات الاستخدام المسموحة
  per_user_limit    integer not null default 1,
  starts_at         timestamptz not null default now(),
  ends_at           timestamptz,
  is_active         boolean not null default true,
  applicable_stores uuid[] default '{}',              -- فارغ = يشمل كل المحلات
  applicable_categories uuid[] default '{}',
  created_at        timestamptz not null default now()
);

create table coupon_usage (
  id            uuid primary key default uuid_generate_v4(),
  coupon_id     uuid not null references coupons(id) on delete cascade,
  user_id       uuid not null references profiles(id),
  order_id      uuid references orders(id),
  used_at       timestamptz not null default now(),
  unique (coupon_id, order_id)
);

-- ----------------------------------------------------------------------------
-- 11. OFFERS & BANNERS (تسويقية)
-- ----------------------------------------------------------------------------
create table offers (
  id            uuid primary key default uuid_generate_v4(),
  store_id      uuid references stores(id) on delete cascade,
  product_id    uuid references products(id) on delete cascade,
  title         text not null,
  discount_pct  numeric(5,2),
  starts_at     timestamptz not null default now(),
  ends_at       timestamptz not null,
  is_active     boolean not null default true
);

create table banners (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  subtitle      text,
  image_url     text not null,
  button_label  text,
  link_url      text,
  display_order integer not null default 0,
  starts_at     timestamptz not null default now(),
  ends_at       timestamptz,
  is_active     boolean not null default true
);

-- ----------------------------------------------------------------------------
-- 12. NOTIFICATIONS
-- ----------------------------------------------------------------------------
create table notifications (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  channel       notif_channel not null,
  title         text not null,
  body          text,
  data          jsonb default '{}',      -- مثال: {"order_id": "..."}
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);
create index idx_notifications_user on notifications(user_id, is_read);

-- ----------------------------------------------------------------------------
-- 13. DRIVERS & DELIVERIES
-- ----------------------------------------------------------------------------
create table drivers (
  id              uuid primary key references profiles(id) on delete cascade,  -- role='driver'
  vehicle_type    text,
  vehicle_plate   text,
  status          driver_status not null default 'offline',
  current_location geography(point, 4326),
  rating_avg      numeric(3,2) not null default 5,
  is_verified     boolean not null default false,
  created_at      timestamptz not null default now()
);

create table deliveries (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid unique not null references orders(id) on delete cascade,
  driver_id     uuid references drivers(id),
  picked_up_at  timestamptz,
  delivered_at  timestamptz,
  distance_km   numeric(6,2),
  earnings      numeric(8,2) not null default 0
);

-- ----------------------------------------------------------------------------
-- 14. PAYMENTS
-- ----------------------------------------------------------------------------
create table payments (
  id                uuid primary key default uuid_generate_v4(),
  order_id          uuid unique not null references orders(id) on delete cascade,
  method            payment_method not null,
  status            payment_status not null default 'pending',
  amount            numeric(10,2) not null,
  gateway_reference text,             -- معرف العملية من بوابة الدفع الخارجية
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 15. PLATFORM SETTINGS (Admin-editable, single row per key)
-- ----------------------------------------------------------------------------
create table settings (
  key           text primary key,
  value         jsonb not null,
  updated_at    timestamptz not null default now()
);
insert into settings (key, value) values
  ('default_commission_pct', '10'),
  ('default_service_fee', '3'),
  ('platform_name', '"سخرتي"');

-- ============================================================================
-- 16. FUNCTIONS & TRIGGERS
-- ============================================================================

-- تحديث updated_at تلقائياً
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on profiles
  for each row execute function set_updated_at();
create trigger trg_stores_updated before update on stores
  for each row execute function set_updated_at();
create trigger trg_products_updated before update on products
  for each row execute function set_updated_at();

-- إنشاء profile تلقائياً عند تسجيل مستخدم جديد فـ auth.users
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', new.phone),
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- توليد رقم طلب تسلسلي بصيغة SKH-XXXXXX
create sequence if not exists order_number_seq start 100000;
create or replace function generate_order_number()
returns trigger as $$
begin
  new.order_number := 'SKH-' || nextval('order_number_seq');
  return new;
end;
$$ language plpgsql;

create trigger trg_orders_number before insert on orders
  for each row execute function generate_order_number();

-- تحديث متوسط تقييم المحل تلقائياً بعد كل review جديد
create or replace function refresh_store_rating()
returns trigger as $$
begin
  update stores set
    rating_avg = (select round(avg(store_rating)::numeric, 2) from reviews where store_id = new.store_id and is_visible = true),
    rating_count = (select count(*) from reviews where store_id = new.store_id and is_visible = true)
  where id = new.store_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_reviews_refresh_rating after insert or update on reviews
  for each row execute function refresh_store_rating();

-- ============================================================================
-- 17. ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- المبدأ العام:
--  - customer: يشوف وحيّد بياناته الخاصة فقط (طلباته، عناوينه، مفضلاته...)
--  - vendor: يشوف ويعدّل بيانات محلاته/منتجاته/طلباته فقط (Vendor Isolation)
--  - admin: صلاحية كاملة عبر role = 'admin'
--  - driver: يشوف الطلبات المتاحة + توصيلاته فقط
--  - الزوار (anon): قراءة فقط للبيانات العامة (محلات نشطة، منتجات متوفرة...)
-- ============================================================================

-- Helper: التحقق من دور المستخدم الحالي بدون استعلامات متكررة
create or replace function auth_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

create or replace function is_admin()
returns boolean as $$
  select auth_role() = 'admin';
$$ language sql stable security definer;

-- --- PROFILES ---
alter table profiles enable row level security;
create policy "profiles_select_own_or_admin" on profiles
  for select using (id = auth.uid() or is_admin());
create policy "profiles_update_own" on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_admin_all" on profiles
  for all using (is_admin());

-- --- STORES ---
alter table stores enable row level security;
create policy "stores_public_read_active" on stores
  for select using (status = 'active' or owner_id = auth.uid() or is_admin());
create policy "stores_vendor_manage_own" on stores
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "stores_admin_all" on stores
  for all using (is_admin());

-- --- PRODUCTS ---
alter table products enable row level security;
create policy "products_public_read" on products
  for select using (
    is_available = true
    or exists (select 1 from stores s where s.id = products.store_id and s.owner_id = auth.uid())
    or is_admin()
  );
create policy "products_vendor_manage_own" on products
  for all using (exists (select 1 from stores s where s.id = products.store_id and s.owner_id = auth.uid()));
create policy "products_admin_all" on products
  for all using (is_admin());

-- --- CATEGORIES / BANNERS / OFFERS (قراءة عامة، تعديل Admin فقط) ---
alter table categories enable row level security;
create policy "categories_public_read" on categories for select using (true);
create policy "categories_admin_write" on categories for all using (is_admin());

alter table banners enable row level security;
create policy "banners_public_read" on banners for select using (is_active = true or is_admin());
create policy "banners_admin_write" on banners for all using (is_admin());

alter table offers enable row level security;
create policy "offers_public_read" on offers for select using (is_active = true or is_admin());
create policy "offers_admin_write" on offers for all using (is_admin());

-- --- ADDRESSES (خاصة بكل مستخدم) ---
alter table addresses enable row level security;
create policy "addresses_own_only" on addresses
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- --- ORDERS ---
alter table orders enable row level security;
create policy "orders_customer_read_own" on orders
  for select using (customer_id = auth.uid());
create policy "orders_customer_create" on orders
  for insert with check (customer_id = auth.uid());
create policy "orders_vendor_read_own_store" on orders
  for select using (exists (select 1 from stores s where s.id = orders.store_id and s.owner_id = auth.uid()));
create policy "orders_vendor_update_status" on orders
  for update using (exists (select 1 from stores s where s.id = orders.store_id and s.owner_id = auth.uid()));
create policy "orders_driver_read_assigned" on orders
  for select using (driver_id = auth.uid());
create policy "orders_driver_update_assigned" on orders
  for update using (driver_id = auth.uid());
create policy "orders_admin_all" on orders
  for all using (is_admin());

-- --- ORDER ITEMS / EXTRAS (تتبع صلاحيات الطلب الأصلي) ---
alter table order_items enable row level security;
create policy "order_items_via_order" on order_items
  for select using (
    exists (
      select 1 from orders o
      left join stores s on s.id = o.store_id
      where o.id = order_items.order_id
        and (o.customer_id = auth.uid() or s.owner_id = auth.uid() or o.driver_id = auth.uid() or is_admin())
    )
  );

-- --- FAVORITES ---
alter table favorites enable row level security;
create policy "favorites_own_only" on favorites
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- --- REVIEWS ---
alter table reviews enable row level security;
create policy "reviews_public_read_visible" on reviews
  for select using (is_visible = true or is_admin());
create policy "reviews_customer_create_own" on reviews
  for insert with check (customer_id = auth.uid());
create policy "reviews_admin_moderate" on reviews
  for update using (is_admin());

-- --- COUPONS (قراءة عامة للنشطة فقط، الإدارة Admin) ---
alter table coupons enable row level security;
create policy "coupons_public_read_active" on coupons
  for select using (is_active = true or is_admin());
create policy "coupons_admin_write" on coupons for all using (is_admin());

alter table coupon_usage enable row level security;
create policy "coupon_usage_own" on coupon_usage
  for select using (user_id = auth.uid() or is_admin());

-- --- NOTIFICATIONS ---
alter table notifications enable row level security;
create policy "notifications_own_only" on notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- --- DRIVERS / DELIVERIES ---
alter table drivers enable row level security;
create policy "drivers_read_own_or_admin" on drivers
  for select using (id = auth.uid() or is_admin());
create policy "drivers_update_own" on drivers
  for update using (id = auth.uid());

alter table deliveries enable row level security;
create policy "deliveries_driver_own" on deliveries
  for all using (driver_id = auth.uid() or is_admin());

-- --- PAYMENTS (لا يظهر تفاصيل حساسة إلا لصاحب الطلب أو الأدمن) ---
alter table payments enable row level security;
create policy "payments_own_order_or_admin" on payments
  for select using (
    exists (select 1 from orders o where o.id = payments.order_id and o.customer_id = auth.uid())
    or is_admin()
  );

-- --- SETTINGS (قراءة عامة، تعديل Admin فقط) ---
alter table settings enable row level security;
create policy "settings_public_read" on settings for select using (true);
create policy "settings_admin_write" on settings for all using (is_admin());

-- ============================================================================
-- 18. STORAGE BUCKETS
-- ============================================================================
-- ينفذ هذا الجزء مرة واحدة؛ Supabase يدير storage.objects بجدول RLS خاص به.
insert into storage.buckets (id, name, public) values
  ('store-logos',   'store-logos',   true),
  ('store-covers',  'store-covers',  true),
  ('product-images','product-images', true),
  ('category-images','category-images', true),
  ('banner-images', 'banner-images', true),
  ('avatars',       'avatars',       true)
on conflict (id) do nothing;

-- قراءة عامة للصور (كلها buckets public=true أعلاه)
create policy "public_read_images" on storage.objects
  for select using (bucket_id in ('store-logos','store-covers','product-images','category-images','banner-images','avatars'));

-- الرفع محصور بأصحاب المحلات (لمجلداتهم) والأدمن
create policy "vendor_upload_own_store_media" on storage.objects
  for insert with check (
    bucket_id in ('store-logos','store-covers','product-images')
    and (is_admin() or exists (
      select 1 from stores s where s.owner_id = auth.uid() and (storage.foldername(name))[1] = s.id::text
    ))
  );

create policy "admin_manage_all_media" on storage.objects
  for all using (is_admin());

-- ============================================================================
-- 19. REALTIME PUBLICATION
-- ============================================================================
-- بدل الاعتماد على polling: العميل/التاجر/الأدمن يشتركون فـ channel الطلب
-- عبر supabase.channel('orders:id=eq.<order_id>') من جانب الـ Frontend.
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_items;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table deliveries;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
