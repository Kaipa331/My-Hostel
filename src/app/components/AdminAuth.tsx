import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAllAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Shield, Lock, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function AdminAuth() {
  const navigate = useNavigate();
  const { adminLogin } = useAllAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await adminLogin(form.email, form.password);
      if (result === true) {
        toast.success('Welcome back, Administrator!');
        navigate('/admin/dashboard');
      } else {
        const errorMsg = typeof result === 'object' ? result.error : 'Invalid admin credentials';
        toast.error(errorMsg);
      }
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-destructive/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center justify-center mb-5 shadow-2xl shadow-destructive/10">
            <Shield className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-display font-black text-white tracking-tight">System Admin</h1>
          <p className="text-neutral-500 mt-2 text-sm">Secure access to the MyHostel platform</p>
        </div>

        <Card className="border border-neutral-800 shadow-2xl overflow-hidden rounded-3xl bg-neutral-900/80 backdrop-blur-md text-white">
          <div className="h-1 bg-destructive w-full" />
          <CardHeader className="pt-6 pb-2">
            <CardTitle className="text-white text-xl font-display font-bold">Admin Login</CardTitle>
            <CardDescription className="text-neutral-400">Enter your credentials to manage the platform</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@myhostel.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                  className="h-11 rounded-xl bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-destructive"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  required
                  className="h-11 rounded-xl bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-600 focus:border-destructive"
                />
              </div>
              <Button type="submit" variant="destructive" className="w-full h-11 font-bold rounded-xl shadow-lg shadow-destructive/20" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Authenticating...</span>
                ) : (
                  <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Secure Login</span>
                )}
              </Button>

              <div className="text-center p-3 bg-neutral-800/60 rounded-xl border border-neutral-700/50 mt-2">
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">Internal Access Only</p>
                <p className="text-xs text-neutral-400 font-mono">admin@hostelfinder.mw / admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button variant="ghost" className="text-neutral-500 hover:text-white flex items-center gap-2 mx-auto" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" /> Return to Public Site
          </Button>
        </div>
      </div>
    </div>
  );
}
