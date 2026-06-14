import { useMemo, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import NotificationItem from '../components/features/notifications/NotificationItem';

const initialNotifications = [
  {
    id: 1,
    type: 'trophy',
    title: "You've been outbid on LOT #042",
    description: 'Patek Philippe Grandmaster Chime — New high bid: CHF 31,800,000',
    timestamp: '2 minutes ago',
    isRead: false,
  },
  {
    id: 2,
    type: 'dollar',
    title: 'Settlement initiated — LOT #039',
    description: 'Wire transfer #VLT-982X-77 has been received and confirmed by custodian.',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: 3,
    type: 'shield',
    title: 'New device login detected',
    description: 'Geneva, Switzerland — Safari on macOS — Nov 24, 2023 14:22 GMT',
    timestamp: '3 hours ago',
    isRead: false,
  },
  {
    id: 4,
    type: 'bell',
    title: 'Auction starting in 30 minutes',
    description: 'Hermès Exotics Collection — Commencing 12.06.2026 | 14:00 GMT',
    timestamp: '29 minutes ago',
    isRead: true,
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const handleMarkAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const handleDismiss = (id) => {
    setNotifications((current) => current.filter((notification) => notification.id !== id));
  };

  return (
    <div className="flex flex-col w-full bg-cream text-ink min-h-screen">
      <Navbar />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-32">
        <Header
          breadcrumb={
            <>
              VAULTED <span className="mx-2">&mdash;</span> NOTIFICATIONS
            </>
          }
          title="Notifications"
          action={
            unreadCount > 0
              ? { label: 'Mark All Read', onClick: handleMarkAllRead }
              : undefined
          }
        />

        <div className="mt-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                type={notification.type}
                title={notification.title}
                description={notification.description}
                timestamp={notification.timestamp}
                isRead={notification.isRead}
                onDismiss={() => handleDismiss(notification.id)}
              />
            ))
          ) : (
            <p className="py-16 text-center text-[13px] text-gray-500 font-medium border-b border-[#dcd9ce]">
              No notifications to display.
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
