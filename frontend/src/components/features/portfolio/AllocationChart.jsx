import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const allocationData = [
  { name: "Horology", value: 44.5, color: "#1a1a1a" },
  { name: "Automotive", value: 32.8, color: "#666666" },
  { name: "Fine Art", value: 14.1, color: "#a3a3a3" },
  { name: "Collectibles", value: 8.6, color: "#e5e5e5" },
];

const gainLossData = [
  { month: "J", value: 2 },
  { month: "F", value: -1 },
  { month: "M", value: 3 },
  { month: "A", value: -2 },
  { month: "M", value: 1 },
  { month: "J", value: 4 },
  { month: "J", value: 1 },
  { month: "A", value: 2 },
  { month: "S", value: -1 },
  { month: "O", value: 5 },
  { month: "N", value: 3 },
  { month: "D", value: 2 },
];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white px-2 py-1 text-[9px] font-mono tracking-widest shadow-lg z-50 relative pointer-events-none">
        {payload[0].name}: {payload[0].value}%
      </div>
    );
  }
  return null;
};

const AllocationChart = () => {
  return (
    <div className="border border-[#dcd9ce] p-6 bg-transparent h-full flex flex-col justify-between overflow-visible">
      {/* Top Half: Allocation */}
      <div className="mb-8">
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
          ALLOCATION BY CATEGORY
        </p>
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
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-cream shadow-inner flex items-center justify-center pointer-events-none"></div>
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
                  ></span>
                  {item.name}
                </div>
                <div className="font-mono text-black">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Half: Gain/Loss Bar Chart */}
      <div>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-4">
          MONTH NET GAIN / LOSS
        </p>
        <div className="flex items-end justify-between h-12 px-2 border-b border-[#dcd9ce] pb-2">
          {gainLossData.map((data, idx) => {
            const isPositive = data.value >= 0;
            const heightPercentage = Math.abs(data.value) * 15; // arbitrary multiplier for visual height
            return (
              <div
                key={idx}
                className="flex flex-col items-center group relative w-full px-0.5"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] px-1.5 py-0.5 whitespace-nowrap z-10 pointer-events-none">
                  {isPositive ? "+" : ""}
                  {data.value}k
                </div>
                {/* Bar */}
                <div
                  className={`w-full transition-all duration-300 ${isPositive ? "bg-black" : "bg-red-500"}`}
                  style={{
                    height: `${heightPercentage}%`,
                    minHeight: "2px",
                    transformOrigin: "bottom",
                  }}
                ></div>
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
