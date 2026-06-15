import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import Input from '../../ui/Input';

const GOOGLE_ICON =
  'https://res.cloudinary.com/drrmbeiyk/image/upload/v1781292221/google_zmo1ff.svg';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (fullName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(fullName, email, password);
      if (result.success) {
        console.log('Registration successful');
        navigate('/marketplace');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCredentialResponse = async (response) => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await googleLogin(response.credential);
      if (result.success) {
        console.log('Google login successful');
        navigate('/marketplace');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
      console.error('Google registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleButtonDivRegisterForm'),
          { theme: 'outline', size: 'large', width: 380 }
        );
      } catch (err) {
        console.error('Failed to initialize Google Sign-In:', err);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-95 space-y-8">
      <div className="space-y-2">
        <h1 className="text-[42px] font-serif font-bold text-black leading-tight tracking-tight">
          Create Account
        </h1>
        <p className="text-sm font-mono text-gray-400">Join the Vaulted network</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-mono uppercase tracking-wider rounded">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          placeholder="Alexander V. Rothschild"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white py-4 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
        </button>
      </form>

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-gray-300" />
        <span className="text-[12px] tracking-[0.15em] uppercase font-mono text-gray-400">OR</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>

      <div className="relative w-full flex justify-center">
        <div
          id="googleButtonDivRegisterForm"
          className="absolute inset-0 opacity-0 z-10 cursor-pointer overflow-hidden [&>div]:w-full [&>div]:h-full"
        />
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 text-[10px] tracking-[0.2em] uppercase font-bold text-black hover:bg-gray-50 transition-colors"
        >
          <img src={GOOGLE_ICON} alt="" className="w-4 h-4" />
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
