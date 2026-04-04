import React, { useState } from 'react'
import { Clock, DollarSign, Eye, FileText, X, Calendar, Building2, Tag, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── StatusBadge (inline dark-theme version) ───────────────────────────────────
const statusConfig = {
  'applied': { label: 'Under Review', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  'nda-sent': { label: 'NDA Sent', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'nda-accepted': { label: 'NDA Accepted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'in-progress': { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  'completed': { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

// ── Dot indicator ─────────────────────────────────────────────────────────────
const dotColor = {
  'applied': 'bg-slate-400',
  'nda-sent': 'bg-yellow-400',
  'nda-accepted': 'bg-blue-400',
  'in-progress': 'bg-cyan-400',
  'completed': 'bg-green-400',
};

// ── Category colour ───────────────────────────────────────────────────────────
const catColor = {
  'Web Development': 'bg-blue-500/10 text-blue-400',
  'UI/UX Design': 'bg-purple-500/10 text-purple-400',
  'Graphic Design': 'bg-pink-500/10 text-pink-400',
  'Content Writing': 'bg-orange-500/10 text-orange-400',
  'Video Editing': 'bg-red-500/10 text-red-400',
};

// ── Data ──────────────────────────────────────────────────────────────────────
const appliedProjects = [
  { id: 1, title: 'Mobile App UI Design', company: 'TechStart Inc', budget: 500, status: 'nda-sent', appliedDate: '2024-11-15', deadline: '2024-12-20', category: 'UI/UX Design', description: 'Design a modern mobile app interface for a fitness tracking application.', skills: ['Figma', 'UI/UX', 'Mobile Design'] },
  { id: 2, title: 'E-commerce Website Development', company: 'ShopEasy LLC', budget: 1200, status: 'in-progress', appliedDate: '2024-11-10', deadline: '2024-12-30', category: 'Web Development', description: 'Build a fully functional e-commerce website with payment integration.', skills: ['React', 'Node.js', 'MongoDB', 'Stripe'] },
  { id: 3, title: 'Logo Design for Startup', company: 'InnovateCo', budget: 300, status: 'applied', appliedDate: '2024-11-08', deadline: '2024-12-15', category: 'Graphic Design', description: 'Create a modern and memorable logo for a tech startup.', skills: ['Illustrator', 'Photoshop', 'Branding'] },
  { id: 4, title: 'Content Writing - Tech Blog', company: 'TechInsights', budget: 200, status: 'applied', appliedDate: '2024-11-12', deadline: '2024-12-10', category: 'Content Writing', description: 'Write 5 blog posts about emerging technologies.', skills: ['Writing', 'SEO', 'Research'] },
  { id: 5, title: 'React Dashboard Development', company: 'DataViz Corp', budget: 800, status: 'nda-accepted', appliedDate: '2024-11-05', deadline: '2024-12-25', category: 'Web Development', description: 'Build an analytics dashboard with data visualization.', skills: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS'] },
  { id: 6, title: 'Video Editing - Product Demo', company: 'MediaPro', budget: 400, status: 'completed', appliedDate: '2024-10-20', deadline: '2024-11-15', category: 'Video Editing', description: 'Edit a 3-minute product demonstration video.', skills: ['Premiere Pro', 'After Effects'] },
];

const statusFilters = [
  { value: 'all', label: 'All Applications' },
  { value: 'applied', label: 'Under Review' },
  { value: 'nda-sent', label: 'NDA Sent' },
  { value: 'nda-accepted', label: 'NDA Accepted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

// ── Main component ─────────────────────────────────────────────────────────────
const AppliedProjects = () => {
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);

  const filteredProjects = filterStatus === 'all'
    ? appliedProjects
    : appliedProjects.filter(p => p.status === filterStatus);

  const openModal = (project) => {
    setSelectedProject(project);
    setShowModel(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => { setSelectedProject(null); setShowModel(false); }, 300);
  };

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className='min-h-screen'>

      {/* ── Page header ── */}
      <div className='mb-6'>
        <p className='text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1'>Applications</p>
        <h1 className='text-3xl font-bold text-white mb-1'>My Applications</h1>
        <p className='text-slate-500 text-sm'>Track all your project applications and their current status</p>
      </div>

      {/* ── Status filter tabs ── */}
      <div className='flex flex-wrap gap-2 mb-7'>
        {statusFilters.map(f => {
          const count = f.value === 'all'
            ? appliedProjects.length
            : appliedProjects.filter(p => p.status === f.value).length;
          const active = filterStatus === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${active
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-900 text-slate-400 border-slate-700/50 hover:text-white hover:border-slate-600'
                }`}
            >
              {f.value !== 'all' && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor[f.value]}`} />
              )}
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Applications list ── */}
      <div className='flex flex-col gap-4'>
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className='bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 group'
          >
            {/* Top row */}
            <div className='flex items-start justify-between gap-4 mb-3'>
              <div className='flex items-start gap-3'>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${catColor[project.category] || 'bg-slate-700 text-slate-400'}`}>
                  <FileText className='w-4 h-4' />
                </div>
                <div>
                  <h2 className='text-base font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug'>
                    {project.title}
                  </h2>
                  <div className='flex items-center gap-1.5 mt-1'>
                    <Building2 className='w-3 h-3 text-slate-500' />
                    <span className='text-xs text-slate-500'>{project.company}</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={project.status} />
            </div>

            {/* Meta row */}
            <div className='flex flex-wrap items-center gap-4 mb-4 ml-12'>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${catColor[project.category] || 'bg-slate-700 text-slate-400'}`}>
                {project.category}
              </span>
              <span className='flex items-center gap-1.5 text-xs text-slate-400'>
                <DollarSign className='w-3 h-3 text-green-400' />
                <span className='text-green-400 font-semibold'>${project.budget.toLocaleString()}</span>
              </span>
              <span className='flex items-center gap-1.5 text-xs text-slate-500'>
                <Clock className='w-3 h-3' />
                Due: {fmt(project.deadline)}
              </span>
              <span className='flex items-center gap-1.5 text-xs text-slate-500'>
                <Calendar className='w-3 h-3' />
                Applied: {fmt(project.appliedDate)}
              </span>
            </div>

            {/* Skills */}
            <div className='flex flex-wrap gap-1.5 mb-4 ml-12'>
              {project.skills.map((skill, i) => (
                <span key={i} className='text-xs px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg border border-slate-700/50'>
                  {skill}
                </span>
              ))}
            </div>

            {/* Divider + actions */}
            <div className='border-t border-slate-800 pt-4 flex items-center gap-3 ml-12'>
              <button
                onClick={() => openModal(project)}
                className='flex items-center gap-2 text-xs text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-all'
              >
                <Eye className='w-3.5 h-3.5' />
                View Details
              </button>
              <button
                onClick={() => navigate('/student-dashboard/nda-requests')}
                className='flex items-center gap-2 text-xs text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors'
              >
                <FileText className='w-3.5 h-3.5' />
                Review NDA
              </button>
            </div>
          </div>
        ))}

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <div className='w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4'>
              <FileText className='w-6 h-6 text-slate-600' />
            </div>
            <h3 className='text-white font-semibold mb-2'>No applications found</h3>
            <p className='text-slate-500 text-sm mb-5'>You have no applications with this status yet.</p>
            <button
              onClick={() => navigate('/student-dashboard/browse-projects')}
              className='flex items-center gap-2 text-sm text-blue-400 border border-blue-500/30 px-5 py-2.5 rounded-xl hover:bg-blue-500/10 transition-colors'
            >
              Browse Projects <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        )}
      </div>

      {/* ── Project Details Modal ── */}
      {selectedProject && showModel && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300'
            onClick={closeModal}
          />

          {/* Modal */}
          <div className={`relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 ${animateModal ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
            }`}>

            {/* Modal header */}
            <div className='flex items-center justify-between p-6 border-b border-slate-800'>
              <div>
                <p className='text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1'>Project Details</p>
                <h2 className='text-xl font-bold text-white'>Application Overview</h2>
              </div>
              <button
                onClick={closeModal}
                className='w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* Modal body */}
            <div className='p-6'>
              {/* Title + status */}
              <div className='flex items-start justify-between gap-3 mb-2'>
                <h3 className='text-lg font-semibold text-white leading-snug'>{selectedProject.title}</h3>
                <StatusBadge status={selectedProject.status} />
              </div>
              <div className='flex items-center gap-4 mb-5'>
                <span className='flex items-center gap-1.5 text-sm text-slate-500'>
                  <Building2 className='w-3.5 h-3.5' /> {selectedProject.company}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${catColor[selectedProject.category] || 'bg-slate-700 text-slate-400'}`}>
                  {selectedProject.category}
                </span>
              </div>

              {/* Description */}
              <div className='bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 mb-5'>
                <p className='text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2'>Description</p>
                <p className='text-sm text-slate-300 leading-relaxed'>{selectedProject.description}</p>
              </div>

              {/* Stats grid */}
              <div className='grid grid-cols-2 gap-3 mb-5'>
                <div className='bg-slate-800/60 border border-green-500/10 rounded-xl p-4'>
                  <p className='text-xs text-slate-500 mb-1.5'>Budget</p>
                  <p className='text-lg font-bold text-green-400'>${selectedProject.budget.toLocaleString()}</p>
                </div>
                <div className='bg-slate-800/60 border border-orange-500/10 rounded-xl p-4'>
                  <p className='text-xs text-slate-500 mb-1.5'>Deadline</p>
                  <p className='text-sm font-semibold text-white'>{fmt(selectedProject.deadline)}</p>
                </div>
                <div className='bg-slate-800/60 border border-blue-500/10 rounded-xl p-4'>
                  <p className='text-xs text-slate-500 mb-1.5'>Applied On</p>
                  <p className='text-sm font-semibold text-white'>{fmt(selectedProject.appliedDate)}</p>
                </div>
                <div className='bg-slate-800/60 border border-slate-700/50 rounded-xl p-4'>
                  <p className='text-xs text-slate-500 mb-2'>Status</p>
                  <StatusBadge status={selectedProject.status} />
                </div>
              </div>

              {/* Skills */}
              <div className='mb-6'>
                <p className='text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2.5'>Required Skills</p>
                <div className='flex flex-wrap gap-2'>
                  {selectedProject.skills.map((skill, i) => (
                    <span key={i} className='text-xs px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700/50 flex items-center gap-1.5'>
                      <CheckCircle className='w-3 h-3 text-blue-400' />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className='flex gap-3 px-6 pb-6'>
              <button
                onClick={closeModal}
                className='flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm font-medium transition-all'
              >
                Close
              </button>
              <button
                onClick={() => navigate('/student-dashboard/nda-requests')}
                className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors'
              >
                <FileText className='w-4 h-4' />
                Review NDA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedProjects;