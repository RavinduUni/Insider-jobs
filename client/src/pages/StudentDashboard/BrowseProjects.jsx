import {
  ChevronDown, ChevronUp, Clock, DollarSign,
  Search, SortAsc, Tag, X, SlidersHorizontal,
  Star, Briefcase, ArrowRight
} from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

// ── Data ─────────────────────────────────────────────────────────────────────
const categories = [
  { label: 'All Categories', value: 'all' },
  { label: 'Web Development', value: 'web development' },
  { label: 'Machine Learning', value: 'machine learning' },
  { label: 'UI/UX Designing', value: 'ui/ux designing' },
  { label: 'Mobile Development', value: 'mobile development' },
  { label: 'Data Analysis', value: 'data analysis' },
  { label: 'API Development', value: 'api development' },
];

const budgetOptions = [
  { label: '$0 – $500', value: '0-500', min: 0, max: 500 },
  { label: '$500 – $1,000', value: '500-1000', min: 500, max: 1000 },
  { label: '$1,000 – $2,000', value: '1000-2000', min: 1000, max: 2000 },
  { label: '$2,000+', value: '2000-999999', min: 2000, max: 999999 },
];

const deadlineOptions = [
  { label: 'Under 1 week', value: '1-7', min: 1, max: 7 },
  { label: '1–2 weeks', value: '8-14', min: 8, max: 14 },
  { label: '2–4 weeks', value: '15-30', min: 15, max: 30 },
  { label: '1+ month', value: '31-999', min: 31, max: 999 },
];

const allSkills = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
  'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Neural Networks', 'Deep Learning',
  'Figma', 'Adobe XD', 'Sketch', 'Wireframing', 'Prototyping', 'User Research',
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
  'Python', 'Pandas', 'NumPy', 'Data Visualization', 'SQL', 'Excel',
  'REST API', 'GraphQL', 'FastAPI', 'Django', 'Flask', 'Microservices',
];

