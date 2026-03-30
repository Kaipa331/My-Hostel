import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export function LandlordAuth() {
  const navigate = useNavigate();
  const { login, signup, user, isLoading: isAuthLoading } = useAllAuth();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && user.role === 'landlord') {
      navigate('/landlord/dashboard');
    }
  }, [user, navigate]);

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Signup form
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
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
        const errorMsg = typeof result === 'object' ? result.error : 'Invalid credentials';
        toast.error(errorMsg);
      }
    } catch (error) {
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
      const result = await signup(
        signupForm.name,
        signupForm.email,
        signupForm.password,
        signupForm.phone,
        'landlord'
      );
      if (result === true) {
        toast.success('Account created successfully! Please wait for admin approval.');
        setLoginForm({ ...loginForm, email: signupForm.email });
      } else {
        const errorMsg = typeof result === 'object' ? result.error : 'Signup failed.';
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsSignupLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-200 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-slate-800 mb-6">
            <img src="/logo.png" alt="MyHostel.com Logo" className="h-20 w-20 object-contain shadow-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Landlord Portal</h1>
          <p className="text-slate-600 mt-2">Manage your hostels and reach more students</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/50 backdrop-blur-sm p-1 rounded-xl shadow-inner">
            <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-1.5 bg-blue-600 w-full" />
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Login to manage your hostel listings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="landlord@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoginLoading}>
                      {isLoginLoading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Authenticating...
                        </span>
                      ) : 'Sign In'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-1.5 bg-indigo-600 w-full" />
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Start listing your hostels today</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Precious Kaipa"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                      className="bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="landlord@example.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      className="bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+265 991 234 567"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                      className="bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      className="bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                      className="bg-slate-50 border-slate-200"
                      required
                    />
                  </div>
                  <div className="pt-2">
                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSignupLoading}>
                      {isSignupLoading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Creating Account...
                        </span>
                      ) : 'Create Account'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button 
            variant="ghost" 
            className="text-slate-600 hover:text-slate-900 flex items-center gap-2 mx-auto"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}