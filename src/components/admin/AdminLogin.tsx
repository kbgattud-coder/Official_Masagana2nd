import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { AdminAuth } from '../../data/adminStore';
import { AdminUser } from '../../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite
}) => {
  const [tab, setTab] = useState<'admin' | 'superadmin'>('admin');
  
  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Superadmin Form State
  const [superPassword, setSuperPassword] = useState('');

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await AdminAuth.loginAdmin(adminEmail, adminPassword);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.error || 'Invalid credentials');
    }
    setIsLoading(false);
  };

  const handleSuperadminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await AdminAuth.loginSuperAdmin(superPassword);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.error || 'Invalid Superadmin password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#EDEBE8] text-[#1E232A] flex flex-col justify-center items-center px-4 py-12 relative selection:bg-[#E2D5C3] selection:text-[#1E232A]">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DFC8A4]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Website Button */}
      <button
        onClick={onBackToSite}
        id="admin-login-back-button"
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F3EFEA] border border-[#D9D2C4] text-[#2C3540] text-xs font-semibold transition-all cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Ward Website</span>
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#FAF8F5] border border-[#E6E1D8] rounded-3xl p-8 sm:p-9 shadow-xl relative z-10">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF4E8] border border-[#EADFCB] text-[#554228] flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1E232A] tracking-tight">
            Masagana 2nd Ward
          </h1>
          <p className="text-xs text-[#8C6D40] font-semibold tracking-wide uppercase mt-1">
            Administrative Management Portal
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#EFEAE1] p-1 rounded-2xl border border-[#D9D2C4] mb-6">
          <button
            type="button"
            onClick={() => { setTab('admin'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'admin'
                ? 'bg-white text-[#1E232A] shadow-xs'
                : 'text-[#6C7785] hover:text-[#1E232A]'
            }`}
          >
            Ward Admin
          </button>
          <button
            type="button"
            onClick={() => { setTab('superadmin'); setError(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'superadmin'
                ? 'bg-white text-[#1E232A] shadow-xs'
                : 'text-[#6C7785] hover:text-[#1E232A]'
            }`}
          >
            Super Admin
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Ward Admin Form */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C97A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-sm placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#8C97A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-sm placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C97A4] hover:text-[#1E232A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1C2026] hover:bg-black text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#DFC8A4]" />
                  <span>Sign In as Ward Admin</span>
                </>
              )}
            </button>

          </form>
        )}

        {/* Superadmin Form */}
        {tab === 'superadmin' && (
          <form onSubmit={handleSuperadminSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#FAF4E8] border border-[#EADFCB] text-xs text-[#554228]">
              <p className="font-semibold text-[#554228] mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C6D40]" />
                <span>Superadmin Access</span>
              </p>
              Direct passkey login for complete administrative control.
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A5568] mb-1.5">
                Superadmin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#8C97A4] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={superPassword}
                  onChange={(e) => setSuperPassword(e.target.value)}
                  placeholder="Enter superadmin password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-white border border-[#D9D2C4] text-[#1E232A] text-sm placeholder-[#8C97A4] focus:outline-hidden focus:border-[#554228] focus:ring-1 focus:ring-[#554228] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C97A4] hover:text-[#1E232A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1C2026] hover:bg-black text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#DFC8A4]" />
                  <span>Enter Superadmin Portal</span>
                </>
              )}
            </button>

          </form>
        )}

      </div>

      {/* Footer Security Note */}
      <div className="mt-8 text-center text-xs text-[#717E8C] max-w-sm">
        <p>Masagana 2nd Ward • Antipolo Philippines Stake</p>
        <p className="mt-0.5">Authorised leadership & communication access only.</p>
      </div>
    </div>
  );
};
