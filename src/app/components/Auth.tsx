import { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useAllAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { supabase } from "../../lib/supabase";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"student" | "landlord">("student");
  const [loading, setLoading] = useState(false);
  const { studentLogin, login: landlordLogin, studentSignup, signup: landlordSignup } = useAllAuth();
  const navigate = useNavigate();

  const signIn = async (email: string, pass: string) => {
    // Attempt standard login (landlord and student check roles inside context methods but rely on the same supabase auth call)
    // To handle agnostic login gracefully:
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return { error };
    if (!data.user) return { error: new Error('Login failed') };

    // Check role then route properly
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single() as any;
    if (profile?.role === 'landlord') {
      const res = await landlordLogin(email, pass);
      if (res !== true) return res;
      navigate("/landlord/dashboard");
      return { error: null };
    } else {
      const res = await studentLogin(email, pass);
      if (res !== true) return res;
      navigate("/student/dashboard");
      return { error: null };
    }
  };

  const signUp = async (email: string, pass: string, name: string, role: "student" | "landlord") => {
    if (role === 'student') return await studentSignup(name, email, pass, '', '', '');
    return await landlordSignup(name, email, pass, '', role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const result = await signIn(email, password);
      // Wait, result could be `true` or an object `{error: string}` from useAllAuth helpers, 
      // but my signIn method returns { error: ... }
      if (result && typeof result === 'object' && result.error) {
        toast.error("Login failed: " + ((result.error as any).message || result.error));
      } else {
        // Navigation already handled inside signIn function based on role
      }
    } else {
      const result = await signUp(email, password, name, role);
      if (result && typeof result === 'object' && result.error) {
        toast.error("Signup failed: " + ((result.error as any).message || result.error));
      } else {
        toast.success("Account created! Check your email to verify your account.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mx-auto mb-6 sm:mb-8 animate-in fade-in zoom-in duration-700">
            <img
              src="/logo.jpg"
              alt="MyHostel Logo"
              className="w-20 h-20 sm:w-32 sm:h-32 object-contain rounded-2xl sm:rounded-3xl shadow-2xl shadow-primary/10 border border-border/50 bg-white p-2"
            />
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-foreground mb-2 sm:mb-4">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground font-medium">
            {isLogin ? "Sign in to your MyHostel account" : "Join MyHostel as a student or landlord"}
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border/50 shadow-rich p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Precious Kaipa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["student", "landlord"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-3 rounded-xl border-2 text-sm font-medium capitalize transition-colors ${role === r
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/50"
                          }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
