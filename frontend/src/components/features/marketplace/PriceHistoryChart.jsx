import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const data = [
  { name: 'Jan 20', value: 380000 },
  { name: 'Apr 20', value: 395000 },
  { name: 'Jul 20', value: 390000 },
  { name: 'Oct 20', value: 410000 },
  { name: 'Jan 21', value: 415000 },
  { name: 'Apr 21', value: 430000 },
  { name: 'Jul 21', value: 425000 },
  { name: 'Oct 21', value: 440000 },
  { name: 'Jan 22', value: 435000 },
  { name: 'Apr 22', value: 445000 },
  { name: 'Jul 22', value: 440000 },
  { name: 'Oct 22', value: 450000 },
  { name: 'Jan 23', value: 448000 },
  { name: 'Apr 23', value: 455000 },
];

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

const PriceHistoryChart = () => {
  return (
    <div className="w-full flex flex-col pt-8">
      <div className="w-full h-30">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
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
        <span>20</span>
        <span>Oct 20</span>
        <span>Jul 21</span>
        <span>Apr 22</span>
        <span>Jan 23</span>
      </div>
    </div>
  );
};

export default PriceHistoryChart;
