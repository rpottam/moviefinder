import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn } from 'lucide-react';

const AuthSidebar = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-sm z-[101]
        bg-[#0f1115]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl
        transform transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        p-8 flex flex-col
      `}>

        <div className="flex items-center justify-between mb-12">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <LogIn size={18} className="text-white" />
            </div>
            <h2 className="text-xl font-black text-white tracking-widest">LUME</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-textSecondary hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </div>
          
          <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Experience LUME</h3>
          <p className="text-textSecondary text-sm mb-12 max-w-[260px] mx-auto leading-relaxed font-medium">
            Join a global community of cinephiles. Sync your library across all your devices.
          </p>


          <button 
            onClick={handleGoogleLogin}
            className="glass-button w-full py-4 flex items-center justify-center gap-4 hover:scale-[1.02] transition-all"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" opacity="0.8" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" opacity="0.6" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" opacity="0.9" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-bold">Continue with Google</span>
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-textSecondary uppercase tracking-[0.2em]">
            PickFlicks Security
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthSidebar;
