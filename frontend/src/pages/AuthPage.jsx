import { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import LoginForm from '../components/features/auth/LoginForm';
import RegisterForm from '../components/features/auth/RegisterForm';

const AUTH_IMAGE =
  'https://res.cloudinary.com/drrmbeiyk/image/upload/v1781276276/AuthImage_vfhrqd.webp';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex">
      {/* Left panel — form */}
      <div className="w-full lg:w-1/2 min-h-screen bg-cream flex flex-col">
        <div className="px-10 md:px-16 lg:px-20 pt-10 md:pt-12">
          <div className="text-2xl font-black tracking-tighter text-black mb-10">VAULTED</div>
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        <div className="flex-1 flex items-center px-10 md:px-16 lg:px-20 py-10">
          {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>

        <div className="px-10 md:px-16 lg:px-20 pb-10">
          <p className="text-[11px] tracking-[0.2em] uppercase font-mono text-gray-400 leading-relaxed">
            SECURE YOUR LEGACY.
            TRADE THE EXTRAORDINARY.
          </p>
        </div>
      </div>

      {/* Right panel — hero image */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
        <img
          src={AUTH_IMAGE}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
    </div>
  );
};

export default AuthPage;
