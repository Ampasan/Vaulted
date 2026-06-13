import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProfileHero from '../components/features/profile/ProfileHero';
import IdentityContact from '../components/features/profile/IdentityContact';
import VerificationStatus from '../components/features/profile/VerificationStatus';
import TransactionPreview from '../components/features/profile/TransactionPreview';

const profileData = {
  name: 'Alexander V. Rothschild',
  initials: 'AVR',
  memberId: '#VLT-ID-8849',
  memberSince: 'March 2021',
  identityFields: [
    { label: 'Full Name', value: 'Alexander V. Rothschild' },
    { label: 'Email Address', value: 'a.rothschild@ubs.com' },
    { label: 'Location', value: 'Zurich, Switzerland' },
    { label: 'Phone Number', value: '+41 44 234 11 00' },
  ],
  verificationItems: [
    { label: 'Identity (KYC)', status: 'verified', statusLabel: 'Verified' },
    { label: 'Proof of Funds', status: 'verified', statusLabel: 'Verified' },
    { label: 'Accredited Investor', status: 'pending', statusLabel: 'Pending Review' },
  ],
  transactions: [
    {
      id: 'VLT-TXN-6898',
      date: '14.6.2026',
      asset: '1962 Ferrari 250 GTO (Shares)',
      transactionId: 'VLT-TXN-6898',
      image: 'https://picsum.photos/96/96?random=41',
      type: 'Acquisition',
      currency: 'CHF',
      amount: '3,200,000',
      status: 'escrow hold',
    },
    {
      id: 'VLT-TXN-6841',
      date: '02.6.2026',
      asset: 'Rolex Daytona \'Paul Newman\'',
      transactionId: 'VLT-TXN-6841',
      image: 'https://picsum.photos/96/96?random=42',
      type: 'Settlement',
      currency: 'CHF',
      amount: '22,500,000',
      status: 'in transit',
    },
    {
      id: 'VLT-TXN-6790',
      date: '18.04.2026',
      asset: 'Basquiat \'Untitled\' 1981',
      transactionId: 'VLT-TXN-6790',
      image: 'https://picsum.photos/96/96?random=43',
      type: 'Auction Win',
      currency: 'CHF',
      amount: '5,480,000',
      status: 'settled',
    },
  ],
};

const ProfilePage = () => {
  return (
    <div className="flex flex-col w-full bg-cream text-ink min-h-screen">
      <Navbar activeLink="profile" />

      <ProfileHero
        name={profileData.name}
        initials={profileData.initials}
        memberId={profileData.memberId}
        memberSince={profileData.memberSince}
      />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-10 md:pt-12 pb-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_470px] gap-10 lg:gap-12 mb-16 md:mb-20">
          <IdentityContact fields={profileData.identityFields} />
          <VerificationStatus items={profileData.verificationItems} />
        </div>

        <TransactionPreview transactions={profileData.transactions} />
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
