import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Filter,
  Globe,
  MapPin,
  Search,
  Star,
  Users,
  X,
} from 'lucide-react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';

const companies = [
  {
    id: 1,
    name: 'NovaByte Labs',
    initials: 'NB',
    industry: 'SaaS',
    location: 'San Francisco, USA',
    size: '51-200',
    projectsPosted: 58,
    hiredStudents: 143,
    rating: 4.9,
    verified: true,
    website: 'novabytelabs.com',
    about: 'Building productivity SaaS for remote teams and fast-moving startups.',
    hiringFor: ['Frontend Developers', 'Data Analysts', 'Product Designers'],
    logoColor: 'from-blue-600 to-cyan-500',
  },
  {
    id: 2,
    name: 'GreenOrbit Mobility',
    initials: 'GO',
    industry: 'Mobility',
    location: 'Berlin, Germany',
    size: '201-500',
    projectsPosted: 34,
    hiredStudents: 89,
    rating: 4.7,
    verified: true,
    website: 'greenorbit.io',
    about: 'Designing connected mobility software for urban transport systems.',
    hiringFor: ['Mobile Engineers', 'ML Engineers', 'QA Testers'],
    logoColor: 'from-emerald-600 to-teal-500',
  },
  {
    id: 3,
    name: 'PixelMint Studio',
    initials: 'PM',
    industry: 'Design Agency',
    location: 'Toronto, Canada',
    size: '11-50',
    projectsPosted: 41,
    hiredStudents: 102,
    rating: 4.8,
    verified: false,
    website: 'pixelmint.studio',
    about: 'A product-first design agency partnering with high-growth digital brands.',
    hiringFor: ['UI/UX Designers', 'Brand Designers'],
    logoColor: 'from-fuchsia-600 to-pink-500',
  },
  {
    id: 4,
    name: 'QuantNest Analytics',
    initials: 'QN',
    industry: 'FinTech',
    location: 'London, UK',
    size: '51-200',
    projectsPosted: 27,
    hiredStudents: 67,
    rating: 4.6,
    verified: true,
    website: 'quantnest.ai',
    about: 'Real-time financial intelligence tools powered by machine learning.',
    hiringFor: ['Data Scientists', 'Backend Developers', 'API Engineers'],
    logoColor: 'from-indigo-600 to-violet-500',
  },
  {
    id: 5,
    name: 'CloudVerse Systems',
    initials: 'CV',
    industry: 'Cloud Infrastructure',
    location: 'Bangalore, India',
    size: '501-1000',
    projectsPosted: 76,
    hiredStudents: 208,
    rating: 4.9,
    verified: true,
    website: 'cloudverse.dev',
    about: 'Cloud-native infrastructure solutions for scaling software teams.',
    hiringFor: ['DevOps Interns', 'Full Stack Developers'],
    logoColor: 'from-sky-600 to-blue-500',
  },
  {
    id: 6,
    name: 'MediSpark Health',
    initials: 'MS',
    industry: 'HealthTech',
    location: 'Melbourne, Australia',
    size: '201-500',
    projectsPosted: 32,
    hiredStudents: 95,
    rating: 4.7,
    verified: false,
    website: 'medispark.health',
    about: 'Digital health products improving patient engagement and care workflows.',
    hiringFor: ['React Developers', 'Product Researchers'],
    logoColor: 'from-rose-600 to-orange-500',
  },
  {
    id: 7,
    name: 'TerraGrid Energy',
    initials: 'TG',
    industry: 'Energy',
    location: 'Austin, USA',
    size: '1000+',
    projectsPosted: 49,
    hiredStudents: 136,
    rating: 4.5,
    verified: true,
    website: 'terragrid.energy',
    about: 'Building software for smart grids, sustainability, and energy optimization.',
    hiringFor: ['IoT Developers', 'Data Engineers'],
    logoColor: 'from-lime-600 to-green-500',
  },
  {
    id: 8,
    name: 'OrbitEdu Platforms',
    initials: 'OE',
    industry: 'EdTech',
    location: 'Singapore',
    size: '11-50',
    projectsPosted: 63,
    hiredStudents: 179,
    rating: 4.8,
    verified: true,
    website: 'orbitedu.com',
    about: 'Modern learning platforms for universities and online academies.',
    hiringFor: ['Frontend Developers', 'Content Writers', 'Motion Designers'],
    logoColor: 'from-amber-500 to-yellow-400',
  },
];

