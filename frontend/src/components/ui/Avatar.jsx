import { Camera } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const sizeClasses = {
  sm: {
    wrapper: 'w-10 h-10 text-[11px]',
    icon: 14,
  },
  md: {
    wrapper: 'w-16 h-16 text-[15px]',
    icon: 16,
  },
  lg: {
    wrapper: 'w-24 h-24 text-[22px]',
    icon: 18,
  },
  xl: {
    wrapper: 'w-32 h-32 md:w-36 md:h-36 text-[28px] md:text-[32px]',
    icon: 20,
  },
};

const Avatar = ({
  src,
  alt = '',
  initials,
  size = 'md',
  editable = false,
  onEdit,
  className = '',
}) => {
  const sizing = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={cx('relative shrink-0', className)}>
      <div
        className={cx(
          'bg-white text-black font-black uppercase flex items-center justify-center overflow-hidden',
          sizing.wrapper
        )}
      >
        {src ? (
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {editable && (
        <button
          type="button"
          onClick={onEdit}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-black text-white flex items-center justify-center border-2 border-black hover:bg-[#1a1a1a] transition-colors"
          aria-label="Change profile photo"
        >
          <Camera size={sizing.icon} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};

export default Avatar;
