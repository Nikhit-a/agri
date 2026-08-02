import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const COLORS = ['#2f5a1f', '#3d7027', '#4d8b31', '#6ba852', '#8bc373', '#a9d99a'];

export default function ResultsChart({ recommendations }) {
  const top6 = recommendations.slice(0, 6);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Crop Suitability Scores</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={top6} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis type="category" dataKey="crop" width={110} />
          <Tooltip formatter={(value) => [`${value}%`, 'Suitability']} />
          <Bar dataKey="suitability" radius={[0, 6, 6, 0]}>
            {top6.map((entry, index) => (
              <Cell key={entry.crop} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