const projects = [
  { id: 1, title: 'E-commerce Website with React & Node.js', budget: 1500, deadline: '3 weeks', category: 'Web Development', skills: ['React', 'Node.js', 'MongoDB', 'Express','Docker'], ownerRating: 4.8, description: 'Build a full-stack e-commerce platform with product catalog, shopping cart, payment integration, and admin dashboard.', postedDate: '2024-11-25' },
  { id: 2, title: 'Image Classification ML Model', budget: 2200, deadline: '4 weeks', category: 'Machine Learning', skills: ['TensorFlow', 'PyTorch', 'Python', 'Deep Learning'], ownerRating: 4.9, description: 'Develop a CNN-based image classification model to categorize product images with 90%+ accuracy. Dataset will be provided.', postedDate: '2024-11-28' },
  { id: 3, title: 'Mobile App UI/UX Design – Fitness Tracker', budget: 800, deadline: '2 weeks', category: 'UI/UX Designing', skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research'], ownerRating: 4.7, description: 'Create a modern, intuitive UI/UX design for a fitness tracking mobile app. Include wireframes, high-fidelity mockups, and interactive prototype.', postedDate: '2024-11-27' },
  { id: 4, title: 'Cross-Platform Food Delivery App', budget: 2500, deadline: '5 weeks', category: 'Mobile Development', skills: ['React Native', 'Flutter', 'iOS', 'Android'], ownerRating: 4.6, description: 'Develop a cross-platform mobile app for food delivery with real-time tracking, payment integration, and user authentication.', postedDate: '2024-11-26' },
  { id: 5, title: 'Sales Data Analysis & Visualization', budget: 600, deadline: '10 days', category: 'Data Analysis', skills: ['Python', 'Pandas', 'SQL', 'Data Visualization'], ownerRating: 4.8, description: 'Analyze 2 years of sales data, identify trends, create interactive dashboards, and provide actionable insights for business growth.', postedDate: '2024-11-29' },
  { id: 6, title: 'RESTful API for Social Media Platform', budget: 1800, deadline: '3 weeks', category: 'API Development', skills: ['Node.js', 'Express', 'REST API', 'PostgreSQL'], ownerRating: 4.9, description: 'Build a scalable RESTful API for a social media platform with user authentication, posts, comments, and real-time notifications.', postedDate: '2024-11-24' },
  { id: 7, title: 'SaaS Dashboard with Vue.js', budget: 1200, deadline: '2 weeks', category: 'Web Development', skills: ['Vue.js', 'TypeScript', 'Tailwind'], ownerRating: 4.7, description: 'Develop a responsive SaaS dashboard with data visualization, user management, and subscription handling using Vue.js 3.', postedDate: '2024-11-23' },
  { id: 8, title: 'Sentiment Analysis NLP Model', budget: 1900, deadline: '3 weeks', category: 'Machine Learning', skills: ['Python', 'Scikit-learn', 'Neural Networks', 'NLP'], ownerRating: 4.8, description: 'Create an NLP model for sentiment analysis of customer reviews. Model should classify reviews as positive, negative, or neutral.', postedDate: '2024-11-22' },
  { id: 9, title: 'Dashboard UI Design for Analytics Platform', budget: 650, deadline: '1 week', category: 'UI/UX Designing', skills: ['Adobe XD', 'Sketch', 'Prototyping'], ownerRating: 4.6, description: 'Design a clean, professional dashboard UI for an analytics platform with charts, graphs, and data tables. Dark mode included.', postedDate: '2024-11-21' },
  { id: 10, title: 'iOS Expense Tracker App', budget: 1400, deadline: '4 weeks', category: 'Mobile Development', skills: ['Swift', 'iOS', 'CoreData'], ownerRating: 4.9, description: 'Build a native iOS app for expense tracking with categories, budgets, charts, and iCloud sync functionality.', postedDate: '2024-11-20' },
  { id: 11, title: 'Customer Behavior Analysis Dashboard', budget: 850, deadline: '2 weeks', category: 'Data Analysis', skills: ['Excel', 'SQL', 'Data Visualization', 'Python'], ownerRating: 4.5, description: 'Analyze customer behavior patterns from e-commerce data and create an interactive dashboard with key metrics and insights.', postedDate: '2024-11-19' },
  { id: 12, title: 'GraphQL API for E-learning Platform', budget: 2100, deadline: '4 weeks', category: 'API Development', skills: ['GraphQL', 'Node.js', 'MongoDB', 'Apollo'], ownerRating: 4.8, description: 'Develop a GraphQL API for an e-learning platform with courses, lessons, quizzes, and student progress tracking.', postedDate: '2024-11-18' },
];

// ── Category colour map ───────────────────────────────────────────────────────
const catColor = {
  'Web Development': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Machine Learning': 'bg-green-500/10 text-green-400 border-green-500/20',
  'UI/UX Designing': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Mobile Development': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Data Analysis': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'API Development': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const convertDeadlineToDays = (str) => {
  if (!str) return null;
  const [num, unit] = str.toLowerCase().split(' ');
  const v = Number(num);
  if (unit.startsWith('week')) return v * 7;
  if (unit.startsWith('day')) return v;
  return null;
};

// ── Collapsible filter section ────────────────────────────────────────────────
const FilterSection = ({ icon: Icon, title, expanded, onToggle, children }) => (
  <div className='border-b border-slate-700/50 pb-4'>
    <button
      onClick={onToggle}
      className='flex items-center justify-between w-full mb-3 text-slate-400 hover:text-white transition-colors'
    >
      <span className='flex items-center gap-2 text-sm font-medium'>
        {Icon && <Icon className='w-3.5 h-3.5' />}
        {title}
      </span>
      {expanded
        ? <ChevronUp className='w-3.5 h-3.5' />
        : <ChevronDown className='w-3.5 h-3.5' />}
    </button>
    {expanded && <div>{children}</div>}
  </div>
);

// ── Project card ──────────────────────────────────────────────────────────────
const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  const cc = catColor[project.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <div
      onClick={() => navigate(`/apply-project/${project.id}`)}
      className='bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-950/50 transition-all duration-300 cursor-pointer group flex flex-col gap-3'
    >
      {/* Top row */}
      <div className='flex items-start justify-between gap-2'>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cc} shrink-0`}>
          {project.category}
        </span>
        <div className='flex items-center gap-1 shrink-0'>
          <Star className='w-3 h-3 fill-yellow-400 text-yellow-400' />
          <span className='text-xs text-slate-400'>{project.ownerRating}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className='text-sm font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug'>
        {project.title}
      </h3>

      {/* Description */}
      <p className='text-xs text-slate-500 leading-relaxed line-clamp-2'>{project.description}</p>

      {/* Skills */}
      <div className='flex flex-wrap gap-1.5'>
        {project.skills.slice(0, 3).map((skill, index) => (
            <span className='text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md border border-slate-700/50' key={index}>{skill}</span>
          ))}
          {project.skills.length > 3 && (
            <span className='text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md border border-slate-700/50' >+{project.skills.length - 3}</span>
          )}
      </div>

      {/* Footer */}
      <div className='flex items-center justify-between pt-3 border-t border-slate-800 mt-auto'>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1'>
            <DollarSign className='w-3.5 h-3.5 text-green-400' />
            <span className='text-sm font-bold text-green-400'>${project.budget.toLocaleString()}</span>
          </div>
          <div className='flex items-center gap-1'>
            <Clock className='w-3.5 h-3.5 text-slate-500' />
            <span className='text-xs text-slate-500'>{project.deadline}</span>
          </div>
        </div>
        <span className='text-xs text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
          View <ArrowRight className='w-3 h-3' />
        </span>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const BrowseProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [budgetExpanded, setBudgetExpanded] = useState(true);
  const [deadlineExpanded, setDeadlineExpanded] = useState(true);
  const [skillsExpanded, setSkillsExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [budgetRanges, setBudgetRanges] = useState([]);
  const [deadlineRanges, setDeadlineRanges] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [sortBy, setSortBy] = useState('newest');

  // ── Toggle handlers (unchanged logic) ──
  const handleBudgetToggle = v => setBudgetRanges(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const handleDeadlineToggle = v => setDeadlineRanges(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  const handleSkillToggle = v => setSelectedSkills(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);

  const clearAll = () => {
    setSelectedCategory('all');
    setBudgetRanges([]);
    setDeadlineRanges([]);
    setSelectedSkills([]);
    setSearchTerm('');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    budgetRanges.length + deadlineRanges.length + selectedSkills.length;

  // ── Filter + sort (unchanged logic) ──
  const filteredProjects = projects.filter(project => {
    if (selectedCategory.toLowerCase() !== 'all' &&
      project.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;

    if (budgetRanges.length > 0) {
      const inBudget = budgetRanges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return project.budget >= min && project.budget <= max;
      });
      if (!inBudget) return false;
    }

    if (deadlineRanges.length > 0) {
      const days = convertDeadlineToDays(project.deadline);
      const inDeadline = deadlineRanges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return days >= min && days <= max;
      });
      if (!inDeadline) return false;
    }

    if (selectedSkills.length > 0) {
      if (!selectedSkills.some(s => project.skills.includes(s))) return false;
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      if (!project.title.toLowerCase().includes(q) &&
        !project.description.toLowerCase().includes(q)) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.postedDate) - new Date(a.postedDate);
    if (sortBy === 'oldest') return new Date(a.postedDate) - new Date(b.postedDate);
    if (sortBy === 'budget_low') return a.budget - b.budget;
    if (sortBy === 'budget_high') return b.budget - a.budget;
    return 0;
  });

  // ── Checkbox style helper ──
  const cbClass = 'w-3.5 h-3.5 rounded accent-blue-500 cursor-pointer bg-slate-700 border-slate-600';

  return (
    <div className='min-h-screen'>

      {/* ── Page header ── */}
      <div className='mb-6'>
        <p className='text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1'>Opportunities</p>
        <h1 className='text-3xl font-bold text-white mb-1'>Browse Projects</h1>
        <p className='text-slate-500 text-sm'>Find your next opportunity from {projects.length} available projects</p>
      </div>

      {/* ── Search + sort bar ── */}
      <div className='flex gap-3 mb-6'>
        <div className='relative flex-1'>
          <Search className='w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2' />
          <input
            type='text'
            placeholder='Search by title or description…'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white'>
              <X className='w-4 h-4' />
            </button>
          )}
        </div>

        <div className='relative'>
          <SortAsc className='w-4 h-4 text-blue-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none' />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className='pl-9 pr-4 py-2.5 bg-slate-900 border border-blue-500/40 text-blue-400 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
          >
            <option value='newest'>Newest First</option>
            <option value='oldest'>Oldest First</option>
            <option value='budget_high'>Highest Budget</option>
            <option value='budget_low'>Lowest Budget</option>
          </select>
        </div>
      </div>

      {/* ── Active filter chips ── */}
      {activeFilterCount > 0 && (
        <div className='flex flex-wrap gap-2 mb-5'>
          {selectedCategory !== 'all' && (
            <span className='flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full'>
              {categories.find(c => c.value === selectedCategory)?.label}
              <button onClick={() => setSelectedCategory('all')}><X className='w-3 h-3' /></button>
            </span>
          )}
          {budgetRanges.map(v => (
            <span key={v} className='flex items-center gap-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full'>
              {budgetOptions.find(o => o.value === v)?.label}
              <button onClick={() => handleBudgetToggle(v)}><X className='w-3 h-3' /></button>
            </span>
          ))}
          {deadlineRanges.map(v => (
            <span key={v} className='flex items-center gap-1.5 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full'>
              {deadlineOptions.find(o => o.value === v)?.label}
              <button onClick={() => handleDeadlineToggle(v)}><X className='w-3 h-3' /></button>
            </span>
          ))}
          {selectedSkills.map(s => (
            <span key={s} className='flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full'>
              {s}
              <button onClick={() => handleSkillToggle(s)}><X className='w-3 h-3' /></button>
            </span>
          ))}
          <button onClick={clearAll} className='text-xs text-slate-500 hover:text-white transition-colors px-2'>
            Clear all
          </button>
        </div>
      )}

      <div className='flex gap-5'>

        {/* ── Sidebar filters ── */}
        <aside className='w-56 shrink-0'>
          <div className='bg-slate-900 border border-slate-800 rounded-2xl p-5 sticky top-6'>
            <div className='flex items-center justify-between mb-5'>
              <div className='flex items-center gap-2'>
                <SlidersHorizontal className='w-4 h-4 text-blue-400' />
                <h4 className='text-sm font-semibold text-white'>Filters</h4>
              </div>
              {activeFilterCount > 0 && (
                <span className='text-xs bg-blue-600 text-white font-semibold px-1.5 py-0.5 rounded-full'>
                  {activeFilterCount}
                </span>
              )}
            </div>

            <div className='space-y-4'>

              {/* Category */}
              <FilterSection icon={Tag} title='Category' expanded={categoryExpanded} onToggle={() => setCategoryExpanded(v => !v)}>
                <div className='space-y-2'>
                  {categories.map(cat => (
                    <label key={cat.value} className='flex items-center gap-2.5 cursor-pointer group'>
                      <input
                        type='radio'
                        name='category'
                        value={cat.value}
                        checked={selectedCategory === cat.value}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className={cbClass}
                      />
                      <span className={`text-xs transition-colors ${selectedCategory === cat.value ? 'text-blue-400 font-medium' : 'text-slate-400 group-hover:text-white'}`}>
                        {cat.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Budget */}
              <FilterSection icon={DollarSign} title='Budget Range' expanded={budgetExpanded} onToggle={() => setBudgetExpanded(v => !v)}>
                <div className='space-y-2'>
                  {budgetOptions.map(opt => (
                    <label key={opt.value} className='flex items-center gap-2.5 cursor-pointer group'>
                      <input
                        type='checkbox'
                        value={opt.value}
                        checked={budgetRanges.includes(opt.value)}
                        onChange={() => handleBudgetToggle(opt.value)}
                        className={cbClass}
                      />
                      <span className={`text-xs transition-colors ${budgetRanges.includes(opt.value) ? 'text-blue-400 font-medium' : 'text-slate-400 group-hover:text-white'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Deadline */}
              <FilterSection icon={Clock} title='Deadline' expanded={deadlineExpanded} onToggle={() => setDeadlineExpanded(v => !v)}>
                <div className='space-y-2'>
                  {deadlineOptions.map(opt => (
                    <label key={opt.value} className='flex items-center gap-2.5 cursor-pointer group'>
                      <input
                        type='checkbox'
                        value={opt.value}
                        checked={deadlineRanges.includes(opt.value)}
                        onChange={() => handleDeadlineToggle(opt.value)}
                        className={cbClass}
                      />
                      <span className={`text-xs transition-colors ${deadlineRanges.includes(opt.value) ? 'text-blue-400 font-medium' : 'text-slate-400 group-hover:text-white'}`}>
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Skills */}
              <FilterSection title='Required Skills' expanded={skillsExpanded} onToggle={() => setSkillsExpanded(v => !v)}>
                <div className='space-y-2 max-h-52 overflow-y-auto pr-1 scrollbar-thin'>
                  {allSkills.map(skill => (
                    <label key={skill} className='flex items-center gap-2.5 cursor-pointer group'>
                      <input
                        type='checkbox'
                        value={skill}
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className={cbClass}
                      />
                      <span className={`text-xs transition-colors ${selectedSkills.includes(skill) ? 'text-blue-400 font-medium' : 'text-slate-400 group-hover:text-white'}`}>
                        {skill}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

            </div>
          </div>
        </aside>

        {/* ── Project grid ── */}
        <div className='flex-1 min-w-0'>
          {/* Result count */}
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm text-slate-500'>
              <span className='text-white font-semibold'>{filteredProjects.length}</span> projects found
            </p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-24 text-center'>
              <div className='w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4'>
                <Briefcase className='w-7 h-7 text-slate-600' />
              </div>
              <h3 className='text-white font-semibold mb-2'>No projects found</h3>
              <p className='text-slate-500 text-sm mb-5'>Try adjusting your filters or search term</p>
              <button
                onClick={clearAll}
                className='text-sm text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-colors'
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BrowseProjects;