const stats = [
  { value: '2,400+', label: 'SMEs using SmartFlow', sub: 'across 40 countries' },
  { value: '$180M+', label: 'Invoices processed', sub: 'last 12 months' },
  { value: '94%', label: 'Late payment prediction', sub: 'accuracy rate' },
  { value: '3.2x', label: 'Faster collections', sub: 'vs manual follow-up' },
];

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-white text-sm mb-1">{stat.label}</div>
              <div className="text-slate-400 text-xs">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
