import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Check, ChevronDown, ChevronUp, Zap, Shield, Star,
    ArrowRight, Briefcase, Users, Clock, Mail, BarChart2,
    Building2, Rocket
} from 'lucide-react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';

// ─── Plan Data ────────────────────────────────────────────────────────────────
const plans = [
    {
        id: 'free',
        name: 'Free',
        tagline: 'Try out InsiderJobs',
        price: null,
        priceLabel: 'Free',
        currency: null,
        badge: null,
        highlight: false,
        ctaText: 'Get Started Free',
        ctaVariant: 'outline',
        features: [
            { text: '1 Job Slot', included: true },
            { text: '10 Days per Listing', included: true },
            { text: 'Email Support', included: true },
            { text: 'CV Database Access', included: true },
            { text: 'Featured Job', included: false },
            { text: 'Priority Support', included: false },
            { text: 'Analytics Dashboard', included: false },
            { text: 'Dedicated Account Manager', included: false },
        ],
    },
    {
        id: 'starter',
        name: 'Starter',
        tagline: 'The best to try out',
        price: 4500,
        priceLabel: '4,500',
        currency: 'LKR',
        badge: null,
        highlight: false,
        ctaText: 'Choose Plan',
        ctaVariant: 'outline',
        features: [
            { text: '5 Job Slots', included: true },
            { text: '30 Days per Listing', included: true },
            { text: '1 Featured Job', included: true, accent: true },
            { text: 'Email Support', included: true },
            { text: 'CV Database Access', included: true },
            { text: 'Priority Support', included: false },
            { text: 'Analytics Dashboard', included: false },
            { text: 'Dedicated Account Manager', included: false },
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        tagline: 'For serious hiring',
        price: 12000,
        priceLabel: '12,000',
        currency: 'LKR',
        badge: 'Most Popular',
        highlight: true,
        ctaText: 'Get Pro Access',
        ctaVariant: 'solid',
        features: [
            { text: 'Unlimited Job Slots', included: true },
            { text: '60 Days per Listing', included: true },
            { text: '5 Featured Jobs', included: true, accent: true },
            { text: 'Priority Email & Chat Support', included: true },
            { text: 'Full CV Database Access', included: true },
            { text: 'Priority Support', included: true },
            { text: 'Analytics Dashboard', included: true },
            { text: 'Dedicated Account Manager', included: true },
        ],
    },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
    {
        q: 'Can I upgrade or downgrade my plan at any time?',
        a: 'Yes, absolutely. You can switch between plans at any time from your account dashboard. When upgrading, the difference is prorated immediately. When downgrading, the change takes effect at your next billing cycle.',
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, MasterCard, Amex), as well as bank transfers for annual plans. Payments are processed securely via Stripe.',
    },
    {
        q: 'Is there a contract or minimum commitment?',
        a: 'No contracts. All plans are month-to-month. You can cancel anytime and you will not be charged again after your current billing period ends.',
    },
    {
        q: 'What does "Featured Job" mean?',
        a: 'Featured jobs are shown at the top of search results and category listings with a highlighted badge. They typically receive 3–5× more views and applications than standard listings.',
    },
    {
        q: 'Do student accounts need a paid plan?',
        a: 'No. InsiderJobs is completely free for students. Students can browse, apply, and communicate with project owners at no cost, forever.',
    },
    {
        q: 'What happens when my job listing expires?',
        a: 'Expired listings are automatically archived. On the Starter and Pro plans, you can renew with one click. Free plan users need to create a new listing.',
    },
    {
        q: 'Is there a refund policy?',
        a: 'We offer a 7-day money-back guarantee on all paid plans. If you are not satisfied within the first 7 days of a new subscription, contact us for a full refund.',
    },
];

