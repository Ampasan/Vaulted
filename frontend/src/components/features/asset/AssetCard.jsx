import { Heart } from 'lucide-react';
import Button from '../../ui/Button';
import StatusDot from '../../ui/StatusDot';

const aspectClasses = {
  portrait: 'aspect-9/10',
  marketplace: 'aspect-4/5',
  landscape: 'aspect-video',
  auction: 'aspect-4/3',
  square: 'aspect-square',
};

const cx = (...classes) => classes.filter(Boolean).join(' ');

const AssetCard = ({ asset }) => {
  const {
    image,
    title,
    category,
    lot,
    lotNumber,
    subtitle,
    ref,
    price,
    prevPrice,
    currentBid,
    timeLeft,
    bids,
    status,
    featured,
    actionLabel,
    actionPlacement = 'block',
    actionSize = 'sm',
    aspect = 'portrait',
    framed = false,
    layout = 'vertical',
    priceLabel,
    showWishlist = false,
    gain,
    location,
  } = asset;

  const eyebrow = category || lot || lotNumber;
  const detail = subtitle || ref;
  const displayPrice = currentBid || price;
  const displayPriceLabel = priceLabel || (currentBid ? 'Current Bid' : '');
  const imageAspect = aspectClasses[aspect] || aspectClasses.portrait;
  const isSimplePrice = displayPrice && !displayPriceLabel && !prevPrice && !timeLeft && !actionLabel;

  if (layout === 'horizontal') {
    return (
      <div className="flex items-center gap-4 bg-cream-light border border-[#dcd9ce] p-4 cursor-pointer hover:bg-white transition-colors group h-full">
        <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-cream-light">
          {status && <StatusDot status={status} size="xs" className="absolute top-1.5 left-1.5" />}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-1">
              {eyebrow}
            </p>
          )}
          <h4 className="text-[13px] font-black truncate text-black mb-1">{title}</h4>
          {detail && <p className="text-[12px] text-gray-500 truncate font-medium">{detail}</p>}
        </div>
        {showWishlist && (
          <div className="shrink-0 text-gray-400 group-hover:text-black transition-colors px-2">
            <Heart className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  }

  let priceContent;
  if (gain) {
    priceContent = (
      <div className="flex flex-col border-t border-[#dcd9ce] pt-3 mt-4 w-full">
        <div className="flex justify-between items-end mb-1">
           <div>
             {displayPriceLabel && <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-0.5">{displayPriceLabel}</p>}
             {displayPrice && <p className="text-[15px] font-mono font-bold text-black">{displayPrice}</p>}
           </div>
           <div className="text-right">
             <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold mb-0.5">GAIN</p>
             <p className="text-[15px] font-mono font-bold text-green-600">{gain}</p>
           </div>
        </div>
        {location && (
          <div className="flex items-center gap-1.5 text-gray-400 mt-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <p className="text-[11px] font-mono tracking-widest">{location}</p>
          </div>
        )}
      </div>
    );
  } else {
    priceContent = (
      <>
        {displayPriceLabel && (
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">
            {displayPriceLabel}
          </p>
        )}
        {prevPrice && <p className="text-[13px] text-gray-500 font-medium mb-1 line-through">{prevPrice}</p>}
        {displayPrice && (
          <p
            className={cx(
              isSimplePrice
                ? 'text-[13px] font-medium text-gray-500'
                : 'font-black text-black',
              currentBid ? 'text-[20px]' : !isSimplePrice && 'text-[17px]'
            )}
          >
            {displayPrice}
          </p>
        )}
        {bids && <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{bids}</p>}
        {timeLeft && <p className="text-[12px] text-gray-500 font-medium mt-1">{timeLeft}</p>}
      </>
    );
  }

  return (
    <div className={cx('group cursor-pointer flex flex-col h-full', framed && 'bg-cream-light border border-[#dcd9ce]')}>
      <div className={cx('relative overflow-hidden bg-cream-light', imageAspect, !framed && 'mb-5')}>
        {(status || featured) && (
          <StatusDot
            status={status || 'featured'}
            size={featured || gain ? 'xs' : 'sm'}
            className={gain ? 'absolute top-4 right-4' : 'absolute top-4 left-4'}
          />
        )}
        {showWishlist && (
          <div className="absolute top-4 right-4 bg-cream/90 p-1.5 rounded-full z-10 hover:bg-white transition-colors cursor-pointer">
            <Heart className="w-3.5 h-3.5 text-gray-600" />
          </div>
        )}
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className={cx('flex-1 flex flex-col', framed ? 'p-6' : 'space-y-1.5')}>
        {eyebrow && (
          <p className={cx('text-gray-500 tracking-[0.2em] uppercase font-bold', framed ? 'text-[11px] mb-1.5' : 'text-[10px]')}>
            {eyebrow}
          </p>
        )}
        <h3 className={cx('font-black leading-snug line-clamp-1', framed ? 'text-[16px] mb-1' : 'text-sm')}>
          {title}
        </h3>
        {detail && (
          <p className={cx('font-medium text-gray-500', framed ? 'text-[12px] mb-6' : 'text-[12px]')}>
            {detail}
          </p>
        )}

        {actionLabel && actionPlacement === 'inline' ? (
          <div className="flex justify-between items-end gap-4 mt-auto">
            <div>{priceContent}</div>
            <Button size={actionSize}>{actionLabel}</Button>
          </div>
        ) : (
          <>
            {displayPrice || gain ? (
              <div className={cx(actionLabel ? 'mt-auto mb-5' : 'mt-auto pt-1')}>
                {priceContent}
              </div>
            ) : null}
            {actionLabel && (
              <Button size={actionSize} fullWidth className="mt-auto">
                {actionLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
