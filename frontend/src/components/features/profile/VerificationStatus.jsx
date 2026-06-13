import { ShieldCheck } from 'lucide-react';
import StatusDot from '../../ui/StatusDot';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const statusToneMap = {
  verified: 'verified',
  pending: 'pending-review',
};

const statusTextClasses = {
  verified: 'text-green-700',
  pending: 'text-gray-600',
};

const VerificationStatus = ({ items = [], className = '' }) => {
  return (
    <aside
      className={cx(
        'border border-[#dcd9ce] bg-cream-light p-6 md:p-8 h-fit',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck size={16} strokeWidth={2} className="text-black" />
        <h3 className="text-[15px] font-black tracking-tight text-black">
          Verification Status
        </h3>
      </div>

      <ul className="flex flex-col">
        {items.map((item, index) => (
          <li
            key={item.label}
            className={cx(
              'grid grid-cols-[minmax(0,1fr)_max-content] items-center gap-14 py-3',
              index !== items.length - 1 && 'border-b border-[#dcd9ce]'
            )}
          >
            <div className="flex items-center gap-4 min-w-0">
              <StatusDot
                status={statusToneMap[item.status] || item.status}
                size="sm"
                variant="dot"
              />
              <span className="text-[13px] font-mono text-black truncate">
                {item.label}
              </span>
            </div>
            <span
              className={cx(
                'text-[10px] tracking-[0.24em] uppercase font-bold font-mono shrink-0 text-right',
                statusTextClasses[item.status] || 'text-gray-600'
              )}
            >
              {item.statusLabel}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default VerificationStatus;
