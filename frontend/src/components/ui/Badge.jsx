const variantClasses = {
  default: 'bg-[#ebe8df] text-gray-600 border border-[#dcd9ce]',
  dark: 'bg-black text-white',
  outline: 'bg-transparent text-gray-500 border border-[#dcd9ce]',
};

const sizeClasses = {
  xs: 'text-[8px] px-2 py-0.5 tracking-[0.2em]',
  sm: 'text-[9px] px-2.5 py-1 tracking-[0.15em]',
  md: 'text-[10px] px-3 py-1 tracking-[0.15em]',
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  return (
    <span
      className={cx(
        'inline-flex items-center font-bold uppercase whitespace-nowrap',
        variantClasses[variant] || variantClasses.default,
        sizeClasses[size] || sizeClasses.sm,
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
