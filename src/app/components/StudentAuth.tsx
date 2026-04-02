import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertCircle, RefreshCw, WifiOff, ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';

type AuthStatus = 'idle' | 'authenticating' | 'verifying' | 'success' | 'failed';

export function StudentAuth() {
  const navigate = useNavigate();
  const { studentLogin, studentSignup, signInWithGoogle, isLoading: isAuthLoading, connectionError, student } = useAllAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    university: '',
    studentId: '',
  });

  useEffect(() => {
    if (student) navigate('/student/dashboard');
  }, [student, navigate]);

  useEffect(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, [isLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionError) {
      toast.error('Cannot login: ' + connectionError);
      return;
    }

    setStatus('authenticating');
    setErrorMessage(null);
    try {
      const result = await studentLogin(loginForm.email, loginForm.password);
      if (result === true) {
        setStatus('success');
        toast.success('Welcome back!');
        setTimeout(() => navigate('/student/dashboard'), 500);
      } else {
        setStatus('failed');
        const errorText = typeof result === 'object' ? result.error : 'Invalid credentials';
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (error: any) {
      setStatus('failed');
      const msg = error.message || 'Login failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionError) {
      toast.error('Cannot sign up: ' + connectionError);
      return;
    }

    setStatus('authenticating');
    setErrorMessage(null);
    try {
      const result = await studentSignup(
        signupForm.name,
        signupForm.email,
        signupForm.password,
        signupForm.phone,
        signupForm.university,
        signupForm.studentId
      );
      if (result === true) {
        setStatus('success');
        toast.success('Account created successfully!');
        setErrorMessage('Please check your email to confirm your account.');
      } else {
        setStatus('failed');
        const errorText = typeof result === 'object' ? result.error : 'Signup failed.';
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (error: any) {
      setStatus('failed');
      const msg = error.message || 'Signup failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleGoogleAuth = async () => {
    if (connectionError) {
      toast.error('Cannot continue with Google: ' + connectionError);
      return;
    }

    const result = await signInWithGoogle('student');
    if (result !== true) {
      const errorText = typeof result === 'object' ? result.error : 'Google sign-in failed.';
      toast.error(errorText);
    }
  };

  const isInAction = status === 'authenticating' || status === 'verifying';

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Initializing Secure Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 px-4 py-8 sm:py-12 lg:py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-8">
        <div className="hidden lg:block">
          <div className="rounded-[2rem] border border-border/60 bg-card/85 p-8 shadow-rich">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-primary">Student Access</p>
            <h2 className="mt-4 text-4xl font-display font-black tracking-tight text-foreground">
              Keep your hostel search, saved stays, and bookings in one place.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Sign in as a student to manage reservations, review listing details, and stay on top of payments and inquiries.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                'Track bookings and reservation status',
                'Save hostels and compare options later',
                'Use the same student account across the platform',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center">
          <div className="mb-7 text-center sm:mb-9">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-background shadow-xl shadow-primary/10">
              <img src="/logo.png" alt="MyHostel.com Logo" className={`h-16 w-16 object-contain ${isInAction ? 'animate-pulse' : ''}`} />
            </div>
            <h1 className="text-3xl font-display font-black text-foreground tracking-tight">Student Login</h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Sign in to manage bookings or create your student account.
            </p>
          </div>

          <Card className="overflow-hidden rounded-[1.75rem] border border-border/60 shadow-2xl shadow-primary/5 sm:rounded-3xl">
            <div className={`h-1 w-full transition-colors duration-500 ${isLogin ? 'bg-primary' : 'bg-secondary'}`} />

            <CardHeader className="pb-2 pt-6 text-center">
              <CardTitle className="text-xl font-display font-bold">
                {isLogin ? 'Student Login' : 'Create Student Account'}
              </CardTitle>
              <CardDescription className="text-sm">
                {isLogin ? 'Access your dashboard, saved stays, and bookings' : 'Join thousands of students finding better housing'}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 pb-6 pt-3 sm:px-6 sm:pb-7">
              {connectionError && (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/10 p-3 text-sm text-warning">
                  <WifiOff className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Connection Issues</p>
                    <p className="text-xs opacity-90">{connectionError}</p>
                  </div>
                </div>
              )}

              <div className="mb-5 flex gap-1.5 rounded-xl bg-muted p-1 sm:mb-6">
                <Button
                  variant={isLogin ? 'default' : 'ghost'}
                  onClick={() => setIsLogin(true)}
                  className="h-9 flex-1 rounded-lg text-sm font-semibold"
                  disabled={isInAction}
                >
                  Login
                </Button>
                <Button
                  variant={!isLogin ? 'default' : 'ghost'}
                  onClick={() => setIsLogin(false)}
                  className="h-9 flex-1 rounded-lg text-sm font-semibold"
                  disabled={isInAction}
                >
                  Sign Up
                </Button>
              </div>

              {errorMessage && (
                <div
                  className={`mb-4 flex items-start gap-2 rounded-xl border p-3 text-sm animate-slide-up ${
                    status === 'success'
                      ? 'border-success/20 bg-success/10 text-success'
                      : 'border-destructive/20 bg-destructive/10 text-destructive'
                  }`}
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@university.mw"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      disabled={isInAction}
                      className="h-11 rounded-xl border-border/60 bg-muted/40 focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      disabled={isInAction}
                      className="h-11 rounded-xl border-border/60 bg-muted/40 focus:border-primary/50"
                    />
                  </div>
                  <Button type="submit" className="mt-2 h-11 w-full rounded-xl text-sm font-bold bg-gradient-premium shadow-lg shadow-primary/20" disabled={isInAction}>
                    {isInAction ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Signing in...
                      </span>
                      ) : 'Sign In'}
                  </Button>
                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleAuth}
                    disabled={isInAction}
                    className="h-11 w-full rounded-xl border-border/60 bg-background/80 text-sm font-semibold"
                  >
                    <GoogleIcon />
                    Google
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      placeholder="Your Full Name"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                      disabled={isInAction}
                      className="h-11 rounded-xl border-border/60 bg-muted/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@university.mw"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      disabled={isInAction}
                      className="h-11 rounded-xl border-border/60 bg-muted/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      disabled={isInAction}
                      className="h-11 rounded-xl border-border/60 bg-muted/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-university" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      University <span className="text-muted-foreground/50">(optional)</span>
                    </Label>
                    <Select
                      value={signupForm.university}
                      onValueChange={(value) => setSignupForm({ ...signupForm, university: value })}
                      disabled={isInAction}
                    >
                      <SelectTrigger id="signup-university" className="h-11 rounded-xl border-border/60 bg-muted/40">
                        <SelectValue placeholder="Select your university" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="University of Malawi (UNIMA)">University of Malawi (UNIMA)</SelectItem>
                        <SelectItem value="Mzuzu University">Mzuzu University</SelectItem>
                        <SelectItem value="Malawi University of Business and Applied Sciences (MUBAS)">MUBAS</SelectItem>
                        <SelectItem value="Lilongwe University of Agriculture and Natural Resources (LUANAR)">LUANAR</SelectItem>
                        <SelectItem value="Malawi University of Science and Technology (MUST)">MUST</SelectItem>
                        <SelectItem value="Catholic University of Malawi">Catholic University of Malawi</SelectItem>
                        <SelectItem value="Kamuzu University of Health Sciences">Kamuzu University of Health Sciences</SelectItem>
                        <SelectItem value="DMI St. John the Baptist University">DMI St. John the Baptist University</SelectItem>
                        <SelectItem value="African Bible College">African Bible College</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-phone" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Phone <span className="text-muted-foreground/50">(optional)</span>
                      </Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+265 99X XXX XXX"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        disabled={isInAction}
                        className="h-11 rounded-xl border-border/60 bg-muted/40"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="signup-student-id" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Student ID <span className="text-muted-foreground/50">(optional)</span>
                      </Label>
                      <Input
                        id="signup-student-id"
                        placeholder="Registration number"
                        value={signupForm.studentId}
                        onChange={(e) => setSignupForm({ ...signupForm, studentId: e.target.value })}
                        disabled={isInAction}
                        className="h-11 rounded-xl border-border/60 bg-muted/40"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="mt-2 h-11 w-full rounded-xl text-sm font-bold bg-gradient-premium shadow-lg shadow-primary/20" disabled={isInAction}>
                    {isInAction ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Creating account...
                      </span>
                      ) : 'Create Account'}
                  </Button>
                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/60" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleAuth}
                    disabled={isInAction}
                    className="h-11 w-full rounded-xl border-border/60 bg-background/80 text-sm font-semibold"
                  >
                    <GoogleIcon />
                    Google
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              Browse Hostels
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3.1.8 3.8 1.4l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12 9.5 9.5 0 0 0 12 21.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12Z" />
      <path fill="#34A853" d="M2.5 12c0 3.8 2.2 7.1 5.4 8.6l3-2.3c-1.5-.5-2.8-1.6-3.6-3.1L2.5 12Z" />
      <path fill="#4A90E2" d="M21.1 10.8H12v3.9h5.4c-.3 1.3-1.4 2.5-2.9 3.2l3 2.3c1.8-1.7 3.6-4.9 3.6-8.2 0-.4 0-.8-.1-1.2Z" />
      <path fill="#FBBC05" d="M7.3 14.9A6 6 0 0 1 6.1 12c0-1 .2-2 .6-2.9l-3-2.3A9.4 9.4 0 0 0 2.5 12c0 1.7.5 3.3 1.2 4.7l3.6-1.8Z" />
    </svg>
  );
}
