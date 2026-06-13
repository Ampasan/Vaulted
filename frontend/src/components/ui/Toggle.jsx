import { LayoutGrid, LayoutList } from 'lucide-react';

const viewOptions = [
  { id: 'list', icon: LayoutList, label: 'List view' },
  { id: 'grid', icon: LayoutGrid, label: 'Grid view' },
];

const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  mode = 'switch',
  value,
  onValueChange,
}) => {
  if (mode === 'icons') {
    return (
      <div className="inline-flex border border-[#dcd9ce] bg-cream-light">
        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isActive = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-label={option.label}
              aria-pressed={isActive}
              disabled={disabled}
              onClick={() => onValueChange?.(option.id)}
              className={`p-2.5 transition-colors ${
                isActive ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Icon size={14} strokeWidth={2.25} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div
          className={`w-10 h-5 rounded-full transition-colors ${
            checked ? 'bg-black' : 'bg-gray-300'
          } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        />
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      {label && (
        <span className="text-[11px] tracking-[0.15em] uppercase font-bold text-gray-600">
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;
