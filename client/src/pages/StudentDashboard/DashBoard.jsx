import {
  ArrowRight, Briefcase, CheckCircle, Clock,
  DollarSign, FileText, Shield, Star,
  TrendingUp, Upload, Wallet, Zap
} from 'lucide-react'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

// ── Static data ─────────────────────────────────────────────────────────────
const stats = [
  { icon: FileText, label: 'Applications Sent', value: '12', sub: '+2 this week', color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
  { icon: Briefcase, label: 'Active Projects', value: '3', sub: '1 due this week', color: 'bg-green-500/10 text-green-400', border: 'border-green-500/20' },
  { icon: Shield, label: 'Pending NDAs', value: '2', sub: 'Action needed', color: 'bg-yellow-500/10 text-yellow-400', border: 'border-yellow-500/20' },
  { icon: Wallet, label: 'Wallet Balance', value: '$1,240', sub: '+$300 this month', color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/20' },
]

const recentApps = [
  { title: 'Mobile App UI Design', budget: '$500', time: '2 days ago', status: 'NDA Sent', statusColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  { title: 'E-commerce Website Development', budget: '$1,200', time: '5 days ago', status: 'In Progress', statusColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { title: 'Logo Design for Startup', budget: '$300', time: '1 week ago', status: 'Applied', statusColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  { title: 'ML Price Prediction Model', budget: '$950', time: '2 weeks ago', status: 'Completed', statusColor: 'bg-green-500/10 text-green-400 border-green-500/20' },
]

const activeProjects = [
  { title: 'E-commerce Website Development', client: 'TechStartup Inc.', deadline: '5 days left', progress: 65, budget: '$1,200' },
  { title: 'Dashboard Analytics Tool', client: 'DataViz Solutions', deadline: '12 days left', progress: 30, budget: '$1,500' },
  { title: 'Mobile App UI Design', client: 'FitLife Apps', deadline: '3 days left', progress: 85, budget: '$600' },
]

const suggestedProjects = [
  { tag: 'Web Development', tagColor: 'bg-blue-500/10 text-blue-400', title: 'React Dashboard for SaaS', budget: '$800', skills: ['React', 'Tailwind', 'Node.js'] },
  { tag: 'UI/UX Design', tagColor: 'bg-purple-500/10 text-purple-400', title: 'Mobile Banking App Design', budget: '$750', skills: ['Figma', 'UX Research'] },
  { tag: 'Machine Learning', tagColor: 'bg-green-500/10 text-green-400', title: 'NLP Sentiment Analysis', budget: '$1,100', skills: ['Python', 'Transformers'] },
]

const quickActions = [
  { icon: Briefcase, label: 'Browse Projects', to: 'browse-projects', color: 'bg-blue-500/10 text-blue-400' },
  { icon: Shield, label: 'NDA Requests', to: 'nda-requests', color: 'bg-yellow-500/10 text-yellow-400', badge: 2 },
  { icon: Wallet, label: 'My Wallet', to: 'wallet', color: 'bg-purple-500/10 text-purple-400' },
  { icon: Upload, label: 'Submissions', to: 'submissions', color: 'bg-green-500/10 text-green-400' },
]



const SectionHeader = ({ title, action, onAction }) => (
  <div className='flex items-center justify-between mb-4'>
    <h2 className='text-base font-semibold text-white'>{title}</h2>
    {action && (
      <button onClick={onAction} className='flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors'>
        {action} <ArrowRight className='w-3 h-3' />
      </button>
    )}
  </div>
)

// ── Component ─────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useContext(AppContext);

  return (
    <div className='space-y-6'>

      {/* ── Welcome banner ── */}
      <div className='relative rounded-2xl overflow-hidden bg-linear-to-r from-blue-600 to-blue-800 p-6'>
        {/* grid texture */}
        <div className='absolute inset-0 opacity-10'
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* glow */}
        <div className='absolute -top-10 -right-10 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl pointer-events-none' />

        <div className='relative z-10 flex items-center justify-between'>
          <div>
            <p className='text-blue-200 text-sm mb-1'>Good morning 👋</p>
            <h1 className='text-2xl font-bold text-white mb-1'>Welcome back, {user?.name || 'Alex'}!</h1>
            <p className='text-blue-200 text-sm'>Here's what's happening with your projects today.</p>
          </div>
          
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-4'>
        {stats.map(({ icon: Icon, label, value, sub, color, border }) => (
          <div key={label} className={`bg-slate-900 border ${border} rounded-2xl p-5 hover:border-opacity-60 transition-all`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className='w-4 h-4' />
            </div>
            <p className='text-2xl font-bold text-white mb-0.5'>{value}</p>
            <p className='text-xs text-slate-400 mb-1'>{label}</p>
            <p className='text-xs text-slate-500'>{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main two-column grid ── */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>

        {/* LEFT — 2/3 width */}
        <div className='xl:col-span-2 space-y-6'>

          {/* Active Projects */}
          <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
            <SectionHeader title='Active Projects' action='View All' onAction={() => navigate('applied-projects')} />
            <div className='space-y-4'>
              {activeProjects.map(proj => (
                <div key={proj.title} className='bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all cursor-pointer'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <p className='text-sm font-medium text-white mb-0.5'>{proj.title}</p>
                      <p className='text-xs text-slate-500'>{proj.client}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-bold text-blue-400'>{proj.budget}</p>
                      <div className='flex items-center gap-1 justify-end mt-1'>
                        <Clock className='w-3 h-3 text-slate-500' />
                        <p className='text-xs text-slate-500'>{proj.deadline}</p>
                      </div>
                    </div>
                  </div>
                 
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
            <SectionHeader title='Recent Applications' action='View All' onAction={() => navigate('applied-projects')} />
            <div className='space-y-2'>
              {recentApps.map(app => (
                <div key={app.title} className='flex items-center justify-between py-3 border-b border-slate-800 last:border-0'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0'>
                      <Briefcase className='w-3.5 h-3.5 text-slate-400' />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-white'>{app.title}</p>
                      <div className='flex items-center gap-2 mt-0.5'>
                        <span className='text-xs text-blue-400 font-medium'>{app.budget}</span>
                        <span className='text-slate-600'>·</span>
                        <span className='text-xs text-slate-500'>{app.time}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full border ${app.statusColor}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — 1/3 width */}
        <div className='space-y-5'>

          {/* Quick Actions */}
          <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
            <h2 className='text-base font-semibold text-white mb-4'>Quick Actions</h2>
            <div className='space-y-2'>
              {quickActions.map(({ icon: Icon, label, to, color, badge }) => (
                <button
                  key={label}
                  onClick={() => navigate(to)}
                  className='w-full flex items-center gap-3 px-4 py-3 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/30 rounded-xl transition-all text-left'
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className='w-3.5 h-3.5' />
                  </div>
                  <span className='text-sm text-slate-300 flex-1'>{label}</span>
                  {badge && (
                    <span className='text-xs bg-blue-600 text-white font-semibold px-1.5 py-0.5 rounded-full'>{badge}</span>
                  )}
                  <ArrowRight className='w-3.5 h-3.5 text-slate-600' />
                </button>
              ))}
            </div>
          </div>

          {/* Profile completion */}
          <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-base font-semibold text-white'>Profile Strength</h2>
              <span className='text-sm font-bold text-blue-400'>78%</span>
            </div>
            <div className='mt-4 space-y-2'>
              {[
                { label: 'Add profile photo', done: false },
                { label: 'Upload your CV', done: true },
                { label: 'Add portfolio links', done: true },
                { label: 'Complete bio', done: false },
              ].map(item => (
                <div key={item.label} className='flex items-center gap-2.5'>
                  <CheckCircle className={`w-4 h-4 shrink-0 ${item.done ? 'text-green-400' : 'text-slate-600'}`} />
                  <span className={`text-xs ${item.done ? 'text-slate-400 line-through' : 'text-slate-300'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings mini chart */}
          <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
            <div className='flex items-center justify-between mb-1'>
              <h2 className='text-base font-semibold text-white'>Earnings</h2>
              <TrendingUp className='w-4 h-4 text-green-400' />
            </div>
            <p className='text-2xl font-bold text-white mb-0.5'>$1,240</p>
            <p className='text-xs text-green-400 mb-4'>↑ 24% vs last month</p>
            {/* Mini bar chart */}
            <div className='flex items-end gap-1.5 h-14'>
              {[30, 55, 40, 70, 50, 85, 65].map((h, i) => (
                <div key={i} className='flex-1 rounded-t-sm bg-blue-500/20 hover:bg-blue-500/40 transition-colors relative'>
                  <div className='absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-sm transition-all' style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className='flex justify-between mt-1'>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className='flex-1 text-center text-xs text-slate-600'>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Suggested Projects ── */}
      <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
        <div className='flex items-center justify-between mb-5'>
          <div>
            <h2 className='text-base font-semibold text-white'>Recommended for You</h2>
            <p className='text-xs text-slate-500 mt-0.5'>Based on your skills and past applications</p>
          </div>
          <button onClick={() => navigate('browse-projects')} className='flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors'>
            Browse all <ArrowRight className='w-3 h-3' />
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {suggestedProjects.map(proj => (
            <div key={proj.title} className='bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/30 hover:bg-slate-800 transition-all cursor-pointer group'>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${proj.tagColor} mb-3 inline-block`}>{proj.tag}</span>
              <h3 className='text-sm font-medium text-white mb-2 group-hover:text-blue-400 transition-colors leading-snug'>{proj.title}</h3>
              <div className='flex flex-wrap gap-1.5 mb-3'>
                {proj.skills.map(s => (
                  <span key={s} className='text-xs px-2 py-0.5 bg-slate-700/60 text-slate-400 rounded-md'>{s}</span>
                ))}
              </div>
              <div className='flex items-center justify-between pt-3 border-t border-slate-700/50'>
                <span className='text-sm font-bold text-blue-400'>{proj.budget}</span>
                <button className='text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors'>
                  Apply <ArrowRight className='w-3 h-3' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard