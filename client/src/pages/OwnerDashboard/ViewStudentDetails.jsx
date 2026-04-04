import {
  ArrowLeft, Award, Briefcase, Clock, ExternalLink,
  Eye, FileText, GraduationCap, Mail, MapPin,
  Phone, Star, UserCheck, X, DollarSign
} from 'lucide-react'
import React, { useRef } from 'react'
import heroImg2 from '../../assets/heroImg2.jpg'
import { useNavigate } from 'react-router-dom'

// ── Inline StatusBadge ────────────────────────────────────────────────────────
const statusConfig = {
  'applied': { label: 'Under Review', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  'nda-sent': { label: 'NDA Sent', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'nda-accepted': { label: 'NDA Accepted', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'in-progress': { label: 'In Progress', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  'completed': { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
}
const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
  return <span className={`text-xs font-medium px-3 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
}

// ── Applicant data ────────────────────────────────────────────────────────────
const applicant = {
  id: 1,
  name: 'Alex Johnson',
  email: 'alex.johnson@mit.edu',
  phone: '+1 (555) 123-4567',
  profilePhoto: heroImg2,
  projectId: 1,
  university: 'MIT',
  degree: 'Computer Science, Senior',
  location: 'Cambridge, MA',
  rating: 4.9,
  completedProjects: 12,
  totalEarnings: 12500,
  memberSince: 'Jan 2024',
  appliedDate: '2 hours ago',
  responseRate: '98%',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'AWS', 'MongoDB', 'REST APIs'],
  bio: "Passionate full-stack developer with 2+ years of experience building modern web applications. Specialized in React and Node.js ecosystems. I love creating clean, efficient, and scalable solutions. Currently pursuing my Bachelor's in Computer Science at MIT with a focus on software engineering and cloud technologies. Available for freelance projects 20+ hours per week.",
  projectPlan: 'Available',
  cv: 'Available',
  ndaStatus: 'nda-accepted',
  ndaAcceptedDate: '1 hour ago',
  portfolio: 'https://alexjohnson.dev',
  linkedin: 'https://linkedin.com/in/alexjohnson',
  github: 'https://github.com/alexjohnson',
  feedbacks: [
    { id: 1, projectTitle: 'E-commerce Platform Frontend', clientName: 'TechCorp Inc.', rating: 5, date: 'Nov 2025', budget: 1200, duration: '3 weeks', comment: 'Excellent work! Alex delivered the project ahead of schedule with outstanding quality. Very professional and responsive to feedback. The code was clean, well-documented, and exceeded our expectations. Highly recommended for any React-based projects!', skills: ['React', 'TypeScript', 'Tailwind CSS'] },
    { id: 2, projectTitle: 'Dashboard Analytics Tool', clientName: 'DataViz Solutions', rating: 5, date: 'Oct 2025', budget: 1500, duration: '4 weeks', comment: 'Amazing developer with great attention to detail. The dashboard exceeded our expectations with beautiful visualizations and smooth performance. Will definitely work with Alex again on future projects.', skills: ['React', 'Chart.js', 'Node.js'] },
    { id: 3, projectTitle: 'Mobile App Landing Page', clientName: 'StartupX', rating: 4.8, date: 'Sep 2025', budget: 800, duration: '2 weeks', comment: 'Great communication and solid technical skills. Delivered a beautiful, responsive landing page that works perfectly across all devices. Minor revisions needed but overall very satisfied with the final result.', skills: ['HTML', 'CSS', 'JavaScript'] },
    { id: 4, projectTitle: 'API Integration Service', clientName: 'CloudSync Pro', rating: 4.9, date: 'Aug 2025', budget: 1000, duration: '2 weeks', comment: 'Exceptional problem-solving skills. Alex integrated multiple third-party APIs seamlessly and handled complex authentication flows with ease. Professional, timely, and great to work with!', skills: ['Node.js', 'REST APIs', 'AWS'] },
    { id: 5, projectTitle: 'Database Migration Project', clientName: 'Enterprise Solutions Ltd', rating: 4.7, date: 'Jul 2025', budget: 900, duration: '3 weeks', comment: 'Solid performance on a challenging migration project. Alex demonstrated strong database knowledge and completed the task efficiently. Good communication throughout the project.', skills: ['MongoDB', 'Node.js', 'Python'] },
  ]
}

// ── Main Component ─────────────────────────────────────────────────────────────
const ViewStudentDetails = () => {
  const navigate = useNavigate()

  // ── Drag scroll refs (unchanged logic) ──
  const feedbackRef = useRef(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - feedbackRef.current.offsetLeft;
    scrollLeft.current = feedbackRef.current.scrollLeft
  }
  const onMouseLeave = () => { isDragging.current = false }
  const onMouseUp = () => { isDragging.current = false }
  const onMouseMove = (e) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - feedbackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.2
    feedbackRef.current.scrollLeft = scrollLeft.current - walk
  }

  const statCards = [
    { icon: Briefcase, label: 'Projects Completed', value: applicant.completedProjects, color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
    { icon: Award, label: 'Member Since', value: applicant.memberSince, color: 'bg-green-500/10 text-green-400', border: 'border-green-500/20' },
    { icon: Clock, label: 'Applied', value: applicant.appliedDate, color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/20' },
    { icon: Star, label: 'Rating', value: applicant.rating, color: 'bg-yellow-500/10 text-yellow-400', border: 'border-yellow-500/20' },
  ]

  const linkItems = [
    { href: applicant.portfolio, label: 'Portfolio', icon: Briefcase },
    { href: applicant.linkedin, label: 'LinkedIn', icon: ExternalLink },
    { href: applicant.github, label: 'GitHub', icon: ExternalLink },
  ]

  return (
    <div className="min-h-screen">

      {/* ── Back nav ── */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to applicants
      </button>

      {/* ── Profile card ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">

        {/* Top: avatar + name */}
        <div className="flex items-start gap-5 mb-6">
          {applicant.profilePhoto
            ? <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-700 shrink-0">
              <img src={applicant.profilePhoto} alt="profile" className="w-full h-full object-cover object-center" />
            </div>
            : <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {applicant.name.slice(0, 2)}
            </div>
          }
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{applicant.name}</h1>
              <StatusBadge status={applicant.ndaStatus} />
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-blue-400" />{applicant.university}</span>
              <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-blue-400" />{applicant.degree}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-400" />{applicant.location}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{applicant.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{applicant.phone}</span>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {statCards.map(({ icon: Icon, label, value, color, border }) => (
            <div key={label} className={`bg-slate-800/60 border ${border} rounded-xl px-4 py-3.5 flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3">
          <StatusBadge status={applicant.ndaStatus} />
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-all cursor-pointer">
              <Eye className="w-3.5 h-3.5" /> View NDA
            </button>
            <button className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-500 border border-blue-500/30 px-4 py-2 rounded-xl transition-colors cursor-pointer">
              <UserCheck className="w-3.5 h-3.5" /> Assign Project
            </button>
            <button className="flex items-center gap-1.5 text-xs text-red-400 border border-red-500/20 px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer">
              <X className="w-3.5 h-3.5" /> Reject Application
            </button>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-3 gap-5 items-start">

        {/* ── Left col (2/3) ── */}
        <div className="col-span-2 space-y-5">

          {/* Applied for */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4">
            <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-xl shrink-0">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Applied for</p>
              <h2 className="text-lg font-semibold text-white mb-3">React Dashboard Development</h2>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-slate-500">Budget</p>
                  <p className="text-sm font-bold text-green-400 mt-0.5">$800</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Deadline</p>
                  <p className="text-sm font-bold text-blue-400 mt-0.5">2 weeks</p>
                </div>
              </div>
            </div>
          </div>

          {/* About + Skills + Feedbacks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-7">

            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-xl">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white">About</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{applicant.bio}</p>
            </div>

            <div className="border-t border-slate-800" />

            {/* Skills */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-xl">
                  <Award className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white">Skills & Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800" />

            {/* Client Feedbacks */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center rounded-xl">
                  <Star className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Client Feedbacks</h3>
                  <p className="text-xs text-slate-500">4.9 average rating</p>
                </div>
              </div>

              {/* Drag scroll carousel */}
              <ul
                ref={feedbackRef}
                className="flex gap-4 overflow-x-auto pb-2 cursor-grab active:cursor-grabbing select-none scrollbar-none"
                style={{ scrollbarWidth: 'none' }}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
              >
                {applicant.feedbacks.map((fb) => (
                  <li key={fb.id} className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl max-w-[400px] shrink-0">
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl text-xs font-bold shrink-0">
                          {fb.clientName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white leading-snug">{fb.projectTitle}</p>
                          <p className="text-xs text-slate-500">{fb.clientName}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full shrink-0">
                        <Star className="w-3 h-3 fill-current" />{fb.rating}
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">{fb.comment}</p>

                    {/* Footer */}
                    <div className="flex items-center gap-5 pt-3 border-t border-slate-700/50">
                      <div>
                        <p className="text-xs font-semibold text-white">{fb.date}</p>
                        <p className="text-xs text-slate-600">Date</p>
                      </div>
                      <div className="w-px h-6 bg-slate-700" />
                      <div>
                        <p className="text-xs font-semibold text-green-400">${fb.budget}</p>
                        <p className="text-xs text-slate-600">Budget</p>
                      </div>
                      <div className="w-px h-6 bg-slate-700" />
                      <div>
                        <p className="text-xs font-semibold text-white">{fb.duration}</p>
                        <p className="text-xs text-slate-600">Duration</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Scroll nav */}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => feedbackRef.current.scrollBy({ left: -400, behavior: 'smooth' })}
                  className="text-xs text-slate-400 hover:text-blue-400 transition-colors cursor-pointer px-3 py-1.5 border border-slate-700 rounded-lg hover:border-blue-500/30"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => feedbackRef.current.scrollBy({ left: 400, behavior: 'smooth' })}
                  className="text-xs text-slate-400 hover:text-blue-400 transition-colors cursor-pointer px-3 py-1.5 border border-slate-700 rounded-lg hover:border-blue-500/30"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right col (1/3) ── */}
        <div className="col-span-1 space-y-4">

          {/* Documents */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-xl">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Documents</h2>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">CV / Resume</p>
                  <p className="text-xs text-slate-500">PDF · 245 KB</p>
                </div>
              </div>
              <button className="text-xs text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer">
                Download
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center rounded-xl">
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Links</h2>
            </div>

            <div className="flex flex-col gap-2">
              {linkItems.filter(l => l.href).map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 px-4 py-3 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
                >
                  <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-blue-400 transition-colors">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Earnings info */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-green-500/10 border border-green-500/20 flex items-center justify-center rounded-xl">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <h2 className="text-base font-semibold text-white">Earnings</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-white">${(applicant.totalEarnings / 1000).toFixed(1)}k</p>
                <p className="text-xs text-slate-500 mt-0.5">Total Earned</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-white">{applicant.responseRate}</p>
                <p className="text-xs text-slate-500 mt-0.5">Response Rate</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewStudentDetails