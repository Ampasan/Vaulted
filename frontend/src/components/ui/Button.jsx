const variantClasses = {
  primary: 'bg-black text-white hover:bg-gray-800',
  secondary: 'bg-cream-light text-black border border-[#dcd9ce] hover:bg-white',
  outline: 'border border-black text-black hover:bg-black hover:text-white',
  ghost: 'text-black hover:text-gray-600',
  link: 'text-black border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600',
};

const sizeClasses = {
  xs: 'px-4 py-2 text-[8px]',
  sm: 'px-6 py-2.5 text-[11px]',
  md: 'px-8 py-4 text-[10px]',
  lg: 'px-10 py-4 text-[11px]',
  link: 'px-0 py-0 text-[10px]',
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-[0.2em] transition-colors whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
