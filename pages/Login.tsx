import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Lock, User as UserIcon, AlertCircle, ArrowRight, Users, GraduationCap } from 'lucide-react';

const Login: React.FC = () => {
  const { login, register, error, isLoading, setError } = useAuth();
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