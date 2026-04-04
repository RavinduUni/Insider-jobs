import React, { useState } from 'react'
import {
  Briefcase, CheckCircle, Clock, DollarSign,
  Edit, Eye, Trash2, Users, ArrowRight, Tag,
  ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ── Inline StatusBadge ────────────────────────────────────────────────────────
const statusConfig = {
  'open': { label: 'Open', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  'applied': { label: 'Has Applicants', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'nda-sent': { label: 'NDA Sent', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'nda-accepted': { label: 'NDA Accepted', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  'in-progress': { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  'submitted': { label: 'Submitted', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  'completed': { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
}
const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
  return <span className={`text-xs font-medium px-3 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
}

// ── Dot colour per status ─────────────────────────────────────────────────────
const dotColor = {
  'open': 'bg-slate-400',
  'applied': 'bg-blue-400',
  'nda-sent': 'bg-yellow-400',
  'nda-accepted': 'bg-indigo-400',
  'in-progress': 'bg-cyan-400',
  'submitted': 'bg-purple-400',
  'completed': 'bg-green-400',
}

// ── Category colour ───────────────────────────────────────────────────────────
const catColor = {
  'Web Development': 'bg-blue-500/10 text-blue-400',
  'UI/UX Design': 'bg-purple-500/10 text-purple-400',
  'Content Writing': 'bg-orange-500/10 text-orange-400',
  'Data Analysis': 'bg-yellow-500/10 text-yellow-400',
  'Marketing': 'bg-pink-500/10 text-pink-400',
}

// ── Static data  ───────────────────────────────────────────────────
const projects = [
  { id: 1, title: 'React Dashboard Development', category: 'Web Development', budget: 800, applicants: 8, status: 'in-progress', deadline: '2024-12-31', createdDate: '2024-11-01', assignedTo: 'Alex Johnson', submittedDate: null },
  { id: 2, title: 'Mobile App UI Design', category: 'UI/UX Design', budget: 500, applicants: 12, status: 'nda-sent', deadline: '2024-12-20', createdDate: '2024-11-05', assignedTo: null, submittedDate: null },
  { id: 3, title: 'Content Writing - Tech Blog', category: 'Content Writing', budget: 200, applicants: 5, status: 'applied', deadline: '2024-12-15', createdDate: '2024-11-10', assignedTo: null, submittedDate: null },
  { id: 4, title: 'Python Data Analysis Script', category: 'Data Analysis', budget: 400, applicants: 3, status: 'open', deadline: '2024-12-25', createdDate: '2024-11-12', assignedTo: null, submittedDate: null },
  { id: 5, title: 'E-commerce Website Landing Page', category: 'Web Development', budget: 600, applicants: 0, status: 'open', deadline: '2025-01-10', createdDate: '2024-11-15', assignedTo: null, submittedDate: null },
  { id: 6, title: 'Social Media Marketing Campaign', category: 'Marketing', budget: 350, applicants: 7, status: 'completed', deadline: '2024-11-20', createdDate: '2024-10-15', assignedTo: 'Sarah Chen', submittedDate: null },
  { id: 7, title: 'Node.js API Development', category: 'Web Development', budget: 950, applicants: 4, status: 'submitted', deadline: '2024-12-28', createdDate: '2024-10-20', assignedTo: 'Mike Wilson', submittedDate: '2024-12-27' },
  { id: 8, title: 'Database Optimization Project', category: 'Data Analysis', budget: 700, applicants: 2, status: 'submitted', deadline: '2024-12-30', createdDate: '2024-10-25', assignedTo: 'Emily Davis', submittedDate: '2024-12-26' },
]

const statusFilters = [
  { value: 'all', label: 'All Projects' },
  { value: 'open', label: 'Open' },
  { value: 'applied', label: 'Has Applicants' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'completed', label: 'Completed' },
]

// ── Main Component ────────────────────────────────────────────────────────────
const Projects = () => {
  const navigate = useNavigate()
  const [projectFilter, setProjectFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects = projectFilter === 'all'
    ? projects
    : projects.filter(p => p.status === projectFilter)

  const fmt = d => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })

  const projectsPerPage = 5;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const currentProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  const goPrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen">

      {/* ── Page header ── */}
      <div className="mb-6">
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">Owner</p>
        <h1 className="text-3xl font-bold text-white mb-1">Manage Projects</h1>
        <p className="text-slate-500 text-sm">View, edit, and manage all your posted projects.</p>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map(f => {
          const count = f.value === 'all' ? projects.length : projects.filter(p => p.status === f.value).length
          const active = projectFilter === f.value
          return (
            <button
              key={f.value}
              onClick={() => setProjectFilter(f.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border cursor-pointer ${active
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-900 text-slate-400 border-slate-700/50 hover:text-white hover:border-slate-600'
                }`}
            >
              {f.value !== 'all' && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor[f.value] || 'bg-slate-400'}`} />
              )}
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Project list ── */}
      <div className="flex flex-col gap-4">
        {currentProjects.map(project => (
          <div
            key={project.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${catColor[project.category] || 'bg-slate-700 text-slate-400'}`}>
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {project.title}
                  </h2>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block ${catColor[project.category] || 'bg-slate-700 text-slate-400'}`}>
                    {project.category}
                  </span>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mb-3 ml-12">
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <DollarSign className="w-3 h-3" />
                <span className="font-semibold">${project.budget.toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Users className="w-3 h-3" />
                {project.applicants} applicants
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3 h-3" />
                Due: {fmt(project.deadline)}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                Posted: {fmt(project.createdDate)}
              </span>
            </div>

            {/* Assigned / submitted info */}
            {project.assignedTo && (
              <p className="text-xs text-slate-500 mb-3 ml-12">
                Assigned to: <span className="text-blue-400 font-medium">{project.assignedTo}</span>
                {project.submittedDate && (
                  <span className="ml-2 text-purple-400">· Submitted {fmt(project.submittedDate)}</span>
                )}
              </p>
            )}

            {/* Divider + actions */}
            <div className="border-t border-slate-800 pt-4 flex items-center gap-2 ml-12">
              <button className="flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700/50 px-3 py-2 rounded-xl hover:text-white hover:border-slate-600 transition-all cursor-pointer">
                <Eye className="w-3.5 h-3.5" /> View
              </button>

              {project.status !== 'submitted' ? (
                <>
                  <button className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/20 px-3 py-2 rounded-xl hover:bg-blue-500/10 transition-all cursor-pointer">
                    <Users className="w-3.5 h-3.5" /> Applicants ({project.applicants})
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700/50 px-3 py-2 rounded-xl hover:text-white hover:border-slate-600 transition-all cursor-pointer">
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate(`/owner-dashboard/review-submission/${project.assignedTo}`)}
                  className="flex items-center gap-1.5 text-xs text-white bg-purple-600/80 hover:bg-purple-600 border border-purple-500/30 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Review Work
                </button>
              )}

              <button className="flex items-center gap-1.5 text-xs text-red-400 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer ml-auto">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-slate-600" />
            </div>
            <h3 className="text-white font-semibold mb-2">No projects found</h3>
            <p className="text-slate-500 text-sm mb-5">There are no projects with this status.</p>
            <button
              onClick={() => setProjectFilter('all')}
              className="flex items-center gap-2 text-sm text-blue-400 border border-blue-500/30 px-5 py-2.5 rounded-xl hover:bg-blue-500/10 transition-colors"
            >
              View all projects <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className='mt-6'>
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
  )
}

export default Projects