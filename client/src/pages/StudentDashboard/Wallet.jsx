import {
  ArrowDownRight, ArrowUpRight, DownloadIcon,
  TrendingUp, TrendingDown, Wallet2, DollarSign,
  Clock, CheckCircle
} from 'lucide-react'
import React from 'react'

// ── Static data (unchanged) ───────────────────────────────────────────────────
const transactions = [
  { type: 'credit', description: 'Payment received - E-commerce Website', amount: 1200, date: '2 days ago', status: 'Completed' },
  { type: 'debit', description: 'Withdrawal to Bank Account', amount: 500, date: '5 days ago', status: 'Completed' },
  { type: 'credit', description: 'Payment received - Logo Design', amount: 300, date: '1 week ago', status: 'Completed' },
  { type: 'credit', description: 'Payment received - Mobile App UI', amount: 500, date: '2 weeks ago', status: 'Completed' },
  { type: 'debit', description: 'Withdrawal to Bank Account', amount: 800, date: '3 weeks ago', status: 'Completed' },
]

const stats = [
  { label: 'Total Earned', value: '$3,240', change: '+12%', positive: true, icon: TrendingUp },
  { label: 'This Month', value: '$1,240', change: '+25%', positive: true, icon: TrendingUp },
  { label: 'Pending', value: '$0', change: '0%', positive: false, icon: Clock },
]

// ── Mini bar chart data ───────────────────────────────────────────────────────
const chartBars = [40, 65, 50, 80, 55, 90, 70]
const chartLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// ── Component ─────────────────────────────────────────────────────────────────
const Wallet = () => {
  return (
    <div className="min-h-screen">

      {/* ── Page header ── */}
      <div className="mb-6">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Finance</p>
        <h1 className="text-3xl font-bold text-white mb-1">My Wallet</h1>
        <p className="text-slate-500 text-sm">Manage your earnings and transactions</p>
      </div>

      {/* ── Top grid: balance card + stats ── */}
      <div className="grid grid-cols-3 gap-5 mb-6">

        {/* Balance card — spans 2 cols */}
        <div className="col-span-2 relative rounded-2xl overflow-hidden bg-linear-to-br from-blue-600 to-blue-800 p-6">
          {/* Texture */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between mb-6">
            <div>
              <p className="text-blue-200 text-sm mb-2">Available Balance</p>
              <h2 className="text-5xl font-bold text-white tracking-tight">$1,240<span className="text-2xl text-blue-300">.00</span></h2>
            </div>
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
              <Wallet2 className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Mini bar chart */}
          <div className="relative z-10 flex items-end gap-1.5 h-12 mb-3">
            {chartBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full rounded-t-sm bg-white/30 hover:bg-white/50 transition-colors"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>
          <div className="relative z-10 flex justify-between mb-6">
            {chartLabels.map((l, i) => (
              <span key={i} className="flex-1 text-center text-xs text-blue-300">{l}</span>
            ))}
          </div>

          <button className="relative z-10 flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all cursor-pointer">
            <DownloadIcon className="w-4 h-4" />
            Withdraw Funds
          </button>
        </div>

        {/* Stats column */}
        <div className="col-span-1 flex flex-col gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{stat.label}</p>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.positive ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
                    <Icon className={`w-3.5 h-3.5 ${stat.positive ? 'text-green-400' : 'text-yellow-400'}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <span className={`text-xs font-medium flex items-center gap-1 ${stat.positive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {stat.positive ? <TrendingUp className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {stat.change} {stat.positive ? 'vs last month' : 'in escrow'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-semibold text-white">Transaction History</h3>
            <p className="text-xs text-slate-500 mt-0.5">{transactions.length} transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              <ArrowDownRight className="w-3 h-3" /> Credits: ${transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> Debits: ${transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {transactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3.5 hover:border-slate-600 hover:bg-slate-800/80 transition-all group"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border
                  ${tx.type === 'credit'
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                  {tx.type === 'credit'
                    ? <ArrowDownRight className="w-4 h-4" />
                    : <ArrowUpRight className="w-4 h-4" />
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{tx.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tx.date}</p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4 shrink-0">
                <p className={`text-base font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                </p>
                <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Wallet