import { useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatM = (val) => {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
  return val.toLocaleString();
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-2 text-[10px] font-mono tracking-wider shadow-lg">
        <p className="opacity-70 mb-1">{payload[0].payload.name}</p>
        <p className="font-bold">CHF {formatM(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const buildChartData = (items) => {
  if (!items || items.length === 0) return [];

  const snapshots = [];
  items.forEach((item) => {
    const history = item.priceHistory || [];
    history.forEach((entry) => {
      snapshots.push({ date: new Date(entry.recordedAt), itemId: item._id || item.id, price: entry.price });
    });
    snapshots.push({ date: new Date(), itemId: item._id || item.id, price: item.currentPrice });
  });

  if (snapshots.length === 0) return [];

  snapshots.sort((a, b) => a.date - b.date);

  const oldest = snapshots[0].date;
  const now = new Date();

  const months = [];
  const cursor = new Date(oldest.getFullYear(), oldest.getMonth(), 1);
  while (cursor <= now) {
    months.push(new Date(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }

  const latestPrices = {};
  let snapshotIdx = 0;
  const monthlyTotals = months.map((monthStart) => {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0, 23, 59, 59);

    while (snapshotIdx < snapshots.length && snapshots[snapshotIdx].date <= monthEnd) {
      const s = snapshots[snapshotIdx];
      latestPrices[s.itemId] = s.price;
      snapshotIdx++;
    }

    const total = Object.values(latestPrices).reduce((sum, p) => sum + p, 0);
    const label = `${MONTH_LABELS[monthStart.getMonth()]} ${String(monthStart.getFullYear()).slice(2)}`;
    return { name: label, value: total, rawDate: monthStart };
  });

  if (monthlyTotals.length === 1) {
    monthlyTotals.unshift({ ...monthlyTotals[0], name: '' });
  }

  return monthlyTotals;
};

const PortfolioChart = ({ items = [] }) => {
  const chartData = useMemo(() => buildChartData(items), [items]);

  const ytdGain = useMemo(() => {
    if (chartData.length < 2) return null;
    const currentYear = new Date().getFullYear();
    const firstOfYear = chartData.find(
      (d) => d.rawDate && d.rawDate.getFullYear() === currentYear
    );
    const last = chartData[chartData.length - 1];
    if (!firstOfYear || !last) return null;
    const gain = last.value - firstOfYear.value;
    return gain;
  }, [chartData]);

  const hasData = chartData.length > 0;

  const tickLabels = useMemo(() => {
    if (chartData.length <= 7) return chartData.map((d) => d.name);
    const step = Math.floor(chartData.length / 6);
    return chartData.filter((_, i) => i % step === 0 || i === chartData.length - 1).map((d) => d.name);
  }, [chartData]);

  const yearLabel = new Date().getFullYear();

  return (
    <div className="border border-[#dcd9ce] p-6 bg-transparent h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">
            PORTFOLIO PERFORMANCE
          </p>
          {ytdGain !== null ? (
            <div className={`flex items-center gap-1 ${ytdGain >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {ytdGain >= 0
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                }
              </svg>
              <p className="text-[13px] font-mono font-bold">
                {ytdGain >= 0 ? '+' : '-'}CHF {formatM(Math.abs(ytdGain))} YTD
              </p>
            </div>
          ) : (
            <p className="text-[13px] font-mono font-bold text-gray-400">No history yet</p>
          )}
        </div>
        <div className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold border border-[#dcd9ce] px-2 py-1">
          {yearLabel}
        </div>
      </div>

      <div className="flex-1 w-full min-h-50">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#dcd9ce', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#1a1a1a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorValue)"
                activeDot={{ r: 4, fill: '#1a1a1a', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <p className="text-[11px] text-gray-400 font-mono uppercase tracking-widest">
              No portfolio data yet
            </p>
          </div>
        )}
      </div>

      {hasData && (
        <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-4 pt-4 border-t border-[#dcd9ce]">
          {tickLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioChart;
