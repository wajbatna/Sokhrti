import React, { useState, useRef, useEffect } from "react";
import {
  Phone, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck,
  CheckCircle2, RotateCw
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* TOKENS                                                              */
/* ------------------------------------------------------------------ */
const C = {
  primary: "#FF6B35",
  primaryDark: "#E4551F",
  dark: "#111827",
  bg: "#F7F7F7",
  white: "#FFFFFF",
  success: "#22C55E",
};

/* ------------------------------------------------------------------ */
/* AUTH SERVICE ABSTRACTION                                            */
/* هذه دوال وهمية تمثل الشكل النهائي لـ services/auth.ts                */
/* لاحقاً تُستبدل بـ supabase.auth.signInWithPassword / signInWithOtp    */
/* لا يوجد أي Password ثابت أو Secret هنا — كل شي Simulation فالواجهة   */
/* ------------------------------------------------------------------ */
const AuthService = {
  async register({ name, phone, password }) {
    await wait(600);
    return { userId: "usr_" + Date.now(), phone };
  },
  async sendOtp(phone) {
    await wait(500);
    return { sent: true };
  },
  async verifyOtp(phone, code) {
    await wait(500);
    return { verified: code.length === 4 };
  },
  async login({ phone, password }) {
    await wait(600);
    if (!phone || !password) throw new Error("بيانات ناقصة");
    return { session: { token: "mock_session_token" } };
  },
  async requestPasswordReset(phone) {
    await wait(500);
    return { sent: true };
  },
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/* SHARED UI                                                            */
/* ------------------------------------------------------------------ */
function Logo() {
  return (
    <div className="flex flex-col items-center mb-6">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl mb-3"
        style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})` }}
      >
        س
      </div>
      <h1 className="font-extrabold text-xl" style={{ color: C.dark }}>سخرتي</h1>
      <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>كلشي لي بغيتي... حتى لباب دارك</p>
    </div>
  );
}

function TextField({ icon: Icon, error, ...props }) {
  return (
    <div>
      <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: C.bg, border: error ? "1px solid #EF4444" : "1px solid transparent" }}>
        <Icon size={17} color="#9CA3AF" />
        <input {...props} className="flex-1 bg-transparent outline-none text-sm font-medium" style={{ color: C.dark }} />
      </div>
      {error && <p className="text-xs mt-1 mr-1" style={{ color: "#EF4444" }}>{error}</p>}
    </div>
  );
}

function PasswordField({ value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: C.bg, border: error ? "1px solid #EF4444" : "1px solid transparent" }}>
        <Lock size={17} color="#9CA3AF" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm font-medium"
          style={{ color: C.dark }}
        />
        <button type="button" onClick={() => setShow(!show)}>
          {show ? <EyeOff size={16} color="#9CA3AF" /> : <Eye size={16} color="#9CA3AF" />}
        </button>
      </div>
      {error && <p className="text-xs mt-1 mr-1" style={{ color: "#EF4444" }}>{error}</p>}
    </div>
  );
}

function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading}
      className="w-full rounded-2xl py-3.5 font-bold text-white flex items-center justify-center gap-2"
      style={{ background: C.primary, opacity: loading ? 0.7 : 1 }}
    >
      {loading && <RotateCw size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* LOGIN SCREEN                                                         */
/* ------------------------------------------------------------------ */
function LoginScreen({ goTo }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const errs = {};
    if (!phone.trim()) errs.phone = "أدخل رقم الهاتف";
    if (!password) errs.password = "أدخل كلمة المرور";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await AuthService.login({ phone, password });
      goTo("home");
    } catch (e) {
      setErrors({ password: "رقم الهاتف أو كلمة المرور غير صحيحة" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Logo />
      <h2 className="font-extrabold text-lg mb-1" style={{ color: C.dark }}>مرحباً بيك من جديد 👋</h2>
      <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>سجل الدخول باش تكمل طلبك</p>

      <div className="flex flex-col gap-3">
        <TextField icon={Phone} placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
        <PasswordField placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <button onClick={() => goTo("forgot")} className="text-xs font-bold self-start" style={{ color: C.primary }}>نسيت كلمة المرور؟</button>
        <PrimaryButton onClick={submit} loading={loading}>تسجيل الدخول</PrimaryButton>
      </div>

      <div className="flex items-center gap-2 my-5">
        <div className="h-px flex-1" style={{ background: "#EEE" }} />
        <span className="text-xs" style={{ color: "#9CA3AF" }}>أو</span>
        <div className="h-px flex-1" style={{ background: "#EEE" }} />
      </div>

      <button onClick={() => goTo("otpLogin")} className="w-full rounded-2xl py-3.5 font-bold flex items-center justify-center gap-2" style={{ background: C.white, color: C.dark, border: "1px solid #EFEFEF" }}>
        <ShieldCheck size={17} /> الدخول برمز عبر SMS
      </button>

      <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
        مازال ماعندكش حساب؟{" "}
        <button onClick={() => goTo("register")} className="font-bold" style={{ color: C.primary }}>سجل الآن</button>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* REGISTER SCREEN                                                      */
/* ------------------------------------------------------------------ */
function RegisterScreen({ goTo, setPendingPhone }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const errs = {};
    if (!name.trim()) errs.name = "أدخل الاسم الكامل";
    if (!phone.trim()) errs.phone = "أدخل رقم الهاتف";
    if (password.length < 6) errs.password = "كلمة المرور خاصها 6 حروف على الأقل";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    await AuthService.register({ name, phone, password });
    await AuthService.sendOtp(phone);
    setLoading(false);
    setPendingPhone(phone);
    goTo("otpVerify");
  };

  return (
    <div className="w-full max-w-sm">
      <Logo />
      <h2 className="font-extrabold text-lg mb-1" style={{ color: C.dark }}>مرحباً بيك فسخرتي 🎉</h2>
      <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>أنشئ حساب باش تبدا تطلب</p>

      <div className="flex flex-col gap-3">
        <TextField icon={User} placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <TextField icon={Phone} placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
        <PasswordField placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <PrimaryButton onClick={submit} loading={loading}>إنشاء حساب</PrimaryButton>
      </div>

      <p className="text-[11px] text-center mt-4" style={{ color: "#9CA3AF" }}>
        بالضغط على «إنشاء حساب» أنت توافق على الشروط والأحكام وسياسة الخصوصية ديال سخرتي.
      </p>

      <p className="text-center text-sm mt-5" style={{ color: "#6B7280" }}>
        عندك حساب من قبل؟{" "}
        <button onClick={() => goTo("login")} className="font-bold" style={{ color: C.primary }}>سجل الدخول</button>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OTP SCREEN (used for register verification AND otp-login)          */
/* ------------------------------------------------------------------ */
function OtpScreen({ phone, goTo, purpose }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(45);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const handleChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 3) inputsRef.current[i + 1]?.focus();
  };

  const submit = async () => {
    const code = digits.join("");
    if (code.length < 4) { setError("أدخل الرمز كاملاً"); return; }
    setLoading(true);
    const res = await AuthService.verifyOtp(phone, code);
    setLoading(false);
    if (res.verified) goTo("home");
    else setError("الرمز غير صحيح، حاول مرة أخرى");
  };

  const resend = async () => {
    await AuthService.sendOtp(phone);
    setSeconds(45);
  };

  return (
    <div className="w-full max-w-sm text-center">
      <Logo />
      <h2 className="font-extrabold text-lg mb-1" style={{ color: C.dark }}>تأكيد رقم الهاتف</h2>
      <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>
        صيفطنا رمز مكون من 4 أرقام لـ<br /><span className="font-bold" style={{ color: C.dark }}>{phone || "رقمك"}</span>
      </p>

      <div className="flex justify-center gap-3 mb-4" dir="ltr">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            maxLength={1}
            className="w-14 h-14 rounded-2xl text-center text-xl font-extrabold outline-none"
            style={{ background: C.bg, color: C.dark, border: error ? "1px solid #EF4444" : "1px solid transparent" }}
          />
        ))}
      </div>
      {error && <p className="text-xs mb-3" style={{ color: "#EF4444" }}>{error}</p>}

      <PrimaryButton onClick={submit} loading={loading}>تأكيد</PrimaryButton>

      <button
        onClick={resend}
        disabled={seconds > 0}
        className="text-xs font-bold mt-4"
        style={{ color: seconds > 0 ? "#C1C5CC" : C.primary }}
      >
        {seconds > 0 ? `إعادة إرسال الرمز بعد ${seconds}ث` : "إعادة إرسال الرمز"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* OTP LOGIN — enter phone first then OTP                              */
/* ------------------------------------------------------------------ */
function OtpLoginScreen({ goTo, setPendingPhone }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!phone.trim()) { setError("أدخل رقم الهاتف"); return; }
    setLoading(true);
    await AuthService.sendOtp(phone);
    setLoading(false);
    setPendingPhone(phone);
    goTo("otpVerify");
  };

  return (
    <div className="w-full max-w-sm">
      <Logo />
      <h2 className="font-extrabold text-lg mb-1" style={{ color: C.dark }}>الدخول برمز التحقق</h2>
      <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>غادي نصيفطو ليك رمز عبر SMS</p>
      <div className="flex flex-col gap-3">
        <TextField icon={Phone} placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} error={error} />
        <PrimaryButton onClick={submit} loading={loading}>إرسال الرمز</PrimaryButton>
      </div>
      <button onClick={() => goTo("login")} className="flex items-center gap-1 text-sm font-bold mt-5 mx-auto" style={{ color: "#6B7280" }}>
        <ArrowRight size={15} /> العودة لتسجيل الدخول
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FORGOT PASSWORD                                                      */
/* ------------------------------------------------------------------ */
function ForgotPasswordScreen({ goTo }) {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    await AuthService.requestPasswordReset(phone);
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#DCFCE7" }}>
          <CheckCircle2 size={30} color={C.success} />
        </div>
        <h2 className="font-extrabold text-lg mb-1" style={{ color: C.dark }}>تم إرسال الرابط</h2>
        <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>تحقق من رسائلك SMS باش تعاود تعمر كلمة المرور</p>
        <PrimaryButton onClick={() => goTo("login")}>العودة لتسجيل الدخول</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <Logo />
      <h2 className="font-extrabold text-lg mb-1" style={{ color: C.dark }}>نسيت كلمة المرور؟</h2>
      <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>أدخل رقم هاتفك وغادي نصيفطو ليك رابط لإعادة التعيين</p>
      <div className="flex flex-col gap-3">
        <TextField icon={Phone} placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <PrimaryButton onClick={submit} loading={loading}>إرسال رابط الاستعادة</PrimaryButton>
      </div>
      <button onClick={() => goTo("login")} className="flex items-center gap-1 text-sm font-bold mt-5 mx-auto" style={{ color: "#6B7280" }}>
        <ArrowRight size={15} /> العودة لتسجيل الدخول
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MOCK HOME (after successful auth — Protected Route demo)            */
/* ------------------------------------------------------------------ */
function ProtectedHomeDemo({ goTo }) {
  return (
    <div className="w-full max-w-sm text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#DCFCE7" }}>
        <CheckCircle2 size={30} color={C.success} />
      </div>
      <h2 className="font-extrabold text-lg mb-1" style={{ color: C.dark }}>تسجيل الدخول ناجح ✅</h2>
      <p className="text-sm mb-6" style={{ color: "#9CA3AF" }}>
        هنا كيتصنع Session حقيقي (JWT من Supabase Auth) ويتم توجيهك تلقائياً للـ Route المحمي — الصفحة الرئيسية.
      </p>
      <button onClick={() => goTo("login")} className="text-sm font-bold" style={{ color: C.primary }}>تسجيل الخروج والعودة</button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ROOT                                                                 */
/* ------------------------------------------------------------------ */
export default function SakhrtiAuth() {
  const [screen, setScreen] = useState("login");
  const [pendingPhone, setPendingPhone] = useState("");

  const renderScreen = () => {
    switch (screen) {
      case "login": return <LoginScreen goTo={setScreen} />;
      case "register": return <RegisterScreen goTo={setScreen} setPendingPhone={setPendingPhone} />;
      case "otpLogin": return <OtpLoginScreen goTo={setScreen} setPendingPhone={setPendingPhone} />;
      case "otpVerify": return <OtpScreen phone={pendingPhone} goTo={setScreen} />;
      case "forgot": return <ForgotPasswordScreen goTo={setScreen} />;
      case "home": return <ProtectedHomeDemo goTo={setScreen} />;
      default: return null;
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: C.bg, minHeight: "100vh" }} className="flex items-center justify-center p-6">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');`}</style>
      {renderScreen()}
    </div>
  );
}
