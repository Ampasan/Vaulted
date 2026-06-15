import { useCallback } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import NotificationItem from '../components/features/notifications/NotificationItem';
import { useNotification } from '../hooks/useNotification';
import { formatDate } from '../utils/formatDate';

const NotificationsPage = () => {
  const {
    notifications,
    loading,
    unreadCount,
    markAllAsRead,
    dismissNotification,
    
  } = useNotification();

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const mapType = (type) => {
    switch (type) {
      case 'outbid':
      case 'auction_won':
        return 'trophy';
      case 'auction_ending':
        return 'bell';
      case 'transaction_success':
        return 'dollar';
      default:
        return 'bell';
    }
  };

  const mapTitle = (type) => {
    switch (type) {
      case 'outbid':
        return 'You have been outbid';
      case 'auction_won':
        return 'Auction Won!';
      case 'auction_ending':
        return 'Auction Ending Soon';
      case 'transaction_success':
        return 'Transaction Successful';
      default:
        return 'Notification';
    }
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
          {loading ? (
            <p className="py-16 text-center text-[13px] text-gray-500 font-medium border-b border-[#dcd9ce]">
              Loading notifications...
            </p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id || notification.id}
                type={mapType(notification.type)}
                title={mapTitle(notification.type)}
                description={notification.message}
                timestamp={formatDate(notification.createdAt)}
                isRead={notification.isRead}
                onDismiss={() => dismissNotification(notification._id || notification.id)}
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
