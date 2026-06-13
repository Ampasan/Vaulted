const statusClasses = {
  live: {
    badge: 'bg-red-600 text-white',
    dot: 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-pulse',
  },
  featured: {
    badge: 'bg-[#111] text-white',
    dot: 'bg-white',
  },
  settled: {
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  verified: {
    badge: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500',
  },
  'escrow-hold': {
    badge: 'bg-[#ebe8df] text-gray-700 border border-[#dcd9ce]',
    dot: 'bg-gray-400',
  },
  'in-transit': {
    badge: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
  'pending-review': {
    badge: 'bg-[#ebe8df] text-gray-700 border border-[#dcd9ce]',
    dot: 'bg-gray-400',
  },
  pending: {
    badge: 'bg-amber-100 text-amber-800',
    dot: 'bg-amber-500',
  },
  upcoming: {
    badge: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-400',
  },
  closed: {
    badge: 'bg-[#111] text-white',
    dot: 'bg-gray-300',
  },
  ended: {
    badge: 'bg-[#111] text-white',
    dot: 'bg-gray-300',
  },
  failed: {
    badge: 'bg-red-100 text-red-800',
    dot: 'bg-red-500',
  },
  cancelled: {
    badge: 'bg-red-100 text-red-800',
    dot: 'bg-red-500',
  },
  default: {
    badge: 'bg-gray-100 text-gray-700',
    dot: 'bg-gray-400',
  },
};

const sizeClasses = {
  xs: {
    badge: 'text-[8px] px-2 py-1 tracking-[0.2em]',
    dot: 'w-1 h-1',
  },
  sm: {
    badge: 'text-[10px] px-2 py-1 tracking-[0.15em]',
    dot: 'w-1.5 h-1.5',
  },
  md: {
    badge: 'text-[11px] px-2.5 py-1 tracking-[0.2em]',
    dot: 'w-1.5 h-1.5',
  },
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

const formatStatus = (status) => String(status || '').replace(/[-_]/g, ' ').toUpperCase();

const StatusDot = ({ status = 'live', size = 'sm', variant = 'badge', className = '' }) => {
  const normalizedStatus = String(status).toLowerCase();
  const tone = statusClasses[normalizedStatus] || statusClasses.default;
  const sizing = sizeClasses[size] || sizeClasses.sm;
  const isInline = variant === 'inline';
  const isDotOnly = variant === 'dot';

  if (isDotOnly) {
    return (
      <span
        className={cx('rounded-full shrink-0', tone.dot, sizing.dot, className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cx(
        'inline-flex items-center gap-1.5 font-bold uppercase z-10',
        isInline ? 'bg-transparent text-red-600 px-0' : tone.badge,
        !isInline && sizing.badge,
        className
      )}
    >
      <span
        className={cx(
          'rounded-full',
          isInline && normalizedStatus === 'live' ? 'bg-red-600 animate-pulse' : tone.dot,
          sizing.dot
        )}
      />
      {formatStatus(status)}
    </div>
  );
};

export default StatusDot;
