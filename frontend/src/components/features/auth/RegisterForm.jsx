import { useState } from 'react';
import Input from '../../ui/Input';

const GOOGLE_ICON =
  'https://res.cloudinary.com/drrmbeiyk/image/upload/v1781292221/google_zmo1ff.svg';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full max-w-95 space-y-8">
      <div className="space-y-2">
        <h1 className="text-[42px] font-serif font-bold text-black leading-tight tracking-tight">
          Create Account
        </h1>
        <p className="text-sm font-mono text-gray-400">Join the Vaulted network</p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Full Name"
          type="text"
          placeholder="Alexander V. Rothschild"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-4 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-gray-900 transition-colors"
        >
          CREATE ACCOUNT →
        </button>
      </form>

      <div className="flex items-center gap-4">
        <div className="flex-1 border-t border-gray-300" />
        <span className="text-[12px] tracking-[0.15em] uppercase font-mono text-gray-400">OR</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 text-[10px] tracking-[0.2em] uppercase font-bold text-black hover:bg-gray-50 transition-colors"
      >
        <img src={GOOGLE_ICON} alt="" className="w-4 h-4" />
        CONTINUE WITH GOOGLE
      </button>
    </div>
  );
};

export default RegisterForm;
