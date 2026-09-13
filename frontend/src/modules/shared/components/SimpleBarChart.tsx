interface DataPoint {
  month: string;
  year: number;
  count: number;
}

interface SimpleBarChartProps {
  data: DataPoint[];
  title: string;
  color?: string;
}

export const SimpleBarChart = ({ data, title }: SimpleBarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.count), 1);
  const lastMonths = data.slice(-6);

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-primary-100 p-6 hover:shadow-soft-xl transition-all">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="flex items-end justify-between h-64 gap-3">
        {lastMonths.map((point, index) => {
          const height = maxValue > 0 ? (point.count / maxValue) * 100 : 0;
          const hasValue = point.count > 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-full flex flex-col justify-end h-full relative group">
                {hasValue && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 shadow-lg">
                    {point.count} {point.count === 1 ? 'crise' : 'crises'}
                  </div>
                )}
                <div
                  className="w-full bg-gradient-to-t from-primary-600 via-primary-500 to-accent-500 rounded-t-xl transition-all hover:from-primary-700 hover:via-primary-600 hover:to-accent-600 cursor-pointer shadow-lg hover:shadow-xl"
                  style={{
                    height: hasValue ? `${Math.max(height, 5)}%` : '2px',
                    minHeight: hasValue ? '20px' : '2px'
                  }}
                >
                  {hasValue && (
                    <div className="w-full h-full flex items-start justify-center pt-2">
                      <span className="text-xs font-bold text-white drop-shadow">{point.count}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-600 font-semibold">{point.month}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
        <span className="text-gray-600 font-medium">Total : <span className="font-bold text-gray-900">{data.reduce((sum, d) => sum + d.count, 0)}</span> crises</span>
        <span className="text-gray-600 font-medium">Pic : <span className="font-bold text-primary-600">{maxValue}</span> en {data.find(d => d.count === maxValue)?.month}</span>
      </div>
    </div>
  );
};
