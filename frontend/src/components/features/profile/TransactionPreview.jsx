import { Link } from 'react-router-dom';
import Avatar from '../../ui/Avatar';
import PriceTag from '../../ui/PriceTag';
import StatusDot from '../../ui/StatusDot';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const statusMap = {
  'escrow hold': 'escrow-hold',
  'in transit': 'in-transit',
  settled: 'settled',
};

const TransactionPreview = ({ transactions = [], className = '' }) => {
  return (
    <section className={cx('min-w-0', className)}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-[28px] font-black tracking-tight text-black mb-2">
            Transaction History
          </h2>
          <p className="text-[13px] font-mono text-gray-500 tracking-[0.04em]">
            Recent acquisition &amp; settlement activity
          </p>
        </div>
        <Link
          to="/transactions"
          className="text-[11px] tracking-[0.2em] font-bold uppercase text-gray-500 hover:text-black transition-colors shrink-0"
        >
          View All &rarr;
        </Link>
      </div>

      <div>
        <div className="hidden lg:grid grid-cols-[120px_minmax(0,1fr)_140px_160px_150px] gap-6 pb-3 border-b border-[#dcd9ce]">
          <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold font-mono">
            Date
          </p>
          <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold font-mono">
            Asset
          </p>
          <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold font-mono">
            Type
          </p>
          <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold font-mono text-right">
            Amount
          </p>
          <p className="text-[12px] text-gray-400 tracking-[0.2em] uppercase font-bold font-mono text-right">
            Status
          </p>
        </div>

        {transactions.map((txn) => (
          <div
            key={txn.id}
            className="grid grid-cols-1 lg:grid-cols-[120px_minmax(0,1fr)_140px_160px_150px] gap-4 lg:gap-6 py-6 border-b border-[#dcd9ce] items-center"
          >
            <p className="text-[13px] font-mono text-black lg:pt-0">{txn.date}</p>

            <div className="flex items-center gap-4 min-w-0">
              {txn.image ? (
                <div className="w-12 h-12 shrink-0 overflow-hidden bg-cream-light">
                  <img
                    src={txn.image}
                    alt={txn.asset}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <Avatar initials={txn.initials} size="sm" />
              )}
              <div className="min-w-0">
                <p className="text-[14px] font-black text-black truncate mb-0.5">
                  {txn.asset}
                </p>
                <p className="text-[13px] font-mono text-gray-500 tracking-[0.04em]">
                  {txn.transactionId}
                </p>
              </div>
            </div>

            <p className="text-[12px] font-mono text-black uppercase">
              {txn.type}
            </p>

            <PriceTag
              label=""
              currency={txn.currency || 'CHF'}
              amount={txn.amount}
              size="xs"
              align="right"
              className="lg:items-end"
            />

            <div className="flex lg:justify-end">
              <StatusDot
                status={statusMap[txn.status?.toLowerCase()] || txn.status}
                size="xs"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TransactionPreview;
