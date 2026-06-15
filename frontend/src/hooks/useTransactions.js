import { useState, useEffect } from 'react';
import transactionService from '../services/transactionService';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${d.getFullYear()}`;
};

const typeLabel = (type) => {
  if (type === 'marketplace_purchase') return 'PRIVATE SALE';
  if (type === 'auction_win') return 'AUCTION WIN';
  return type?.toUpperCase() ?? '—';
};

const statusLabel = (status) => {
  if (status === 'completed') return 'SETTLED';
  if (status === 'failed') return 'CANCELLED';
  if (status === 'pending') return 'ESCROW HOLD';
  return status?.toUpperCase() ?? '—';
};

const formatAmount = (num) =>
  Number(num).toLocaleString('en-US');

export const normalizeTransaction = (txn) => {
  const item = txn.itemId ?? {};
  const shortId = txn._id?.toString().slice(-6).toUpperCase() ?? '??????';
  const id = `VLT-TXN-${shortId}`;
  const date = formatDate(txn.createdAt);
  const image = item.images?.[0] || item.imageUrl || 'https://picsum.photos/100/100?random=' + shortId;
  const amount = formatAmount(txn.amount);
  const type = typeLabel(txn.type);
  const status = statusLabel(txn.status);
  
  return {
    id: txn._id,
    date,
    assetName: item.name || 'Unknown Asset',
    asset: item.name || 'Unknown Asset',
    assetId: id,
    transactionId: id,
    image,
    type,
    hash: txn.txHash || `0x${shortId}...${shortId}`,
    settlement: `CHF ${amount}`,
    currency: 'CHF',
    amount: amount,
    status,
    rawStatus: txn.status,
  };
};

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await transactionService.getTransactions();
        const txList = Array.isArray(data) ? data : (data.data || []);
        setTransactions(txList.map(normalizeTransaction));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
};

export default useTransactions;
