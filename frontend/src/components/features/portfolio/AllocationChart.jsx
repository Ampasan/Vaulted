import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const PALETTE = [
  '#1a1a1a',
  '#555555',
  '#8a8a8a',
  '#b8b8b8',
  '#d9d9d9',
  '#3b6e8c',
  '#6e3b5a',
  '#5a6e3b',
];

const getCategoryId = (name = '', description = '') => {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes('patek') || text.includes('rolex') || text.includes('watch') || text.includes('nautilus') || text.includes('chronograph') || text.includes('daytona') || text.includes('horology')) {
    return 'Horology';
  }
  if (text.includes('ferrari') || text.includes('lamborghini') || text.includes('porsche') || text.includes('car') || text.includes('miura') || text.includes('automotive') || text.includes('gt')) {
    return 'Automotive';
  }
  if (text.includes('basquiat') || text.includes('art') || text.includes('painting') || text.includes('skull') || text.includes('lithograph')) {
    return 'Fine Art';
  }
  if (text.includes('hermes') || text.includes('hermès') || text.includes('birkin') || text.includes('collectible') || text.includes('jewel') || text.includes('watch')) {
    return 'Collectibles';
  }
  return 'Other';
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-2 py-1 text-[9px] font-mono tracking-widest shadow-lg z-50 relative pointer-events-none">
        {payload[0].name}: {payload[0].value.toFixed(1)}%
      </div>
    );
  }
  return null;
};

const buildGainLossData = (items) => {
  const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const now = new Date();
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);

    let portfolioValueStart = 0;
    let portfolioValueEnd = 0;

    items.forEach((item) => {
      const history = [...(item.priceHistory || [])].sort(
        (a, b) => new Date(a.recordedAt) - new Date(b.recordedAt)
      );

      const beforeStart = [...history].reverse().find(
        (e) => new Date(e.recordedAt) < monthStart
      );

      const atEnd = [...history].reverse().find(
        (e) => new Date(e.recordedAt) <= monthEnd
      );

      const startPrice = beforeStart?.price ?? (history[0]?.price ?? item.currentPrice ?? 0);
      const endPrice = atEnd?.price ?? item.currentPrice ?? 0;

      portfolioValueStart += startPrice;
      portfolioValueEnd += endPrice;
    });

    const change = portfolioValueStart > 0
      ? ((portfolioValueEnd - portfolioValueStart) / portfolioValueStart) * 100
      : 0;

    result.push({
      month: MONTHS[date.getMonth()],
      value: parseFloat(change.toFixed(1)),
    });
  }
  return result;
};

const AllocationChart = ({ items = [] }) => {
  const allocationData = useMemo(() => {
    const totals = {};
    let grandTotal = 0;

    items.forEach((item) => {
      const cat = item.category
        ? item.category.trim()
        : getCategoryId(item.name, item.description);
      const price = item.currentPrice || 0;
      totals[cat] = (totals[cat] || 0) + price;
      grandTotal += price;
    });

    if (grandTotal === 0) return [];

    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value], idx) => ({
        name,
        value: parseFloat(((value / grandTotal) * 100).toFixed(1)),
        color: PALETTE[idx % PALETTE.length],
      }));
  }, [items]);

  const gainLossData = useMemo(() => buildGainLossData(items), [items]);

  const hasItems = items.length > 0;

  return (
    <div className="border border-[#dcd9ce] p-6 bg-transparent h-full flex flex-col justify-between overflow-visible">
      {/* Top Half: Allocation */}
      <div className="mb-8">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
          ALLOCATION BY CATEGORY
        </p>
        {allocationData.length > 0 ? (
          <div className="flex items-center gap-6 relative z-0">
            <div className="w-24 h-24 shrink-0 relative overflow-visible">
              <div className="w-full h-full relative z-20">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} cursor={false} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Center dot */}
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cream shadow-inner flex items-center justify-center pointer-events-none" />
            </div>

            <div className="flex-1 space-y-2">
              {allocationData.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-[10px] tracking-widest font-bold"
                >
                  <div className="flex items-center gap-2 text-gray-500 uppercase">
                    <span
                      className="w-2 h-2 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </div>
                  <div className="font-mono text-black">{item.value}%</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 font-mono uppercase tracking-widest py-4">
            No assets yet
          </p>
        )}
      </div>

      {/* Bottom Half: Gain/Loss Bar Chart */}
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
          {hasItems ? 'MONTH NET GAIN / LOSS (%)' : 'MONTH NET GAIN / LOSS'}
        </p>
        <div className="flex items-end justify-between h-12 px-2 border-b border-[#dcd9ce] pb-2">
          {gainLossData.map((data, idx) => {
            const isPositive = data.value >= 0;
            const maxAbs = Math.max(...gainLossData.map((d) => Math.abs(d.value)), 1);
            const heightPercentage = (Math.abs(data.value) / maxAbs) * 100;
            return (
              <div
                key={idx}
                className="flex flex-col justify-end items-center group relative w-full h-full px-0.5"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] px-1.5 py-0.5 whitespace-nowrap z-10 pointer-events-none">
                  {isPositive ? '+' : ''}{data.value}%
                </div>
                {/* Bar */}
                <div
                  className={`w-full transition-all duration-300 ${isPositive ? 'bg-black' : 'bg-red-500'}`}
                  style={{
                    height: `${heightPercentage}%`,
                    minHeight: '2px',
                    transformOrigin: 'bottom',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between px-3 mt-2 text-[7px] text-gray-400 font-bold uppercase">
          {gainLossData.map((d, i) => (
            <span key={i}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationChart;
