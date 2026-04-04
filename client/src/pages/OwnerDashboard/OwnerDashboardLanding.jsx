import {
  Briefcase, CheckCircle, Clock, DollarSign,
  Edit, Eye, Shield, Star, Trash2, TrendingUp,
  Users, FileText, ArrowRight, Plus,
  ArrowLeft
} from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

// ── Inline StatusBadge ──────────────────────────────────────────
const statusConfig = {
  'applied': { label: 'Under Review', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  'nda-sent': { label: 'NDA Sent', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'nda-accepted': { label: 'NDA Accepted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'in-progress': { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  'completed': { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
};
const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  return <span className={`text-xs font-medium px-3 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>;
};

// ── Static data ───────────────────────────────────────────────────
const stats = [
  { label: 'Total Projects', value: '8', icon: Briefcase, color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
  { label: 'Pending Applications', value: '15', icon: Users, color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/20' },
  { label: 'NDA Pending', value: '3', icon: Shield, color: 'bg-yellow-500/10 text-yellow-400', border: 'border-yellow-500/20' },
  { label: 'Completed', value: '5', icon: CheckCircle, color: 'bg-green-500/10 text-green-400', border: 'border-green-500/20' },
];

const recentProjects = [
  { id: 1, title: 'React Dashboard Development', budget: 800, applicants: 8, status: 'in-progress', createdAt: '2024-07-01', deadline: '2 weeks left', assignedTo: 'Alex Johnson', hasSubmission: true },
  { id: 2, title: 'Mobile App UI Design', budget: 500, applicants: 12, status: 'nda-sent', createdAt: '2024-06-01', deadline: '10 days left', assignedTo: null, hasSubmission: false },
  { id: 3, title: 'Content Writing - Tech Blog', budget: 200, applicants: 5, status: 'applied', createdAt: '2024-05-01', deadline: '1 week left', assignedTo: null, hasSubmission: false },
];

const recentApplicants = [
  { id: 1, name: 'Alex Johnson', profileImg: null, project: 'React Dashboard Development', projectId: 1, university: 'MIT', rating: 4.9, appliedDate: '2025-11-28', hasCV: true },
  { id: 2, name: 'Sarah Chen', profileImg: null, project: 'Mobile App UI Design', projectId: 2, university: 'Stanford', rating: 4.8, appliedDate: '2025-12-01', hasCV: true },
  { id: 3, name: 'Mike Wilson', profileImg: null, project: 'Content Writing', projectId: 3, university: 'UCLA', rating: 4.7, appliedDate: '2025-12-05', hasCV: true },
];

// ── timeAgo ─────────────────────────────────────────────────
const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(diffMs / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

// ── Section header helper ─────────────────────────────────────────────────────
const SectionHeader = ({ title, action, onAction }) => (
  <div className='flex items-center justify-between mb-5'>
    <h2 className='text-base font-semibold text-white'>{title}</h2>
    {action && (
      <button onClick={onAction} className='flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors'>
        {action} <ArrowRight className='w-3 h-3' />
      </button>
    )}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
const OwnerDashboardLanding = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 3;

  const totalPages = Math.ceil(recentProjects.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = recentProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }

  return (
    <div className='min-h-screen space-y-6'>

      {/* ── Welcome banner ── */}
      <div className='relative rounded-2xl overflow-hidden bg-linear-to-r from-blue-600 to-blue-800 p-6'>
        <div className='absolute inset-0 opacity-10'
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className='absolute -top-10 -right-10 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl pointer-events-none' />
        <div className='relative z-10 flex items-center justify-between'>
          <div>
            <p className='text-blue-200 text-sm mb-1'>Project Owner Dashboard</p>
            <h1 className='text-2xl font-bold text-white mb-1'>Welcome back, TechStart Inc!</h1>
            <p className='text-blue-200 text-sm'>Here's an overview of your projects and applicants.</p>
          </div>
          <button
            onClick={() => navigate('create-project')}
            className='relative z-10 flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer'
          >
            <Plus className='w-4 h-4' />
            Post New Project
          </button>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className='grid grid-cols-4 gap-4'>
        {stats.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`bg-slate-900 border ${border} rounded-2xl p-5 hover:border-opacity-60 transition-all cursor-pointer`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon className='w-4 h-4' />
            </div>
            <p className='text-2xl font-bold text-white mb-0.5'>{value}</p>
            <p className='text-xs text-slate-500'>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Main two-col grid ── */}
      <div className='grid grid-cols-3 gap-5'>

        {/* Active Projects — 2/3 */}
        <div className='col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5'>
          <SectionHeader title='Active Projects' action='View All' onAction={() => navigate('projects')} />
          <div className='flex flex-col gap-4'>
            {currentProjects
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
              .map(project => (
                <div key={project.id} className='bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/30 transition-all group'>
                  {/* Header */}
                  <div className='flex items-start justify-between mb-3'>
                    <h3 className='text-sm font-semibold text-white group-hover:text-blue-400 transition-colors'>{project.title}</h3>
                    <StatusBadge status={project.status} />
                  </div>

                  {/* Meta */}
                  <div className='flex items-center gap-4 mb-3'>
                    <span className='flex items-center gap-1.5 text-xs text-green-400'>
                      <DollarSign className='w-3 h-3' />${project.budget}
                    </span>
                    <span className='flex items-center gap-1.5 text-xs text-slate-400'>
                      <Users className='w-3 h-3' />{project.applicants} applicants
                    </span>
                    <span className='flex items-center gap-1.5 text-xs text-slate-400'>
                      <Clock className='w-3 h-3' />{project.deadline}
                    </span>
                  </div>

                  {project.assignedTo && (
                    <p className='text-xs text-slate-500 mb-3'>
                      Assigned to: <span className='text-blue-400 font-medium'>{project.assignedTo}</span>
                    </p>
                  )}

                  {/* Actions */}
                  <div className='flex items-center gap-2 pt-3 border-t border-slate-700/50'>
                    <button className='flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700 px-3 py-1.5 rounded-lg hover:text-white hover:border-slate-500 transition-all'>
                      <Users className='w-3 h-3' /> Applicants
                    </button>
                    <button className='flex items-center gap-1.5 text-xs text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-colors'>
                      <Eye className='w-3 h-3' /> Review Work
                    </button>
                    <button className='flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all'>
                      <Edit className='w-3 h-3' /> Edit
                    </button>
                    <button className='flex items-center gap-1.5 text-xs text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all ml-auto'>
                      <Trash2 className='w-3 h-3' /> Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
          <div className='grid grid-cols-4'>
            <div className='flex items-center justify-center mt-4 gap-1 col-span-3 col-start-2'>
              <button
                onClick={goPrev}
                disabled={currentPage === 1}
                className={`border text-primary w-8 h-8 rounded flex items-center justify-center cursor-pointer ${currentPage === 1 && 'opacity-40 cursor-not-allowed'}`}>
                <ArrowLeft className='w-4 h-4' />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`border text-primary w-8 h-8 rounded cursor-pointer ${currentPage === page && 'bg-primary border-primary text-white'}`}>
                  {page}
                </button>
              ))}
              <button
                onClick={goNext}
                disabled={currentPage === totalPages}
                className={`border text-primary w-8 h-8 rounded flex items-center justify-center cursor-pointer ${currentPage === totalPages && 'opacity-40 cursor-not-allowed'}`}>
                <ArrowRight className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Applicants — 1/3 */}
        <div className='col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5'>
          <SectionHeader title='Recent Applicants' action='View All' onAction={() => navigate('all-applicants')} />
          <div className='flex flex-col gap-3'>
            {recentApplicants
              .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
              .slice(0, 3)
              .map(applicant => (
                <div key={applicant.id} className='bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 hover:border-blue-500/30 transition-all cursor-pointer group'>
                  {/* Avatar + name */}
                  <div className='flex items-center gap-3 mb-2'>
                    {applicant.profileImg
                      ? <img src={applicant.profileImg} alt='' className='w-9 h-9 rounded-xl object-cover border border-slate-700' />
                      : <div className='w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0'>
                        {applicant.name.slice(0, 2).toUpperCase()}
                      </div>
                    }
                    <div className='min-w-0'>
                      <p className='text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate'>{applicant.name}</p>
                      <p className='text-xs text-slate-500'>{applicant.university}</p>
                    </div>
                  </div>

                  {/* Project */}
                  <p className='text-xs text-slate-400 mb-2 truncate'>{applicant.project}</p>

                  {/* Footer meta */}
                  <div className='flex items-center justify-between'>
                    <span className='text-xs text-slate-600'>{timeAgo(applicant.appliedDate)}</span>
                    <span className='flex items-center gap-1 text-xs text-yellow-400'>
                      <Star className='w-3 h-3 fill-current' />{applicant.rating}
                    </span>
                  </div>

                  {applicant.hasCV && (
                    <div className='flex items-center gap-1.5 text-xs text-blue-400 mt-2'>
                      <FileText className='w-3 h-3' /> CV Available
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Quick stats at bottom */}
          <div className='mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2'>
            <div className='bg-slate-800/50 rounded-xl p-3 text-center'>
              <p className='text-lg font-bold text-white'>15</p>
              <p className='text-xs text-slate-500'>Total Apps</p>
            </div>
            <div className='bg-slate-800/50 rounded-xl p-3 text-center'>
              <p className='text-lg font-bold text-green-400'>3</p>
              <p className='text-xs text-slate-500'>This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions bar ── */}
      <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5'>
        <h2 className='text-base font-semibold text-white mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-4 gap-3'>
          {[
            { icon: Plus, label: 'Post New Project', action: () => navigate('create-project'), color: 'bg-blue-600 text-white hover:bg-blue-500' },
            { icon: Users, label: 'View Applicants', action: () => navigate('all-applicants'), color: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' },
            { icon: Shield, label: 'NDA Management', action: () => navigate('owner-nda'), color: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' },
            { icon: TrendingUp, label: 'View Payments', action: () => navigate('payments'), color: 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' },
          ].map(({ icon: Icon, label, action, color }) => (
            <button key={label} onClick={action}
              className={`flex items-center gap-2 justify-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${color}`}>
              <Icon className='w-4 h-4' />
              {label}
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}

export default OwnerDashboardLanding