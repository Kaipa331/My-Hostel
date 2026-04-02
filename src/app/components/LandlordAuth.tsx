import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RefreshCw, ArrowLeft, Home } from 'lucide-react';
import { toast } from 'sonner';

export function LandlordAuth() {
  const navigate = useNavigate();
  const { login, signup, user, isLoading: isAuthLoading } = useAllAuth();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === 'landlord') navigate('/landlord/dashboard');
  }, [user, navigate]);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
      if (result === true) {
        toast.success('Login successful!');
        navigate('/landlord/dashboard');
      } else {
        toast.error(typeof result === 'object' ? result.error : 'Invalid credentials');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSignupLoading(true);
    try {
      const result = await signup(signupForm.name, signupForm.email, signupForm.password, signupForm.phone, 'landlord');
      if (result === true) {
        toast.success('Account created! Please wait for admin approval.');
        setLoginForm({ ...loginForm, email: signupForm.email });
      } else {
        toast.error(typeof result === 'object' ? result.error : 'Signup failed.');
      }
    } catch {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsSignupLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 px-4 py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="hidden lg:block">
          <div className="rounded-[2rem] border border-border/60 bg-card/85 p-8 shadow-rich">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-primary">Landlord Access</p>
            <h2 className="mt-4 text-4xl font-display font-black tracking-tight text-foreground">
              Manage properties, tenants, and listing performance from one dashboard.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Use your landlord account to publish hostels, monitor bookings, and handle inquiries without juggling spreadsheets.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                'Create and update hostel listings quickly',
                'Track booking activity and student interest',
                'Use one landlord account for all your properties',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-md justify-self-center">
          <div className="mb-9 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-primary/20 bg-background shadow-xl shadow-primary/10">
              <img src="/logo.png" alt="MyHostel.com Logo" className="h-16 w-16 object-contain" />
            </div>
            <h1 className="text-3xl font-display font-black text-foreground tracking-tight">Landlord Login</h1>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              Sign in to manage listings or create your landlord account.
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-5 grid w-full grid-cols-2 rounded-xl bg-muted p-1">
              <TabsTrigger value="login" className="rounded-lg font-semibold">Login</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg font-semibold">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="animate-slide-up">
              <Card className="overflow-hidden rounded-3xl border border-border/60 shadow-2xl shadow-primary/5">
                <div className="h-1 w-full bg-primary" />
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl font-display font-bold">Landlord Login</CardTitle>
                  <CardDescription>Sign in to manage your hostel listings</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-7 pt-3">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="landlord@example.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="h-11 rounded-xl border-border/60 bg-muted/40"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="h-11 rounded-xl border-border/60 bg-muted/40"
                        required
                      />
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-xl font-bold bg-gradient-premium shadow-lg shadow-primary/20" disabled={isLoginLoading}>
                      {isLoginLoading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Authenticating...
                        </span>
                      ) : 'Sign In'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="animate-slide-up">
              <Card className="overflow-hidden rounded-3xl border border-border/60 shadow-2xl shadow-primary/5">
                <div className="h-1 w-full bg-accent" />
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl font-display font-bold">Create Landlord Account</CardTitle>
                  <CardDescription>Start listing your hostels today</CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-7 pt-3">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="s-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Name</Label>
                      <Input
                        id="s-name"
                        placeholder="Your Full Name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="h-11 rounded-xl border-border/60 bg-muted/40"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="s-email" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email Address</Label>
                      <Input
                        id="s-email"
                        type="email"
                        placeholder="landlord@example.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="h-11 rounded-xl border-border/60 bg-muted/40"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="s-phone" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone Number</Label>
                      <Input
                        id="s-phone"
                        type="tel"
                        placeholder="+265 99X XXX XXX"
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                        className="h-11 rounded-xl border-border/60 bg-muted/40"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="s-pass" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</Label>
                        <Input
                          id="s-pass"
                          type="password"
                          placeholder="••••••••"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          className="h-11 rounded-xl border-border/60 bg-muted/40"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="s-confirm" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confirm</Label>
                        <Input
                          id="s-confirm"
                          type="password"
                          placeholder="••••••••"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          className="h-11 rounded-xl border-border/60 bg-muted/40"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-xl font-bold bg-gradient-premium shadow-lg shadow-primary/20" disabled={isSignupLoading}>
                      {isSignupLoading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Creating Account...
                        </span>
                      ) : 'Create Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
