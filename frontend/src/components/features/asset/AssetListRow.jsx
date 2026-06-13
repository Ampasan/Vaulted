import { X } from 'lucide-react';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import StatusDot from '../../ui/StatusDot';
import PriceTag from '../../ui/PriceTag';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const AssetListRow = ({ asset, onView, onRemove, className = '' }) => {
  const {
    image,
    maker,
    title,
    category,
    status,
    badge,
    addedDate,
    saleType,
    currency = 'CHF',
    price,
  } = asset;

  return (
    <div
      className={cx(
        'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_160px_minmax(140px,180px)_126px_24px] items-center gap-6 lg:gap-8 py-8 border-b border-[#dcd9ce]',
        className
      )}
    >
      <div className="flex items-center gap-5 min-w-0">
        <div className="relative w-20 h-16 shrink-0 overflow-hidden bg-cream-light">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          {maker && (
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">
              {maker}
            </p>
          )}
          <h3 className="text-[15px] font-black text-black mb-1 truncate">{title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {status && <StatusDot status={status} size="sm" variant="inline" />}
            {(badge || category) && (
              <Badge size="sm">{badge || category}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block text-center">
        {addedDate && <p className="text-[15px] font-bold text-black mb-1">{addedDate}</p>}
        {saleType && <p className="text-[13px] text-gray-500 font-medium">{saleType}</p>}
      </div>

      <div className="hidden lg:block">
        <PriceTag label="Est. Price" currency={currency} amount={price} size="md" />
      </div>

      <div className="flex items-center gap-4 lg:justify-end">
        <div className="lg:hidden flex-1">
          <PriceTag label="Est. Price" currency={currency} amount={price} size="md" align="left" />
          {(addedDate || saleType) && (
            <div className="mt-2">
              {addedDate && <p className="text-[13px] font-bold text-black">{addedDate}</p>}
              {saleType && <p className="text-[13px] text-gray-500 font-medium">{saleType}</p>}
            </div>
          )}
        </div>
        <Button size="sm" className="lg:w-full" onClick={() => onView?.(asset)}>
          VIEW &rarr;
        </Button>
        <button
          type="button"
          onClick={() => onRemove?.(asset)}
          className="text-gray-400 hover:text-black transition-colors p-1"
          aria-label={`Remove ${title} from wishlist`}
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default AssetListRow;
