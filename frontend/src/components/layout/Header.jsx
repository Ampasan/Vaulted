import { Link } from 'react-router-dom';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const Header = ({ breadcrumb, title, description, action, variant = 'light' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={cx('flex flex-col md:flex-row md:items-end md:justify-between gap-6', isDark ? 'text-white' : 'mb-8')}>
      <div>
        <p
          className={cx(
            'text-[11px] uppercase tracking-[0.2em] mb-4 font-bold',
            isDark ? 'text-[#888888]' : 'text-gray-400'
          )}
        >
          {breadcrumb}
        </p>
        <h1 className="text-5xl md:text-[62px] font-black tracking-tighter mb-4">{title}</h1>
        {description && (
          <p
            className={cx(
              'text-[13px] font-medium max-w-xl',
              isDark ? 'text-[#888888]' : 'text-[#6b6b6b]'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        action.to ? (
          <Link
            to={action.to}
            className={cx(
              'text-[11px] tracking-[0.2em] font-bold uppercase transition-colors shrink-0 mb-1',
              isDark ? 'text-[#888888] hover:text-white' : 'text-gray-500 hover:text-black'
            )}
          >
            {action.label}
          </Link>
        ) : (
          <a
            href={action.href || '#'}
            className={cx(
              'text-[11px] tracking-[0.2em] font-bold uppercase transition-colors shrink-0 mb-1',
              isDark ? 'text-[#888888] hover:text-white' : 'text-gray-500 hover:text-black'
            )}
          >
            {action.label}
          </a>
        )
      )}
    </div>
  );
};

export default Header;