// ─── Trust Badges ─────────────────────────────────────────────────────────────
const trustPoints = [
    { icon: Shield, label: 'Secure Payments', sub: 'Stripe encrypted' },
    { icon: Clock, label: '7-Day Refund', sub: 'No questions asked' },
    { icon: Users, label: '10,000+ Users', sub: 'Active community' },
    { icon: BarChart2, label: 'Proven Results', sub: '4.9★ rated platform' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function PricingPage() {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="bg-white text-gray-900 font-sans">
            {/* NAV */}
            <Navbar2 />

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 -mt-18 py-40">
                {/* Glow blobs */}
                <div className="absolute top-16 left-1/3 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Simple, transparent pricing
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] text-white mb-5 tracking-tight">
                        Plans for every{' '}
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
                            hiring need
                        </span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
                        Start for free, scale as you grow. All plans include access to InsiderJobs' verified student talent pool.
                    </p>

                    {/* Trust badges row */}
                    <div className="flex flex-wrap justify-center gap-6 mt-2">
                        {trustPoints.map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                    <Icon className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white text-xs font-semibold leading-none">{label}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING CARDS ────────────────────────────────────────────── */}
            <section className="relative -mt-16 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {plans.map((plan) => (
                            <PricingCard key={plan.id} plan={plan} navigate={navigate} />
                        ))}
                    </div>

                    {/* Footnote */}
                    <p className="text-center text-xs text-gray-400 mt-8">
                        Prices are in Sri Lankan Rupees (LKR) and billed monthly. Taxes may apply.
                    </p>
                </div>
            </section>

            {/* ── FEATURE COMPARISON TABLE ─────────────────────────────────── */}
            <section className="py-24 bg-gray-50 border-y border-gray-100">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">Compare</p>
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">Everything in one place</h2>
                        <p className="text-gray-500">See exactly what's included in each plan.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        {/* Header row */}
                        <div className="grid grid-cols-4 border-b border-gray-100">
                            <div className="p-5 col-span-1" />
                            {plans.map((p) => (
                                <div key={p.id} className={`p-5 text-center border-l border-gray-100 ${p.highlight ? 'bg-blue-600' : ''}`}>
                                    <p className={`font-bold text-base ${p.highlight ? 'text-white' : 'text-gray-900'}`}>{p.name}</p>
                                    <p className={`text-xs mt-1 ${p.highlight ? 'text-blue-200' : 'text-gray-400'}`}>{p.priceLabel === 'Free' ? 'Free' : `LKR ${p.priceLabel}/mo`}</p>
                                </div>
                            ))}
                        </div>

                        {/* Feature rows */}
                        {[
                            { label: 'Job Slots', values: ['1', '5', 'Unlimited'] },
                            { label: 'Listing Duration', values: ['10 days', '30 days', '60 days'] },
                            { label: 'Featured Jobs', values: [false, '1', '5'] },
                            { label: 'CV Database Access', values: [true, true, 'Full Access'] },
                            { label: 'Email Support', values: [true, true, true] },
                            { label: 'Priority Support', values: [false, false, true] },
                            { label: 'Analytics Dashboard', values: [false, false, true] },
                            { label: 'Dedicated Account Manager', values: [false, false, true] },
                        ].map((row, idx) => (
                            <div key={row.label} className={`grid grid-cols-4 border-b border-gray-50 last:border-0 ${idx % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                                <div className="p-4 px-5 text-sm text-gray-600 font-medium flex items-center">{row.label}</div>
                                {row.values.map((val, i) => (
                                    <div key={i} className="p-4 border-l border-gray-100 flex items-center justify-center">
                                        {val === true ? (
                                            <Check className="w-4 h-4 text-blue-600" />
                                        ) : val === false ? (
                                            <span className="w-4 h-0.5 bg-gray-200 rounded-full block" />
                                        ) : (
                                            <span className="text-sm text-gray-700 font-medium">{val}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOR STUDENTS CALLOUT ─────────────────────────────────────── */}
            <section className="py-20 bg-slate-950">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-blue-900 to-blue-800 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                            <Rocket className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 relative z-10">
                            <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-2">For Students</p>
                            <h3 className="text-3xl font-bold text-white mb-3">InsiderJobs is always free for students</h3>
                            <p className="text-blue-100 text-sm leading-relaxed max-w-lg">
                                Create your profile, browse thousands of real-world projects, apply, get hired, and build your portfolio all at zero cost.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/auth?type=student&mode=register')}
                            className="relative z-10 shrink-0 flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-7 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                        >
                            Join Free <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section className="py-24 max-w-3xl mx-auto px-6">
                <div className="text-center mb-14">
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">FAQ</p>
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Common questions</h2>
                    <p className="text-gray-500">Everything you need to know about our pricing and plans.</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <FaqItem
                            key={idx}
                            faq={faq}
                            isOpen={openFaq === idx}
                            onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                        />
                    ))}
                </div>

                <p className="text-center text-gray-500 text-sm mt-12">
                    Still have questions?{' '}
                    <a href="mailto:support@insiderjobs.com" className="text-blue-600 font-medium hover:underline">
                        Contact our support team
                    </a>
                </p>
            </section>

            {/* ── FINAL CTA ────────────────────────────────────────────────── */}
            <section className="py-28 bg-slate-950 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl mx-auto px-6">
                    <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-4">Ready to hire?</p>
                    <h2 className="text-5xl font-extrabold text-white mb-5 leading-tight">
                        Start posting in minutes
                    </h2>
                    <p className="text-slate-400 text-lg mb-10">
                        Join 5,000+ companies already finding top university talent on InsiderJobs.
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            onClick={() => navigate('/auth?type=recruiter&mode=register')}
                            className="flex items-center gap-2 px-7 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all text-sm"
                        >
                            Post a Project <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/about')}
                            className="flex items-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-medium transition-all text-sm"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

// ─── Pricing Card Sub-Component ───────────────────────────────────────────────
function PricingCard({ plan, navigate }) {
    const isSolid = plan.ctaVariant === 'solid';

    return (
        <div
            className={`relative bg-white rounded-2xl p-7 flex flex-col transition-all duration-300
                ${plan.highlight
                    ? 'border-2 border-blue-600 shadow-xl shadow-blue-100 scale-[1.03]'
                    : 'border border-gray-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50'
                }`}
        >
            {/* Popular badge */}
            {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-white" /> {plan.badge}
                    </span>
                </div>
            )}

            {/* Plan name */}
            <p className="font-bold text-gray-900 text-base mb-1">{plan.name}</p>

            {/* Price */}
            <div className="flex items-end gap-1 mb-1">
                {plan.currency && (
                    <span className="text-sm text-gray-500 font-medium mb-1">{plan.currency}</span>
                )}
                <span className="text-5xl font-black text-gray-900 leading-none">{plan.priceLabel}</span>
                {plan.price && (
                    <span className="text-gray-400 text-sm mb-1">/mo</span>
                )}
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-sm mb-6">{plan.tagline}</p>

            {/* Divider */}
            <div className="h-px bg-gray-100 mb-6" />

            {/* Features */}
            <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-3">
                        {f.included ? (
                            <Check className={`w-4 h-4 shrink-0 ${f.accent ? 'text-blue-600' : 'text-blue-500'}`} />
                        ) : (
                            <span className="w-4 h-4 shrink-0 flex items-center justify-center">
                                <span className="w-3 h-0.5 bg-gray-200 rounded-full block" />
                            </span>
                        )}
                        <span
                            className={`text-sm leading-snug ${
                                !f.included
                                    ? 'text-gray-300'
                                    : f.accent
                                    ? 'text-blue-600 font-semibold'
                                    : 'text-gray-700'
                            }`}
                        >
                            {f.text}
                        </span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <button
                onClick={() => navigate(plan.id === 'free' ? '/auth?type=recruiter&mode=register' : '/auth?type=recruiter&mode=register')}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all cursor-pointer
                    ${isSolid
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
                        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
            >
                {plan.ctaText}
            </button>
        </div>
    );
}

// ─── FAQ Item Sub-Component ───────────────────────────────────────────────────
function FaqItem({ faq, isOpen, onToggle }) {
    return (
        <div
            className={`border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer
                ${isOpen ? 'border-blue-200 shadow-sm shadow-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
            onClick={onToggle}
        >
            <div className="flex items-center justify-between px-6 py-4 gap-4">
                <p className={`text-sm font-semibold leading-snug ${isOpen ? 'text-blue-700' : 'text-gray-800'}`}>
                    {faq.q}
                </p>
                <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-600' : 'bg-gray-100'}`}>
                    {isOpen
                        ? <ChevronUp className="w-4 h-4 text-white" />
                        : <ChevronDown className="w-4 h-4 text-gray-500" />
                    }
                </div>
            </div>
            {isOpen && (
                <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
            )}
        </div>
    );
}