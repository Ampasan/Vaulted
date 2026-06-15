import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProfileHero from '../components/features/profile/ProfileHero';
import IdentityContact from '../components/features/profile/IdentityContact';
import VerificationStatus from '../components/features/profile/VerificationStatus';
import TransactionPreview from '../components/features/profile/TransactionPreview';
import useTransactions from '../hooks/useTransactions';

const profileData = {
  verificationItems: [
    { label: 'Identity (KYC)', status: 'verified', statusLabel: 'Verified' },
    { label: 'Proof of Funds', status: 'verified', statusLabel: 'Verified' },
    { label: 'Accredited Investor', status: 'pending', statusLabel: 'Pending Review' },
  ]
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatMemberSince = (dateString) => {
  if (!dateString) return 'March 2021';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch (e) {
    return 'March 2021';
  }
};

const getMemberId = (id) => {
  if (!id) return '#VLT-ID-8849';
  return `#VLT-ID-${id.substring(id.length - 4).toUpperCase()}`;
};

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const { transactions, loading: txLoading } = useTransactions();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col w-full bg-cream text-ink min-h-screen justify-center items-center font-mono uppercase tracking-[0.2em] text-xs">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  const initials = getInitials(user.name);
  const memberId = getMemberId(user.id);
  const memberSince = formatMemberSince(user.createdAt);

  const identityFields = [
    { label: 'Full Name', value: user.name },
    { label: 'Email Address', value: user.email },
    { label: 'Location', value: 'Zurich, Switzerland' },
    { label: 'Phone Number', value: '+41 44 234 11 00' },
  ];

  return (
    <div className="flex flex-col w-full bg-cream text-ink min-h-screen">
      <Navbar activeLink="profile" />

      <ProfileHero
        name={user.name}
        initials={initials}
        memberId={memberId}
        memberSince={memberSince}
      />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-10 md:pt-12 pb-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_470px] gap-10 lg:gap-12 mb-16 md:mb-20">
          <IdentityContact fields={identityFields} />
          <VerificationStatus items={profileData.verificationItems} />
        </div>

        {txLoading ? (
          <div className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase py-8">
            Loading transactions...
          </div>
        ) : (
          <TransactionPreview transactions={transactions.slice(0, 3)} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
