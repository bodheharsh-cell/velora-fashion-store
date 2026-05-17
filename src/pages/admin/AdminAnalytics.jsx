import { BarChart3, TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag } from 'lucide-react';

function AdminAnalytics() {
  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', trend: '+20.1%', positive: true, icon: <DollarSign size={20} /> },
    { title: 'Active Customers', value: '2,338', trend: '+15.2%', positive: true, icon: <Users size={20} /> },
    { title: 'Total Orders', value: '1,203', trend: '+12.5%', positive: true, icon: <ShoppingBag size={20} /> },
    { title: 'Conversion Rate', value: '3.24%', trend: '-1.1%', positive: false, icon: <BarChart3 size={20} /> },
  ];

  const topProducts = [
    { id: 1, name: 'Linen Blend Blazer', category: 'Outerwear', sales: 124, revenue: '$24,676' },
    { id: 2, name: 'Silk Midi Slip Dress', category: 'Dresses', sales: 98, revenue: '$18,620' },
    { id: 3, name: 'Oversized Cashmere Sweater', category: 'Knitwear', sales: 85, revenue: '$25,075' },
    { id: 4, name: 'High-Waisted Wide Leg Trousers', category: 'Pants', sales: 72, revenue: '$10,080' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-lg sm:text-2xl font-light tracking-tight uppercase">Analytics</h1>
        <select className="border border-gray-300 text-sm py-2 px-4 outline-none focus:border-black rounded-sm bg-white w-full sm:w-auto">
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
          <option>This Year</option>
          <option>All Time</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500">{stat.title}</h3>
              <div className="text-gray-400">{stat.icon}</div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-light tracking-tight">{stat.value}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{stat.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mock Chart Area */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm shadow-sm p-4 sm:p-6">
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Revenue Over Time</h2>
          <div className="overflow-x-auto">
            <div className="h-64 flex items-end justify-between gap-2 px-2 border-b border-l border-gray-100 pb-2 min-w-[300px]">
              {/* Simple CSS mock bars */}
              {[40, 65, 45, 80, 55, 90, 75, 100, 60, 85, 70, 95].map((height, i) => (
                <div key={i} className="w-full bg-gray-100 hover:bg-black transition-colors rounded-t-sm relative group cursor-pointer" style={{ height: `${height}%` }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Day {i+1}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>May 1</span>
            <span>May 15</span>
            <span>May 30</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Top Products</h2>
          <div className="space-y-6">
            {topProducts.map((product, idx) => (
              <div key={product.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.revenue}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
