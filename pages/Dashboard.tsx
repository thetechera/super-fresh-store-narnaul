import React, { useMemo } from 'react';
import { useData } from '../hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PackageIcon, TrendingUpIcon, ShoppingCartIcon, DollarSignIcon } from '../components/Icons';
import { CardSkeleton, ChartSkeleton } from '../components/SkeletonLoader';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const COLORS = ['#14b8a6', '#0ea5e9', '#6366f1', '#f97316', '#8884d8', '#ec4899', '#f59e0b'];

const DashboardSkeleton: React.FC = () => (
    <div className="space-y-8">
        <div>
            <div className="h-9 w-1/4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <ChartSkeleton className="lg:col-span-2"/>
            <ChartSkeleton className="lg:col-span-3"/>
        </div>
    </div>
)

const Dashboard: React.FC = () => {
  const { data, isInitialLoad } = useData();

  const stats = useMemo(() => {
    const totalProducts = data.products.length;
    const totalSalesAmount = data.sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
    const totalPurchaseAmount = data.purchases.reduce((acc, p) => acc + p.totalPurchasePrice, 0);
    const profit = totalSalesAmount - totalPurchaseAmount;

    return { totalProducts, totalSalesAmount, totalPurchaseAmount, profit };
  }, [data]);

  const inventoryByCategory = useMemo(() => {
    const categoryMap = data.inventory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.stocks;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
  }, [data.inventory]);

  const stockData = useMemo(() => {
    if (!data.inventory) return [];
    return data.inventory
      .slice()
      .sort((a, b) => a.stocks - b.stocks)
      .map((item) => ({
        name: item.name,
        stocks: item.stocks,
      }));
  }, [data.inventory]);


  if (isInitialLoad) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard title="Products" value={stats.totalProducts} icon={PackageIcon} color="bg-teal-500" />
        <DashboardCard title="Purchase Amount" value={`₹${stats.totalPurchaseAmount.toFixed(2)}`} icon={ShoppingCartIcon} color="bg-sky-500" />
        <DashboardCard title="Sales Amount" value={`₹${stats.totalSalesAmount.toFixed(2)}`} icon={TrendingUpIcon} color="bg-indigo-500" />
        <DashboardCard title="Profit/Loss" value={`₹${stats.profit.toFixed(2)}`} icon={DollarSignIcon} color={stats.profit >= 0 ? "bg-cyan-500" : "bg-red-500"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={inventoryByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {inventoryByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} units`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Stock Distribution</h3>
           <div className="w-full flex-grow" style={{ height: '280px', overflowY: 'auto' }}>
                <ResponsiveContainer width="100%" height={Math.max(280, stockData.length * 35)}>
                    <BarChart
                        layout="vertical"
                        data={stockData}
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={130} 
                            tick={{ fontSize: 11, fill: '#374151' }} 
                            stroke="#6b7280"
                            interval={0}
                        />
                        <Tooltip 
                            wrapperStyle={{ zIndex: 10, backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}
                            formatter={(value: number) => [`${value} units`, 'Stock']}
                        />
                        <Bar dataKey="stocks" barSize={20}>
                            {stockData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;