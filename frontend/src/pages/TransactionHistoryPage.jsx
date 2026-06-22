import { useState, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TransactionFilter from '../components/features/transactions/TransactionFilter';
import TransactionRow from '../components/features/transactions/TransactionRow';
import useTransactions from '../hooks/useTransactions';
import useScrollToTop from '../hooks/useScrollToTop';

const TransactionHistoryPage = () => {
  useScrollToTop();

  const { transactions, loading } = useTransactions();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return transactions.filter(tx => {
      const matchStatus = filterStatus === 'ALL' || tx.status === filterStatus;
      const matchType = filterType === 'ALL' || tx.type === filterType;
      return matchStatus && matchType;
    });
  }, [transactions, filterStatus, filterType]);

  const { totalSettledStr, activeVaults, escrowTransit } = useMemo(() => {
    let settledSum = 0;
    let escrowTransitCount = 0;
    let activeCount = 0;

    transactions.forEach(t => {
      if (t.status === 'SETTLED') {
        const val = Number(String(t.amount).replace(/,/g, '')) || 0;
        settledSum += val;
      } else if (t.status === 'ESCROW HOLD' || t.status === 'IN TRANSIT') {
        escrowTransitCount++;
      }

      if (t.status !== 'CANCELLED') activeCount++;
    });

    const formattedSettled = settledSum >= 1000000
      ? (settledSum / 1000000).toFixed(2) + 'M'
      : settledSum >= 1000 ? (settledSum / 1000).toFixed(1) + 'K' : settledSum.toLocaleString();

    return {
      totalSettledStr: formattedSettled,
      activeVaults: activeCount,
      escrowTransit: escrowTransitCount
    };
  }, [transactions]);

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar />

      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-32">
        {/* Header section */}
        <div className="mb-12">
          <a href="#" className="inline-flex items-center text-[11px] tracking-[0.2em] font-bold text-gray-500 hover:text-black uppercase mb-8 transition-colors">
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            PORTFOLIO
          </a>

          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">
            VAULTED <span className="mx-2">&gt;</span> ACQUISITION LEDGER
          </p>
          <h1 className="text-5xl md:text-[64px] font-black tracking-tighter mb-3">Transaction History</h1>
          <p className="text-[11px] text-gray-500 font-mono tracking-widest uppercase">
            {transactions.length} total transactions <span className="mx-2 text-gray-300">•</span> Settled value: CHF {totalSettledStr}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-16">
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">TOTAL SETTLED</p>
            <p className="text-2xl font-mono text-black">CHF {totalSettledStr}</p>
          </div>
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">TRANSACTIONS</p>
            <p className="text-2xl font-mono text-black">{transactions.length}</p>
          </div>
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">IN ESCROW / TRANSIT</p>
            <p className="text-2xl font-mono text-black">{escrowTransit}</p>
          </div>
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">ACTIVE VAULTS</p>
            <p className="text-2xl font-mono text-black">{activeVaults}</p>
          </div>
        </div>

        {/* Filters */}
        <TransactionFilter
          activeStatus={filterStatus}
          onStatusChange={setFilterStatus}
          activeType={filterType}
          onTypeChange={setFilterType}
          isOpen={showFilters}
          onToggle={() => setShowFilters((current) => !current)}
        />

        {/* Table Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dcd9ce] text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase px-2 mb-2">
          <div className="w-[12%]">DATE</div>
          <div className="w-[30%]">ASSET</div>
          <div className="w-[18%]">TYPE</div>
          <div className="w-[15%]">TX HASH</div>
          <div className="w-[15%] text-right pr-8 lg:pr-10">SETTLEMENT</div>
          <div className="w-[10%] text-right pl-6 pr-6">STATUS</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {filteredData.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} />
          ))}
          {filteredData.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-[10px] tracking-[0.2em] font-bold uppercase border-b border-[#dcd9ce]">
              No transactions found matching the selected filters.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TransactionHistoryPage;
