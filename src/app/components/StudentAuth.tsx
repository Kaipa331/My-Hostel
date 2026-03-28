import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export function StudentAuth() {
  const navigate = useNavigate();
  const { studentLogin, studentSignup } = useAllAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    university: '',
    studentId: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await studentLogin(loginForm.email, loginForm.password);
      if (success) {
        toast.success('Welcome back!');
        navigate('/student/dashboard');
      } else {
        toast.error('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await studentSignup(
        signupForm.name,
        signupForm.email,
        signupForm.password,
        signupForm.phone,
        signupForm.university,
        signupForm.studentId
      );
      
      if (typeof result === 'boolean') {
        if (result) {
          toast.success('Account created successfully!');
          navigate('/student/dashboard');
          return;
        }
        toast.error('Signup failed. Please check your details or try a different email.');
      } else if (result.error) {
        toast.error(`Signup failed: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Signup failed: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Student Portal</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to your account' : 'Create your student account'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Button
              variant={isLogin ? 'default' : 'outline'}
              onClick={() => setIsLogin(true)}
              className="flex-1"
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? 'default' : 'outline'}
              onClick={() => setIsLogin(false)}
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your.email@university.mw"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name *</Label>
                <Input
                  id="signup-name"
                  placeholder="Precious Kaipa"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email *</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your.email@university.mw"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-phone">Phone Number *</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="+265 991 234 567"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="signup-university">University *</Label>
                <Select
                  value={signupForm.university}
                  onValueChange={(value) => setSignupForm({...signupForm, university: value})}
                >
                  <SelectTrigger id="signup-university">
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
              <div>
                <Label htmlFor="signup-studentId">Student ID *</Label>
                <Input
                  id="signup-studentId"
                  placeholder="e.g. UNIMA/2024/001"
                  value={signupForm.studentId}
                  onChange={(e) => setSignupForm({...signupForm, studentId: e.target.value})}
                  required
                />
              </div>
              <div className="pt-4 space-y-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Back to Home
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}