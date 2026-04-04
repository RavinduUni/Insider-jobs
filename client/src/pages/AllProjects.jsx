import React, { useState } from 'react'
import ProjectCard from '../components/ProjectCard';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Clock, DollarSign, Tag, } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import Footer from '../components/Footer';
import Navbar2 from '../components/Navbar2';

const AllProjects = () => {
    const categories = [
        { label: 'All Categories', value: 'all' },
        { label: 'Web Development', value: 'web development' },
        { label: 'Machine Learning', value: 'machine learning' },
        { label: 'UI/UX Designing', value: 'ui/ux designing' },
        { label: 'Mobile Development', value: 'mobile development' },
        { label: 'Data Analysis', value: 'data analysis' },
        { label: 'API Development', value: 'api development' }
    ];

    const budgetOptions = [
        { label: '$0 - $500', value: '0-500', min: 0, max: 500 },
        { label: '$500 - $1000', value: '500-1000', min: 500, max: 1000 },
        { label: '$1000 - $2000', value: '1000-2000', min: 1000, max: 2000 },
        { label: '$2000+', value: '2000-999999', min: 2000, max: 999999 }
    ];

    const deadlineOptions = [
        { label: 'Under 1 week', value: '1-7', min: 1, max: 7 },
        { label: '1-2 weeks', value: '8-14', min: 8, max: 14 },
        { label: '2-4 weeks', value: '15-30', min: 15, max: 30 },
        { label: '1+ month', value: '31-999', min: 31, max: 999 }
    ];

    const allSkills = [
        'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Neural Networks', 'Deep Learning',
        'Figma', 'Adobe XD', 'Sketch', 'Wireframing', 'Prototyping', 'User Research',
        'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android',
        'Python', 'Pandas', 'NumPy', 'Data Visualization', 'SQL', 'Excel',
        'REST API', 'GraphQL', 'FastAPI', 'Django', 'Flask', 'Microservices'
    ];

    const projects = [
        {
            id: 1,
            title: 'E-commerce Website with React & Node.js',
            budget: 1500,
            deadline: '3 weeks',
            category: 'Web Development',
            skills: ['React', 'Node.js', 'MongoDB', 'Express'],
            ownerRating: 4.8,
            description: 'Build a full-stack e-commerce platform with product catalog, shopping cart, payment integration, and admin dashboard.',
            postedDate: '2024-11-25'
        },
        {
            id: 2,
            title: 'Image Classification ML Model',
            budget: 2200,
            deadline: '4 weeks',
            category: 'Machine Learning',
            skills: ['TensorFlow', 'PyTorch', 'Python', 'Deep Learning'],
            ownerRating: 4.9,
            description: 'Develop a CNN-based image classification model to categorize product images with 90%+ accuracy. Dataset will be provided.',
            postedDate: '2024-11-28'
        },
        {
            id: 3,
            title: 'Mobile App UI/UX Design - Fitness Tracker',
            budget: 800,
            deadline: '2 weeks',
            category: 'UI/UX Designing',
            skills: ['Figma', 'Wireframing', 'Prototyping', 'User Research'],
            ownerRating: 4.7,
            description: 'Create a modern, intuitive UI/UX design for a fitness tracking mobile app. Include wireframes, high-fidelity mockups, and interactive prototype.',
            postedDate: '2024-11-27'
        },
        {
            id: 4,
            title: 'Cross-Platform Food Delivery App',
            budget: 2500,
            deadline: '5 weeks',
            category: 'Mobile Development',
            skills: ['React Native', 'Flutter', 'iOS', 'Android'],
            ownerRating: 4.6,
            description: 'Develop a cross-platform mobile app for food delivery with real-time tracking, payment integration, and user authentication.',
            postedDate: '2024-11-26'
        },
        {
            id: 5,
            title: 'Sales Data Analysis & Visualization',
            budget: 600,
            deadline: '10 days',
            category: 'Data Analysis',
            skills: ['Python', 'Pandas', 'SQL', 'Data Visualization'],
            ownerRating: 4.8,
            description: 'Analyze 2 years of sales data, identify trends, create interactive dashboards, and provide actionable insights for business growth.',
            postedDate: '2024-11-29'
        },
        {
            id: 6,
            title: 'RESTful API for Social Media Platform',
            budget: 1800,
            deadline: '3 weeks',
            category: 'API Development',
            skills: ['Node.js', 'Express', 'REST API', 'PostgreSQL'],
            ownerRating: 4.9,
            description: 'Build a scalable RESTful API for a social media platform with user authentication, posts, comments, and real-time notifications.',
            postedDate: '2024-11-24'
        },
        {
            id: 7,
            title: 'SaaS Dashboard with Vue.js',
            budget: 1200,
            deadline: '2 weeks',
            category: 'Web Development',
            skills: ['Vue.js', 'TypeScript', 'Tailwind'],
            ownerRating: 4.7,
            description: 'Develop a responsive SaaS dashboard with data visualization, user management, and subscription handling using Vue.js 3.',
            postedDate: '2024-11-23'
        },
        {
            id: 8,
            title: 'Sentiment Analysis NLP Model',
            budget: 1900,
            deadline: '3 weeks',
            category: 'Machine Learning',
            skills: ['Python', 'Scikit-learn', 'Neural Networks', 'NLP'],
            ownerRating: 4.8,
            description: 'Create an NLP model for sentiment analysis of customer reviews. Model should classify reviews as positive, negative, or neutral.',
            postedDate: '2024-11-22'
        },
        {
            id: 9,
            title: 'Dashboard UI Design for Analytics Platform',
            budget: 650,
            deadline: '1 week',
            category: 'UI/UX Designing',
            skills: ['Adobe XD', 'Sketch', 'Prototyping'],
            ownerRating: 4.6,
            description: 'Design a clean, professional dashboard UI for an analytics platform with charts, graphs, and data tables. Dark mode included.',
            postedDate: '2024-11-21'
        },
        {
            id: 10,
            title: 'iOS Expense Tracker App',
            budget: 1400,
            deadline: '4 weeks',
            category: 'Mobile Development',
            skills: ['Swift', 'iOS', 'CoreData'],
            ownerRating: 4.9,
            description: 'Build a native iOS app for expense tracking with categories, budgets, charts, and iCloud sync functionality.',
            postedDate: '2024-11-20'
        },
        {
            id: 11,
            title: 'Customer Behavior Analysis Dashboard',
            budget: 850,
            deadline: '2 weeks',
            category: 'Data Analysis',
            skills: ['Excel', 'SQL', 'Data Visualization', 'Python'],
            ownerRating: 4.5,
            description: 'Analyze customer behavior patterns from e-commerce data and create an interactive dashboard with key metrics and insights.',
            postedDate: '2024-11-19'
        },
        {
            id: 12,
            title: 'GraphQL API for E-learning Platform',
            budget: 2100,
            deadline: '4 weeks',
            category: 'API Development',
            skills: ['GraphQL', 'Node.js', 'MongoDB', 'Apollo'],
            ownerRating: 4.8,
            description: 'Develop a GraphQL API for an e-learning platform with courses, lessons, quizzes, and student progress tracking.',
            postedDate: '2024-11-18'
        }
    ];

    // Collapse states for filter sections
    const [categoryExpanded, setCategoryExpanded] = useState(true);
    const [budgetExpanded, setBudgetExpanded] = useState(true);
    const [deadlineExpanded, setDeadlineExpanded] = useState(true);
    const [skillsExpanded, setSkillsExpanded] = useState(true);

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [budgetRanges, setBudgetRanges] = useState([]);
    const [deadlineRanges, setDeadlineRanges] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const handleBudgetToggle = (value) => {
        setBudgetRanges(prev => (
            prev.includes(value) ? prev.filter(b => b != value) : [...prev, value]
        ));
    };

    const handleDeadlineToggle = (value) => {
        setDeadlineRanges(prev => (
            prev.includes(value) ? prev.filter(b => b !== value) : [...prev, value]
        ))
    };

    const handleSelectedSkills = (value) => {
        setSelectedSkills(prev => (
            prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
        ));
    };

    const convertDeadlineToDays = (deadlineString) => {
        if (!deadlineString) return null;

        const [num, unit] = deadlineString.toLowerCase().split(" ");

        const value = Number(num);

        if (unit.startsWith('week')) {
            return value * 7;
        }

        if (unit.startsWith('day')) {
            return value;
        }

        return null;
    }

    const filteredProjects = projects.filter(project => {
        if (selectedCategory.toLowerCase() !== 'all' && project.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
        }

        if (budgetRanges.length > 0) {
            const projectBudget = project.budget;
            const inBudget = budgetRanges.some(range => {
                const [min, max] = range.split("-").map(Number);
                return projectBudget >= min && projectBudget <= max;
            });

            if (!inBudget) {
                return false;
            }
        }

        if (deadlineRanges.length > 0) {
            const projectDeadline = convertDeadlineToDays(project.deadline);
            const withinDeadline = deadlineRanges.some(range => {
                const [min, max] = range.split("-").map(Number);
                return projectDeadline >= min && projectDeadline <= max;
            })

            if (!withinDeadline) {
                return false;
            }
        }

        if (selectedSkills.length > 0) {
            const hasSkill = selectedSkills.some(skill => (
                project.skills.includes(skill)
            ));

            if (!hasSkill) {
                return false;
            }
        }


        return true;
    });

    const ITEMS_PER_PAGE = 8;

    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
        <>
            <Navbar2 />
            <HeroBanner />
            <div className="container mx-auto px-20 py-8 bg-background">
                <div className='grid grid-cols-4 gap-5'>
                    <div className='col-span-1 bg-white shadow-lg rounded-2xl p-4'>
                        <h2 className='text-xl font-semibold'>Filter Projects</h2>

                        <hr className='border-border mt-2' />

                        <div className='space-y-6 mt-8'>
                            <div className='border-border border-b pb-4'>
                                <button className='flex items-center justify-between w-full mb-3 text-secondary hover:text-primary transition-colors cursor-pointer'
                                    onClick={() => setCategoryExpanded(!categoryExpanded)}
                                >
                                    <span className='flex items-center gap-2 font-semibold'>
                                        <Tag className='w-4 h-4' />
                                        Category
                                    </span>
                                    {categoryExpanded ? <ChevronDown className='w-4 h-4' /> : <ChevronUp className='w-4 h-4' />}
                                </button>
                                {categoryExpanded && (
                                    <div className='space-y-2'>
                                        {categories.map((category) => (
                                            <label key={category.value} className='flex items-center gap-3'>
                                                <input
                                                    type="radio"
                                                    name='category'
                                                    value={category.value}
                                                    checked={selectedCategory == category.value}
                                                    className='w-4 h-4 text-primary border-border focus:ring-primary cursor-pointer'
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                />
                                                <span className='text-text-secondary text-sm'>{category.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='space-y-6 mt-8'>
                            <div className='border-border border-b pb-4'>
                                <button className='flex items-center justify-between w-full mb-3 text-secondary hover:text-primary transition-colors cursor-pointer'
                                    onClick={() => setBudgetExpanded(!budgetExpanded)}
                                >
                                    <span className='flex items-center gap-2 font-semibold'>
                                        <DollarSign className='w-4 h-4' />
                                        Budget Range
                                    </span>
                                    {budgetExpanded ? <ChevronDown className='w-4 h-4' /> : <ChevronUp className='w-4 h-4' />}
                                </button>
                                {budgetExpanded && (
                                    <div className='space-y-2'>
                                        {budgetOptions.map((option) => (
                                            <label key={option.value} className='flex items-center gap-3'>
                                                <input
                                                    type="checkbox"
                                                    value={option.value}
                                                    checked={budgetRanges.includes(option.value)}
                                                    onChange={() => handleBudgetToggle(option.value)}
                                                    className='w-4 h-4 text-primary border-border focus:ring-primary cursor-pointer'
                                                />
                                                <span className='text-text-secondary text-sm'>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='space-y-6 mt-8'>
                            <div className='border-border border-b pb-4'>
                                <button className='flex items-center justify-between w-full mb-3 text-secondary hover:text-primary transition-colors cursor-pointer'
                                    onClick={() => setDeadlineExpanded(!deadlineExpanded)}
                                >
                                    <span className='flex items-center gap-2 font-semibold'>
                                        <Clock className='w-4 h-4' />
                                        Deadline
                                    </span>
                                    {deadlineExpanded ? <ChevronDown className='w-4 h-4' /> : <ChevronUp className='w-4 h-4' />}
                                </button>
                                {deadlineExpanded && (
                                    <div className='space-y-2'>
                                        {deadlineOptions.map((option) => (
                                            <label key={option.value} className='flex items-center gap-3'>
                                                <input
                                                    type="checkbox"
                                                    value={option.value}
                                                    checked={deadlineRanges.includes(option.value)}
                                                    onChange={() => handleDeadlineToggle(option.value)}
                                                    className='w-4 h-4 text-primary border-border focus:ring-primary cursor-pointer'
                                                />
                                                <span className='text-text-secondary text-sm'>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='space-y-6 mt-8'>
                            <div className='border-border pb-4'>
                                <button className='flex items-center justify-between w-full mb-3 text-secondary hover:text-primary transition-colors cursor-pointer'
                                    onClick={() => setDeadlineExpanded(!deadlineExpanded)}
                                >
                                    <span className='flex items-center gap-2 font-semibold'>
                                        Required Skills
                                    </span>
                                    {skillsExpanded ? <ChevronDown className='w-4 h-4' /> : <ChevronUp className='w-4 h-4' />}
                                </button>
                                {skillsExpanded && (
                                    <div className='space-y-2 max-h-80 overflow-scroll'>
                                        {allSkills.map((skill) => (
                                            <label key={skill} className='flex items-center gap-3'>
                                                <input
                                                    type="checkbox"
                                                    value={skill}
                                                    checked={selectedSkills.includes(skill)}
                                                    onChange={() => handleSelectedSkills(skill)}
                                                    className='w-4 h-4 text-primary border-border focus:ring-primary cursor-pointer'
                                                />
                                                <span className='text-text-secondary text-sm'>{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='col-span-3'>
                        <div className='grid grid-cols-2 gap-4'>
                            {currentProjects.map((project) => (
                                <ProjectCard project={project} />
                            ))}
                        </div>
                    </div>
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

            <Footer />
        </>
    )
}

export default AllProjects