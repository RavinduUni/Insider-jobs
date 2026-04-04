import React from 'react'
import { assets } from '../assets/assets'
import { Briefcase } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-14 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-3.5 h-3.5 text-white" />
                                </div>
                                <span className="font-bold text-white">Insider<span className="text-blue-400">jobs</span></span>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">Connecting university students with real-world opportunities since 2023.</p>
                        </div>
                        {[
                            { heading: 'For Students', links: ['Browse Projects', 'How It Works', 'Success Stories', 'Resume Builder'] },
                            { heading: 'For Owners', links: ['Post a Project', 'Pricing', 'Find Talent', 'Enterprise'] },
                            { heading: 'Company', links: ['About Us', 'Contact', 'Privacy', 'Terms'] },
                        ].map(col => (
                            <div key={col.heading}>
                                <p className="text-sm font-semibold text-slate-200 mb-4">{col.heading}</p>
                                <ul className="space-y-2.5">
                                    {col.links.map(l => (
                                        <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <p className="text-xs text-slate-600">© 2025 InsiderJobs LLC. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
                                <a key={s} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">{s}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
  )
}

export default Footer