import {
    ArrowLeft, CheckCircle, Clock, DollarSign,
    Eye, FileText, Send, Star, UserCheck, Users, X, AlertTriangle
} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ── Inline StatusBadge ────────────────────────────────────────────────────────
const statusConfig = {
    'not-sent': { label: 'NDA Not Sent', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
    'pending': { label: 'NDA Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    'nda-sent': { label: 'NDA Sent', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    'nda-accepted': { label: 'NDA Accepted', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
}
const StatusBadge = ({ status }) => {
    const cfg = statusConfig[status] || { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
}

// ── Static data (unchanged) ───────────────────────────────────────────────────
const projects = [
    { id: 1, title: 'React Dashboard Development', budget: 800, deadline: '2 weeks' },
    { id: 2, title: 'Mobile App UI Design', budget: 500, deadline: '10 days' },
    { id: 3, title: 'Content Writing - Tech Blog', budget: 200, deadline: '1 week' },
]

const allApplicants = [
    { id: 1, name: 'Alex Johnson', projectId: 1, university: 'MIT', degree: 'Computer Science', rating: 4.9, completedProjects: 12, appliedDate: '2025-11-18T20:00:00Z', skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'], cv: 'Available', ndaStatus: 'nda-accepted', ndaAcceptedDate: '2025-12-19T10:15:00Z' },
    { id: 2, name: 'Sarah Chen', projectId: 1, university: 'Stanford University', degree: 'Software Engineering', rating: 4.8, completedProjects: 15, appliedDate: '2025-12-11T10:15:00Z', skills: ['React', 'Vue.js', 'UI/UX', 'Figma'], cv: 'Available', ndaStatus: 'nda-sent', ndaSentDate: '2025-12-11T10:15:00Z' },
    { id: 3, name: 'Mike Wilson', projectId: 1, university: 'UCLA', degree: 'Information Technology', rating: 4.7, completedProjects: 8, appliedDate: '2025-12-19T10:15:00Z', skills: ['JavaScript', 'React', 'CSS', 'HTML'], cv: 'Available', ndaStatus: 'not-sent' },
    { id: 4, name: 'Emma Davis', projectId: 2, university: 'UC Berkeley', degree: 'Computer Science', rating: 4.9, completedProjects: 18, appliedDate: '2025-12-19T10:15:00Z', skills: ['React Native', 'Flutter', 'UI/UX', 'Figma'], cv: 'Available', ndaStatus: 'nda-accepted', ndaAcceptedDate: '2025-12-19T10:15:00Z' },
    { id: 5, name: 'James Brown', projectId: 2, university: 'Harvard University', degree: 'Design', rating: 4.6, completedProjects: 10, appliedDate: '2025-12-19T10:15:00Z', skills: ['Figma', 'Adobe XD', 'Sketch', 'UI/UX'], cv: 'Available', ndaStatus: 'pending', ndaSentDate: '2025-12-19T10:15:00Z' },
    { id: 6, name: 'Sophia Martinez', projectId: 3, university: 'Columbia University', degree: 'English Literature', rating: 4.8, completedProjects: 14, appliedDate: '2025-12-19T10:15:00Z', skills: ['Content Writing', 'SEO', 'Copywriting', 'Technical Writing'], cv: 'Available', ndaStatus: 'not-sent' },
    { id: 7, name: 'David Lee', projectId: 3, university: 'NYU', degree: 'Journalism', rating: 4.7, completedProjects: 11, appliedDate: '2025-12-19T06:15:00Z', skills: ['Content Writing', 'Blogging', 'Research', 'Editing'], cv: 'Available', ndaStatus: 'not-sent' },
]

// ── timeAgo (unchanged logic) ─────────────────────────────────────────────────
const timeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    let diffMs = now - date
    if (diffMs < 0) return 'Just now'
    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(diffMs / 60000)
    const hours = Math.floor(diffMs / 3600000)
    const days = Math.floor(diffMs / 86400000)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    if (seconds < 60) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
    return `${years} year${years > 1 ? 's' : ''} ago`
}

// ── Backdrop helper ───────────────────────────────────────────────────────────
const Backdrop = ({ onClick }) => (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClick} />
)

// ── Main Component ────────────────────────────────────────────────────────────
const ProjectApplicants = () => {
    const { projectId } = useParams()
    const navigate = useNavigate()

    const [showNDAModel, setShowNDAModel] = useState(false)
    const [showAssignProjectModel, setShowAssignProjectModel] = useState(false)
    const [selectedApplicant, setSelectedApplicant] = useState(null)

    const project = projects.find(p => p.id === Number(projectId))
    const projectApplicants = allApplicants.filter(a => a.projectId === Number(projectId))

    return (
        <div className="min-h-screen space-y-5">

            {/* ── Project header card ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Project</p>
                            <h2 className="text-lg font-bold text-white mb-2">{project?.title}</h2>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1 text-green-400 font-semibold">
                                    <DollarSign className="w-3 h-3" />${project?.budget}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{project?.deadline}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />{projectApplicants.length} applicants
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xs text-slate-400 border border-slate-700 px-3 py-2 rounded-xl hover:text-white hover:border-slate-600 transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Go Back
                    </button>
                </div>
            </div>

            {/* ── Applicant grid ── */}
            <div className="grid grid-cols-2 gap-4">
                {projectApplicants.map(applicant => (
                    <div
                        key={applicant.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-blue-500/30 transition-all group"
                    >
                        {/* Avatar + name + rating */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                    {applicant.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">{applicant.name}</p>
                                    <p className="text-xs text-slate-500">{applicant.university}</p>
                                    <p className="text-xs text-slate-600">{applicant.degree}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400 shrink-0">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-semibold">{applicant.rating}</span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {applicant.skills.slice(0, 3).map(skill => (
                                <span key={skill} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md border border-slate-700/50">{skill}</span>
                            ))}
                            {applicant.skills.length > 3 && (
                                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-600 rounded-md">+{applicant.skills.length - 3}</span>
                            )}
                        </div>

                        {/* Status + meta */}
                        <div className="flex items-center justify-between mb-2">
                            <StatusBadge status={applicant.ndaStatus} />
                            <span className="text-xs text-slate-600">{timeAgo(applicant.appliedDate)}</span>
                        </div>

                        <p className="text-xs text-slate-600 mb-3">{applicant.completedProjects} projects completed</p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                            <button
                                onClick={() => navigate(`/owner-dashboard/view-details/${applicant.id}`)}
                                className="flex items-center gap-1.5 text-xs text-blue-400 border border-blue-500/20 px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all cursor-pointer"
                            >
                                <Eye className="w-3 h-3" /> View Details
                            </button>

                            <button
                                onClick={() => { setSelectedApplicant(applicant); setShowNDAModel(true) }}
                                className="flex items-center gap-1.5 text-xs text-slate-400 border border-slate-700/50 px-2.5 py-1.5 rounded-lg hover:text-white hover:border-slate-600 transition-all cursor-pointer"
                            >
                                <FileText className="w-3 h-3" /> View NDA
                            </button>

                            <button
                                onClick={() => { setSelectedApplicant(applicant); setShowAssignProjectModel(true) }}
                                className="flex items-center gap-1.5 text-xs text-green-400 border border-green-500/20 px-2.5 py-1.5 rounded-lg hover:bg-green-500/10 transition-all cursor-pointer"
                            >
                                <UserCheck className="w-3 h-3" /> Assign
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── NDA Review Modal ── */}
            {showNDAModel && selectedApplicant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <Backdrop onClick={() => setShowNDAModel(false)} />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
                            <div>
                                <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Review</p>
                                <h2 className="text-xl font-bold text-white">NDA Response</h2>
                            </div>
                            <button onClick={() => setShowNDAModel(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Status banner */}
                        <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-5">
                            <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-white">NDA Accepted</p>
                                <p className="text-xs text-slate-500 mt-0.5">Accepted {timeAgo(selectedApplicant.appliedDate)}</p>
                            </div>
                        </div>

                        {/* NDA Document */}
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">NDA Document</p>
                        <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">Signed NDA Agreement</p>
                                    <p className="text-xs text-slate-500">PDF · 1.2 MB</p>
                                </div>
                            </div>
                            <button className="text-xs text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors cursor-pointer">
                                Download
                            </button>
                        </div>

                        {/* Applicant info */}
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-5">
                            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Applicant Information</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                    {selectedApplicant.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-white">{selectedApplicant.name}</p>
                                    <p className="text-xs text-slate-500">{selectedApplicant.university}</p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span className="text-sm font-medium">{selectedApplicant.rating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3">
                            <button onClick={() => setShowNDAModel(false)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-all cursor-pointer">
                                Close
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer">
                                <UserCheck className="w-4 h-4" /> Assign Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Assign Project Modal ── */}
            {showAssignProjectModel && selectedApplicant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <Backdrop onClick={() => setShowAssignProjectModel(false)} />
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl p-6">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
                            <div>
                                <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-1">Action</p>
                                <h2 className="text-xl font-bold text-white">Assign Project</h2>
                            </div>
                            <button onClick={() => setShowAssignProjectModel(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Assigning to */}
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-4">
                            <p className="text-xs text-slate-500 mb-2">Assigning to</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                    {selectedApplicant.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{selectedApplicant.name}</p>
                                    <p className="text-xs text-slate-500">{selectedApplicant.university}</p>
                                </div>
                            </div>
                        </div>

                        {/* NDA status */}
                        <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl px-4 py-3 mb-4">
                            <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-white">NDA Accepted</p>
                                <p className="text-xs text-slate-500">The student has reviewed and accepted the NDA agreement.</p>
                            </div>
                        </div>

                        {/* Project details */}
                        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 mb-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">Project Details</p>
                            <p className="text-sm font-medium text-white mb-2">{project?.title}</p>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" />${project?.budget}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />{project?.deadline}
                                </span>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex gap-2 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 mb-5">
                            <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Once assigned, the student will be notified and can start working. Other applicants will be automatically rejected.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3">
                            <button onClick={() => setShowAssignProjectModel(false)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 text-sm transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer">
                                <UserCheck className="w-4 h-4" /> Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ProjectApplicants