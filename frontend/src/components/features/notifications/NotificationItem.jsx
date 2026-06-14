import { Bell, Clock, DollarSign, Shield, Trophy, X } from 'lucide-react';
import StatusDot from '../../ui/StatusDot';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const typeConfig = {
  trophy: {
    Icon: Trophy,
    iconClass: 'text-red-500',
    bgClass: 'bg-red-50',
  },
  dollar: {
    Icon: DollarSign,
    iconClass: 'text-gray-500',
    bgClass: 'bg-[#ebe8df]',
  },
  shield: {
    Icon: Shield,
    iconClass: 'text-gray-500',
    bgClass: 'bg-[#ebe8df]',
  },
  bell: {
    Icon: Bell,
    iconClass: 'text-gray-500',
    bgClass: 'bg-[#ebe8df]',
  },
};

const NotificationItem = ({
  type = 'bell',
  title,
  description,
  timestamp,
  isRead = false,
  onDismiss,
  className = '',
}) => {
  const config = typeConfig[type] || typeConfig.bell;
  const { Icon, iconClass, bgClass } = config;

  return (
    <article
      className={cx(
        'relative flex items-start gap-5 py-7 border-b border-[#dcd9ce] transition-colors hover:bg-cream-light/50 group',
        className
      )}
    >
      <div
        className={cx(
          'shrink-0 w-10 h-10 flex items-center justify-center transition-opacity',
          bgClass,
          isRead && 'opacity-50'
        )}
      >
        <Icon size={18} strokeWidth={2} className={iconClass} />
      </div>

      <div className="flex-1 min-w-0 pr-8">
        <div className="flex items-center gap-2 mb-1.5">
          {!isRead && <StatusDot status="unread" size="xs" variant="dot" />}
          <h3
            className={cx(
              'text-[14px] font-bold leading-snug',
              isRead ? 'text-gray-400' : 'text-black'
            )}
          >
            {title}
          </h3>
        </div>

        {description && (
          <p
            className={cx(
              'text-[13px] font-medium leading-relaxed mb-3',
              isRead ? 'text-gray-400' : 'text-gray-500'
            )}
          >
            {description}
          </p>
        )}

        {timestamp && (
          <p className="inline-flex items-center gap-1.5 text-[12px] text-gray-400 font-medium">
            <Clock size={11} strokeWidth={2} />
            {timestamp}
          </p>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-7 right-0 p-1 text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Dismiss notification"
        >
          <X size={14} strokeWidth={2} />
        </button>
      )}
    </article>
  );
};

export default NotificationItem;
