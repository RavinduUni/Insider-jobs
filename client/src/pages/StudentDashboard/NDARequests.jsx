import { CheckCircle, Eye, FileText, Shield, X, XCircle, Clock, DollarSign, Building2, AlertTriangle } from 'lucide-react'
import React, { useState } from 'react'

// ── Inline StatusBadge ────────────────────────────────────────────────────────
const statusConfig = {
  'pending': { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  'nda-accepted': { label: 'Accepted', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  'rejected': { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};
const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
  );
};

// ── NDA document text ─────────────────────────────────────────────────────────
const ndaClauses = [
  { num: '1', title: 'Definition of Confidential Information', body: 'For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.' },
  { num: '2', title: 'Obligations of Receiving Party', body: 'Receiving Party agrees to hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.' },
  { num: '3', title: 'Term', body: 'This Agreement shall remain in effect for a period of 2 years from the date of acceptance, unless otherwise terminated in writing by both parties.' },
  { num: '4', title: 'Return of Materials', body: 'Upon completion of the project or upon request by Disclosing Party, all documents and materials containing Confidential Information shall be returned to Disclosing Party.' },
];

// ── Data ──────────────────────────────────────────────────────────────────────
const ndaRequests = [
  { id: 1, projectTitle: 'Mobile App UI Design', owner: 'TechStart Inc.', receivedDate: '2 days ago', status: 'pending', budget: 500 },
  { id: 2, projectTitle: 'E-commerce Website Development', owner: 'ShopEasy LLC', receivedDate: '5 days ago', status: 'pending', budget: 1200 },
];

const ndaHistory = [
  { id: 3, projectTitle: 'Logo Design for Startup', owner: 'BrandCo', date: '1 week ago', status: 'nda-accepted', action: 'Accepted' },
  { id: 4, projectTitle: 'Content Writing Project', owner: 'MediaHub', date: '2 weeks ago', status: 'rejected', action: 'Rejected' },
];

// ── Main Component ────────────────────────────────────────────────────────────
const NDARequests = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNDAModal, setSelectedNDAModal] = useState(null);

  const openModal = (nda) => { setSelectedNDAModal(nda); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setSelectedNDAModal(null); };

  return (
    <div className='min-h-screen'>

      {/* ── Page header ── */}
      <div className='mb-8'>
        <p className='text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1'>Agreements</p>
        <h1 className='text-3xl font-bold text-white mb-1'>NDA Management</h1>
        <p className='text-slate-500 text-sm'>Review and manage your non-disclosure agreements</p>
      </div>

      {/* ── Pending Requests ── */}
      <div className='mb-10'>
        <div className='flex items-center gap-3 mb-5'>
          <div className='w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center'>
            <Shield className='w-5 h-5 text-purple-400' />
          </div>
          <div>
            <h2 className='text-lg font-semibold text-white'>Pending NDA Requests</h2>
            <p className='text-xs text-slate-500'>You have {ndaRequests.length} pending requests requiring action</p>
          </div>
          <span className='ml-auto text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-semibold px-2.5 py-1 rounded-full'>
            {ndaRequests.length} pending
          </span>
        </div>

        <div className='flex flex-col gap-4'>
          {ndaRequests.map(nda => (
            <div
              key={nda.id}
              className='bg-slate-900 border border-purple-500/20 rounded-2xl p-5 hover:border-purple-500/40 transition-all duration-300'
            >
              {/* Top */}
              <div className='flex items-start justify-between gap-3 mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center shrink-0'>
                    <FileText className='w-4 h-4 text-purple-400' />
                  </div>
                  <div>
                    <h3 className='text-sm font-semibold text-white'>{nda.projectTitle}</h3>
                    <div className='flex items-center gap-1.5 mt-0.5'>
                      <Building2 className='w-3 h-3 text-slate-500' />
                      <span className='text-xs text-slate-500'>{nda.owner}</span>
                    </div>
                  </div>
                </div>
                <StatusBadge status={nda.status} />
              </div>

              {/* Meta */}
              <div className='flex flex-wrap items-center gap-4 mb-4 ml-12'>
                <span className='flex items-center gap-1.5 text-xs text-slate-400'>
                  <DollarSign className='w-3 h-3 text-green-400' />
                  <span className='text-green-400 font-semibold'>${nda.budget.toLocaleString()}</span>
                </span>
                <span className='flex items-center gap-1.5 text-xs text-slate-500'>
                  <Clock className='w-3 h-3' />
                  Received {nda.receivedDate}
                </span>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-2 ml-12 pt-4 border-t border-slate-800'>
                <button
                  onClick={() => openModal(nda)}
                  className='flex items-center gap-2 text-xs text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-all'
                >
                  <Eye className='w-3.5 h-3.5' />
                  View NDA
                </button>
                <button className='flex items-center gap-2 text-xs text-white bg-green-600/80 hover:bg-green-600 border border-green-500/30 px-4 py-2 rounded-xl transition-colors'>
                  <CheckCircle className='w-3.5 h-3.5' />
                  Accept
                </button>
                <button className='flex items-center gap-2 text-xs text-white bg-red-600/70 hover:bg-red-600 border border-red-500/30 px-4 py-2 rounded-xl transition-colors'>
                  <XCircle className='w-3.5 h-3.5' />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NDA History ── */}
      <div>
        <div className='flex items-center gap-3 mb-5'>
          <h2 className='text-lg font-semibold text-white'>NDA History</h2>
          <span className='text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full font-medium'>
            {ndaHistory.length} records
          </span>
        </div>

        <div className='flex flex-col gap-3'>
          {ndaHistory.map(nda => (
            <div
              key={nda.id}
              className='bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition-all'
            >
              <div className='flex items-center gap-4'>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${nda.action === 'Accepted'
                    ? 'bg-green-500/10 border border-green-500/20'
                    : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                  {nda.action === 'Accepted'
                    ? <CheckCircle className='w-4 h-4 text-green-400' />
                    : <XCircle className='w-4 h-4 text-red-400' />}
                </div>
                <div>
                  <p className='text-sm font-medium text-white'>{nda.projectTitle}</p>
                  <div className='flex items-center gap-2 mt-0.5'>
                    <span className='text-xs text-slate-500'>{nda.owner}</span>
                    <span className='text-slate-700'>·</span>
                    <span className='text-xs text-slate-500'>{nda.date}</span>
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3 shrink-0'>
                <StatusBadge status={nda.status} />
                <button
                  onClick={() => openModal({ ...nda, budget: '—', receivedDate: nda.date })}
                  className='text-xs text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors'
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NDA Modal ── */}
      {showModal && selectedNDAModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-black/75 backdrop-blur-sm'
            onClick={closeModal}
          />

          {/* Modal */}
          <div className='relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>

            {/* Header */}
            <div className='flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10'>
              <div className='flex items-center gap-3'>
                <div className='w-9 h-9 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center'>
                  <Shield className='w-4 h-4 text-blue-400' />
                </div>
                <div>
                  <p className='text-xs text-blue-400 font-semibold uppercase tracking-widest'>Legal Document</p>
                  <h2 className='text-lg font-bold text-white'>Non-Disclosure Agreement</h2>
                </div>
              </div>
              <button
                onClick={closeModal}
                className='w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            <div className='p-6 space-y-5'>

              {/* Project info banner */}
              <div className='bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-center gap-3'>
                <div className='w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0'>
                  <FileText className='w-4 h-4 text-blue-400' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-white'>{selectedNDAModal.projectTitle}</p>
                  <p className='text-xs text-slate-400 mt-0.5'>Issued by {selectedNDAModal.owner}</p>
                </div>
                <StatusBadge status={selectedNDAModal.status} />
              </div>

              {/* NDA document body */}
              <div className='bg-slate-800/50 border border-slate-700/50 rounded-xl p-5'>
                <h4 className='text-sm font-semibold text-white mb-1'>Non-Disclosure Agreement</h4>
                <p className='text-xs text-slate-400 leading-relaxed mb-5'>
                  This Non-Disclosure Agreement ("Agreement") is entered into as of the date of electronic
                  acceptance by and between <span className='text-white font-medium'>{selectedNDAModal.owner}</span> ("Disclosing Party")
                  and the undersigned student ("Receiving Party").
                </p>

                <div className='space-y-5'>
                  {ndaClauses.map(clause => (
                    <div key={clause.num}>
                      <div className='flex items-center gap-2 mb-1.5'>
                        <span className='w-5 h-5 bg-blue-600/20 text-blue-400 rounded-md flex items-center justify-center text-xs font-bold shrink-0'>
                          {clause.num}
                        </span>
                        <h5 className='text-sm font-semibold text-slate-200'>{clause.title}</h5>
                      </div>
                      <p className='text-xs text-slate-400 leading-relaxed pl-7'>{clause.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning banner */}
              <div className='bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 flex gap-3'>
                <AlertTriangle className='w-4 h-4 text-yellow-400 shrink-0 mt-0.5' />
                <p className='text-xs text-slate-400 leading-relaxed'>
                  <span className='text-yellow-400 font-semibold'>Important: </span>
                  By accepting this NDA, you agree to keep all project information confidential.
                  Violation of this agreement may result in legal action.
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className='flex gap-3 px-6 pb-6'>
              <button
                onClick={closeModal}
                className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all'
              >
                <XCircle className='w-4 h-4' />
                Reject NDA
              </button>
              <button
                onClick={closeModal}
                className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600/80 hover:bg-green-600 text-white text-sm font-medium transition-colors border border-green-500/30'
              >
                <CheckCircle className='w-4 h-4' />
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NDARequests;