const industryOptions = ['all', ...new Set(companies.map((company) => company.industry))];
const sizeOptions = ['all', '11-50', '51-200', '201-500', '501-1000', '1000+'];

export default function Companies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        !searchQuery ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.about.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.hiringFor.some((role) => role.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
      const matchesSize = selectedSize === 'all' || company.size === selectedSize;
      const matchesVerification = !verifiedOnly || company.verified;

      return matchesSearch && matchesIndustry && matchesSize && matchesVerification;
    });
  }, [searchQuery, selectedIndustry, selectedSize, verifiedOnly]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('all');
    setSelectedSize('all');
    setVerifiedOnly(false);
  };

  const activeFilterCount =
    (selectedIndustry !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen">
      <Navbar2 />

      <section className="relative overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 py-20">
        <div className="absolute top-10 left-1/4 w-96 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-56 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-medium px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {companies.length} verified companies hiring now
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Discover Top{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
              Hiring Companies
            </span>
          </h1>
          <p className="text-slate-400 text-base max-w-2xl mx-auto mb-8">
            Explore project owners with strong track records, student-friendly collaboration, and consistent paid opportunities.
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, role, or keyword..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {industryOptions.map((industry) => (
            <button
              key={industry}
              onClick={() => setSelectedIndustry(industry)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selectedIndustry === industry
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {industry === 'all' ? 'All Industries' : industry}
            </button>
          ))}

          <button
            onClick={() => setMobileFilterOpen(true)}
            className="ml-auto shrink-0 lg:hidden flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </section>

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl">
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <div className="space-y-6 pt-7">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Company Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selectedSize === size
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {size === 'all' ? 'All Sizes' : size}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                Show verified companies only
              </label>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-20">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Refine
              </h2>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Company Size</p>
                <div className="space-y-2">
                  {sizeOptions.map((size) => (
                    <label key={size} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="company-size"
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(size)}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm text-gray-600">{size === 'all' ? 'All Sizes' : size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer mb-5">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                Verified only
              </label>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          <main className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-gray-900 font-semibold">
                {filteredCompanies.length}{' '}
                <span className="text-gray-400 font-normal">
                  compan{filteredCompanies.length === 1 ? 'y' : 'ies'} found
                </span>
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500" />
                  {companies.reduce((sum, company) => sum + company.projectsPosted, 0)} projects posted
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  {companies.reduce((sum, company) => sum + company.hiredStudents, 0)} students hired
                </span>
              </div>
            </div>

            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredCompanies.map((company) => (
                  <article
                    key={company.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${company.logoColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
                          {company.initials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                          <p className="text-xs text-gray-400">{company.industry}</p>
                        </div>
                      </div>
                      {company.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{company.about}</p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {company.hiringFor.map((role) => (
                        <span
                          key={role}
                          className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate">{company.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{company.size} employees</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{company.projectsPosted} projects</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span>{company.rating.toFixed(1)} rating</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <a
                        href={`https://${company.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        {company.website}
                      </a>
                      <button className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-semibold hover:gap-2 transition-all">
                        View Profile <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies matched</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Try broadening your filters or searching with a different keyword.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                >
                  Reset filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

            <section className="py-16 bg-linear-to-br from-slate-950 via-blue-950 to-slate-900 relative overflow-hidden mt-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Want your company featured here?</h2>
          <p className="text-slate-400 mb-6 text-sm">
            Create a recruiter profile, verify your organization, and start posting projects in minutes.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all">
              Register as Company <ArrowRight className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium text-sm transition-all">
              Learn About Verification
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}