import { useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const fieldClass =
  'w-full bg-transparent border-0 border-b border-gray-400 py-2.5 text-sm font-mono text-black focus:outline-none focus:border-black transition-colors';

const Input = ({
  label,
  type = 'text',
  as = 'input',
  options = [],
  rows = 4,
  placeholder,
  value,
  onChange,
  showPasswordToggle = false,
  className = '',
  inputClassName = '',
  labelClassName = 'text-gray-600',
  placeholderClassName = 'placeholder:text-gray-500',
  selectIconClassName = 'text-gray-500',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={cx('w-full', className)}>
      {label && (
        <label
          className={cx(
            'block text-[11px] tracking-[0.15em] uppercase font-medium mb-2',
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {as === 'select' ? (
          <>
            <select
              value={value}
              onChange={onChange}
              className={cx(
                fieldClass,
                placeholderClassName,
                'appearance-none pr-8 cursor-pointer',
                inputClassName
              )}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              strokeWidth={2}
              className={cx(
                'absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none',
                selectIconClassName
              )}
            />
          </>
        ) : as === 'textarea' ? (
          <textarea
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={cx(
              fieldClass,
              placeholderClassName,
              'resize-none min-h-[120px] py-3',
              inputClassName
            )}
          />
        ) : (
          <input
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={cx(
              fieldClass,
              placeholderClassName,
              showPasswordToggle && 'pr-8',
              inputClassName
            )}
          />
        )}
        {showPasswordToggle && as === 'input' && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
