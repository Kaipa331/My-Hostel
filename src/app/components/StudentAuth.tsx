import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap, AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

type AuthStatus = 'idle' | 'authenticating' | 'verifying' | 'success' | 'failed';

export function StudentAuth() {
  const navigate = useNavigate();
  const { studentLogin, studentSignup, isLoading: isAuthLoading, connectionError, student } = useAllAuth();
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

  // Redirect if already logged in
  useEffect(() => {
    if (student) {
      navigate('/student/dashboard');
    }
  }, [student, navigate]);

  // Safety: reset status if we switch tabs
  useEffect(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, [isLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionError) {
      toast.error("Cannot login: " + connectionError);
      return;
    }

    setStatus('authenticating');
    setErrorMessage(null);

    try {
      console.log('Attempting student login...');
      const result = await studentLogin(loginForm.email, loginForm.password);
      
      if (result === true) {
        setStatus('success');
        toast.success('Welcome back!');
        // Allow state to settle before navigating
        setTimeout(() => navigate('/student/dashboard'), 500);
      } else {
        setStatus('failed');
        const errorText = typeof result === 'object' ? result.error : 'Invalid credentials. Please check your email and password.';
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (error: any) {
      console.error('Login component error:', error);
      setStatus('failed');
      const msg = error.message || 'Login failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionError) {
      toast.error("Cannot sign up: " + connectionError);
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
        setErrorMessage("Please check your email to confirm your account before logging in.");
        // We don't navigate immediately as they might need to confirm email
      } else {
        setStatus('failed');
        const errorText = typeof result === 'object' ? result.error : 'Signup failed. Please check your details.';
        setErrorMessage(errorText);
        toast.error(errorText);
      }
    } catch (error: any) {
      console.error('Signup component error:', error);
      setStatus('failed');
      const msg = error.message || 'Signup failed. Please try again.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const isInAction = status === 'authenticating' || status === 'verifying';

  // Global Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium animate-pulse">Initializing Secure Session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-600">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-24 h-24 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-slate-800">
            <img src="/logo.png" alt="MyHostel.com Logo" className={`h-20 w-20 object-contain ${isInAction ? 'animate-pulse scale-95' : ''}`} />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900">Student Portal</CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              {isLogin ? 'Sign in to access your dashboard' : 'Create your student account to start booking'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {connectionError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 text-amber-800">
              <WifiOff className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">Connection Issues Detected</p>
                <p className="text-xs opacity-90">{connectionError}</p>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs text-amber-900 underline mt-1"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <Button
              variant={isLogin ? 'default' : 'ghost'}
              onClick={() => setIsLogin(true)}
              className={`flex-1 transition-all ${isLogin ? 'shadow-sm' : ''}`}
              disabled={isInAction}
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'ghost'}
              onClick={() => setIsLogin(false)}
              className={`flex-1 transition-all ${!isLogin ? 'shadow-sm' : ''}`}
              disabled={isInAction}
            >
              Sign Up
            </Button>
          </div>

          {errorMessage && (
            <div className={`mb-4 p-3 border rounded-md flex items-start gap-2 text-sm animate-in fade-in slide-in-from-top-1 ${
              status === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your.email@university.mw"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                  disabled={isInAction}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
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
                  required
                  disabled={isInAction}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isInAction}>
                  {isInAction ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Signing in...
                    </span>
                  ) : 'Sign In'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11"
                  onClick={() => navigate('/')}
                  disabled={isInAction}
                >
                  Back to Home
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name *</Label>
                <Input
                  id="signup-name"
                  placeholder="Precious Kaipa"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  required
                  disabled={isInAction}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email Address *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@university.mw"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  required
                  disabled={isInAction}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  required
                  disabled={isInAction}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-phone">Phone Number *</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+265 991 234 567"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                  required
                  disabled={isInAction}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-university">University *</Label>
                <Select
                  value={signupForm.university}
                  onValueChange={(value) => setSignupForm({...signupForm, university: value})}
                  disabled={isInAction}
                >
                  <SelectTrigger id="signup-university" className="bg-gray-50 border-gray-200 focus:bg-white transition-colors">
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
              <div className="space-y-2">
                <Label htmlFor="signup-studentId">Student ID Number *</Label>
                <Input
                  id="signup-studentId"
                  placeholder="e.g. UNIMA/2024/001"
                  value={signupForm.studentId}
                  onChange={(e) => setSignupForm({...signupForm, studentId: e.target.value})}
                  required
                  disabled={isInAction}
                  className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                />
              </div>
              <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isInAction}>
                  {isInAction ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11"
                  onClick={() => navigate('/')}
                  disabled={isInAction}
                >
                  Back to Home
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}