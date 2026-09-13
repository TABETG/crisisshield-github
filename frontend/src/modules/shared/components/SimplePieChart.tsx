interface PieDataPoint {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieDataPoint[];
  title: string;
}

export const SimplePieChart = ({ data, title }: SimplePieChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  let currentAngle = -90;
  const slices = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const slice = {
      ...item,
      percentage,
      startAngle: currentAngle,
      angle
    };
    currentAngle += angle;
    return slice;
  });

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-6 hover:shadow-soft-xl transition-all animate-fade-in">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="flex items-center gap-8">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 200 200" className="transform -rotate-90 drop-shadow-lg">
            {slices.map((slice, index) => {
              const startAngle = (slice.startAngle * Math.PI) / 180;
              const endAngle = ((slice.startAngle + slice.angle) * Math.PI) / 180;

              const x1 = 100 + 90 * Math.cos(startAngle);
              const y1 = 100 + 90 * Math.sin(startAngle);
              const x2 = 100 + 90 * Math.cos(endAngle);
              const y2 = 100 + 90 * Math.sin(endAngle);

              const largeArc = slice.angle > 180 ? 1 : 0;
              const path = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <g key={index}>
                  <path
                    d={path}
                    fill={slice.color}
                    className="hover:opacity-80 transition-all cursor-pointer"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-lg">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-lg group-hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
