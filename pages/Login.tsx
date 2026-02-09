import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Lock, User as UserIcon, AlertCircle, ArrowRight, Users, GraduationCap } from 'lucide-react';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login: React.FC = () => {
  const { login, loginWithGoogle, register, error, isLoading, setError } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [roll, setRoll] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [batch, setBatch] = useState('15th Batch');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (password.length < 4) {
        alert("Password too short");
        return;
      }
      await register(roll, password, batch);
    } else {
      await login(roll, password);
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 p-4">
      <Card className="w-full max-w-sm p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-900">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isRegister ? 'Student Registration' : 'Welcome to BTEC'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">University Companion App</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 flex items-start gap-2 border border-red-100">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Roll Number</label>
            <div className="relative group">
              <UserIcon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="230404..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          {isRegister && (
             <div className="animate-in slide-in-from-top-2 duration-200">
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Select Batch</label>
                <div className="relative group">
                   <Users className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                   <select
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium appearance-none"
                   >
                      <option value="12th Batch">12th Batch</option>
                      <option value="13th Batch">13th Batch</option>
                      <option value="14th Batch">14th Batch</option>
                      <option value="15th Batch">15th Batch</option>
                   </select>
                </div>
             </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                required
              />
            </div>
          </div>

          {isRegister && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                  required={isRegister}
                />
              </div>
            </div>
          )}

          <Button type="submit" fullWidth disabled={isLoading} className="mt-2">
            {isLoading ? 'Processing...' : (isRegister ? 'Create Account' : 'Login')}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-6">
           <div className="flex-1 h-px bg-gray-200"></div>
           <span className="text-xs font-medium text-gray-400">OR</span>
           <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors active:scale-95"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <button 
            onClick={() => { setIsRegister(!isRegister); setError(null); }}
            className="text-sm font-semibold text-blue-900 hover:text-blue-700 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            {isRegister ? 'Already have an account? Login' : 'New Student? Register Now'}
            <ArrowRight size={14} />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;