const cx = (...classes) => classes.filter(Boolean).join(' ');

const statusTones = {
  auction: {
    badge: 'border-[#e1c89d] text-[#b76b00]',
    dot: 'bg-[#d98200]',
  },
  secured: {
    badge: 'border-[#bdd6c5] text-[#087a3f]',
    dot: 'bg-[#087a3f]',
  },
  sale: {
    badge: 'border-[#bad2e8] text-[#0f67ad]',
    dot: 'bg-[#0f67ad]',
  },
  sold: {
    badge: 'border-[#d7d1c7] text-[#6b665f]',
    dot: 'bg-[#6b665f]',
  },
  default: {
    badge: 'border-[#d7d1c7] text-gray-600',
    dot: 'bg-gray-500',
  },
};

const statusLabels = {
  'in-storage': 'VAULT SECURED',
  'yield-check-in': 'VAULT SECURED',
  'under-contract': 'LISTED FOR SALE',
  sold: 'SOLD',
};

const formatStatus = (status) => String(status || '').replace(/[-_]/g, ' ').toUpperCase();

const HeldAssetRow = ({ asset }) => {
  const normalizedStatus = String(asset.status || '').toLowerCase();
  const statusLabel = asset.listStatus || statusLabels[normalizedStatus] || formatStatus(asset.status);
  const statusTone = statusTones[asset.listStatusTone] || statusTones.default;
  const acquisitionCost = asset.acquisitionCost || asset.price;
  const gain = asset.listGain || asset.gain;

  return (
    <div className="grid grid-cols-[minmax(360px,2.4fr)_1fr_1fr_1fr_1fr] min-h-23 items-center border-b border-[#dcd9ce] bg-transparent py-5.5 transition-colors hover:bg-cream-light/50">
      <div className="flex min-w-0 items-center gap-4 pr-8">
        <div className="h-11.25 w-15 shrink-0 overflow-hidden bg-cream-light">
          <img
            src={asset.image}
            alt={asset.title}
            className="h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
          />
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[12px] font-mono uppercase tracking-[0.18em] text-gray-400">
            {asset.category || asset.lot}
          </p>
          <h4 className="truncate text-[15px] font-black leading-tight text-black">
            {asset.title}
          </h4>
        </div>
      </div>

      <p className="text-center font-mono text-[16px] tracking-[0.08em] text-gray-500">
        {acquisitionCost}
      </p>
      <p className="text-center font-mono text-[16px] font-bold tracking-[0.08em] text-black">
        {asset.price}
      </p>
      <p className="text-center font-mono text-[16px] font-bold tracking-[0.08em] text-green-700">
        {gain}
      </p>
      <div className="flex justify-end">
        <span
          className={cx(
            'inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.24em]',
            statusTone.badge
          )}
        >
          <span className={cx('h-1 w-1 rounded-full', statusTone.dot)} />
          {statusLabel}
        </span>
      </div>
    </div>
  );
};

export default HeldAssetRow;
