import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-3 py-2 text-[12px] font-mono tracking-wider shadow-lg">
        <p className="opacity-70 mb-1">{payload[0].payload.name}</p>
        <p className="font-bold">CHF {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const PriceHistoryChart = ({ history = [], initialPrice = 0 }) => {
  const chartData = useMemo(() => {
    if (!history || history.length === 0) {
      return [
        { name: 'Jan 23', value: Math.round(initialPrice * 0.85) },
        { name: 'Jul 23', value: Math.round(initialPrice * 0.90) },
        { name: 'Jan 24', value: Math.round(initialPrice * 0.95) },
        { name: 'Jul 24', value: initialPrice },
      ];
    }
    return history.map((entry) => ({
      name: new Date(entry.recordedAt || entry.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      value: entry.price,
    }));
  }, [history, initialPrice]);

  const minVal = useMemo(() => {
    if (chartData.length === 0) return 0;
    return Math.min(...chartData.map((d) => d.value));
  }, [chartData]);

  const maxVal = useMemo(() => {
    if (chartData.length === 0) return 100;
    return Math.max(...chartData.map((d) => d.value));
  }, [chartData]);

  return (
    <div className="w-full flex flex-col pt-8">
      <div className="w-full h-30">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <YAxis hide domain={[minVal - 1000, maxVal + 1000]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#dcd9ce', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1a1a1a"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: '#1a1a1a', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-2 border-t border-[#dcd9ce] pt-2">
        <span>{chartData[0]?.name || ''}</span>
        <span>{chartData[Math.floor(chartData.length / 2)]?.name || ''}</span>
        <span>{chartData[chartData.length - 1]?.name || ''}</span>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
