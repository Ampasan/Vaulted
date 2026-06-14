import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import TransactionFilter from '../components/features/transactions/TransactionFilter';
import TransactionRow from '../components/features/transactions/TransactionRow';

const transactionData = [
  {
    id: 1,
    date: '02.12.2023',
    assetName: 'Basquiat "Untitled" 1982',
    assetId: 'VLT-TXN-0891',
    image: 'https://picsum.photos/100/100?random=1',
    type: 'AUCTION WIN',
    hash: '0x9A...8F21',
    settlement: 'CHF 3,200,000',
    status: 'ESCROW HOLD'
  },
  {
    id: 2,
    date: '18.11.2023',
    assetName: '1962 Ferrari 250 GTO (Shares)',
    assetId: 'VLT-TXN-0890',
    image: 'https://picsum.photos/100/100?random=2',
    type: 'AUCTION WIN',
    hash: '0x3E...1C4D',
    settlement: 'CHF 850,000',
    status: 'IN TRANSIT'
  },
  {
    id: 3,
    date: '24.10.2023',
    assetName: 'Patek Philippe Nautilus 5711/1A',
    assetId: 'VLT-TXN-0882',
    image: 'https://picsum.photos/100/100?random=3',
    type: 'PRIVATE SALE',
    hash: '0x7F...9A2B',
    settlement: 'CHF 125,000',
    status: 'SETTLED'
  },
  {
    id: 4,
    date: '15.09.2023',
    assetName: 'Rolex Daytona Ref. 6265',
    assetId: 'VLT-TXN-0874',
    image: 'https://picsum.photos/100/100?random=4',
    type: 'PRIVATE SALE',
    hash: '0xB2...4E77',
    settlement: 'CHF 320,000',
    status: 'SETTLED'
  },
  {
    id: 5,
    date: '02.08.2023',
    assetName: 'Lamborghini Miura P400 SV 1972',
    assetId: 'VLT-TXN-0868',
    image: 'https://picsum.photos/100/100?random=5',
    type: 'AUCTION WIN',
    hash: '0xC1...3D90',
    settlement: 'CHF 2,450,000',
    status: 'SETTLED'
  },
  {
    id: 6,
    date: '14.06.2023',
    assetName: 'Hermès Birkin 35 Himalaya',
    assetId: 'VLT-TXN-0851',
    image: 'https://picsum.photos/100/100?random=6',
    type: 'PRIVATE SALE',
    hash: '0xD5...7A12',
    settlement: 'CHF 280,000',
    status: 'SETTLED'
  },
  {
    id: 7,
    date: '28.04.2023',
    assetName: 'Leica M6 TTL Black Paint',
    assetId: 'VLT-TXN-0843',
    image: 'https://picsum.photos/100/100?random=7',
    type: 'PRIVATE SALE',
    hash: '0xF8...2B44',
    settlement: 'CHF 18,500',
    status: 'SETTLED'
  },
  {
    id: 8,
    date: '11.03.2023',
    assetName: 'Titanium Monolith (Fraction)',
    assetId: 'VLT-TXN-0839',
    image: 'https://picsum.photos/100/100?random=8',
    type: 'CONSIGNMENT',
    hash: '0xA3...6C19',
    settlement: 'CHF 420,000',
    status: 'CANCELLED'
  }
];

const TransactionHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const filteredData = transactionData.filter(tx => {
    const matchStatus = filterStatus === 'ALL' || tx.status === filterStatus;
    const matchType = filterType === 'ALL' || tx.type === filterType;
    return matchStatus && matchType;
  });

  return (
    <div className="flex flex-col min-h-screen bg-cream text-ink">
      <Navbar />
      
      <main className="flex-1 w-full px-6 md:px-12 lg:px-16 xl:px-24 pt-12 pb-32">
        {/* Header section */}
        <div className="mb-12">
          <a href="#" className="inline-flex items-center text-[9px] tracking-[0.2em] font-bold text-gray-500 hover:text-black uppercase mb-8 transition-colors">
            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            PORTFOLIO
          </a>
          
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-4 font-bold">
            VAULTED <span className="mx-2">&gt;</span> ACQUISITION LEDGER
          </p>
          <h1 className="text-5xl md:text-[64px] font-black tracking-tighter mb-3">Transaction History</h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
            8 total transactions <span className="mx-2 text-gray-300">•</span> Settled value: CHF 3.19M
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-16">
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">TOTAL SETTLED</p>
            <p className="text-2xl font-mono text-black">CHF 3.44M</p>
          </div>
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">TRANSACTIONS</p>
            <p className="text-2xl font-mono text-black">8</p>
          </div>
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">IN ESCROW / TRANSIT</p>
            <p className="text-2xl font-mono text-black">2</p>
          </div>
          <div className="border border-[#dcd9ce] p-6 bg-transparent">
            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">ACTIVE VAULTS</p>
            <p className="text-2xl font-mono text-black">3</p>
          </div>
        </div>

        {/* Filters */}
        <TransactionFilter 
          activeStatus={filterStatus}
          onStatusChange={setFilterStatus}
          activeType={filterType}
          onTypeChange={setFilterType}
        />

        {/* Table Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#dcd9ce] text-[9px] tracking-[0.2em] font-bold text-gray-400 uppercase px-2 mb-2">
          <div className="w-[12%]">DATE</div>
          <div className="w-[30%]">ASSET</div>
          <div className="w-[18%]">TYPE</div>
          <div className="w-[15%]">TX HASH</div>
          <div className="w-[15%] text-right">SETTLEMENT</div>
          <div className="w-[10%] text-right pr-6">STATUS</div>
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
