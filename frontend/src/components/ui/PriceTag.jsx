const cx = (...classes) => classes.filter(Boolean).join(' ');

const sizeClasses = {
  sm: {
    label: 'text-[10px] tracking-[0.2em] mb-0.5',
    currency: 'text-md tracking-tight',
    amount: 'text-md',
  },
  md: {
    label: 'text-[11px] tracking-[0.2em] mb-1',
    currency: 'text-lg tracking-tight',
    amount: 'text-lg',
  },
  lg: {
    label: 'text-[12px] tracking-[0.2em] mb-1',
    currency: 'text-xl tracking-tight',
    amount: 'text-xl',
  },
};

const PriceTag = ({
  label = 'Est. Price',
  currency = 'CHF',
  amount,
  size = 'md',
  align = 'right',
  className = '',
}) => {
  const sizing = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={cx('flex flex-col', align === 'right' && 'items-end text-right', className)}>
      {label && (
        <p className={cx('text-gray-400 uppercase font-bold', sizing.label)}>{label}</p>
      )}
      <div className="flex items-baseline gap-1.5">
        <span className={cx('text-black font-bold uppercase', sizing.currency)}>{currency}</span>
        <span className={cx('font-black text-black tracking-tight', sizing.amount)}>{amount}</span>
      </div>
    </div>
  );
};

export default PriceTag;
