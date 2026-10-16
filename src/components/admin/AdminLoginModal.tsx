import React, { useState } from 'react';
import { X, Lock, KeyRound, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await api.adminLogin(password);
      if (res.success && res.token) {
        localStorage.setItem('itl_admin_token', res.token);
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-[#173D2B]/10 p-6 text-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#173D2B]/10 text-[#173D2B] flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-[#173D2B]">تسجيل دخول مدير المطعم</h3>
        <p className="text-xs text-gray-500 mt-1 mb-6">
          الوصول إلى لوحة التحكم لإدارة المنيو، الأسعار، الطلبات، والإعدادات.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">كلمة مرور الإدارة:</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور (الافتراضية: admin123)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#173D2B] text-right"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <span className="text-[11px] text-gray-400 mt-1 block">
              كلمة المرور الافتراضية للتجربة: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">admin123</code> (يمكن تغييرها من الإعدادات).
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#173D2B] hover:bg-[#C83B32] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer text-sm"
          >
            {loading ? 'جاري التحقق...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>
      </div>
    </div>
  );
};
