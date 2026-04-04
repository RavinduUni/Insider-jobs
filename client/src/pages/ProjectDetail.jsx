import { ArrowLeft, Briefcase, CheckCircle, Clock, DollarSign, MapPin } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import ApplyModal from '../components/ApplyModel';
import ApplyModel from '../components/ApplyModel';
import Navbar2 from '../components/Navbar2';

const ProjectDetail = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const projectData = [
        {
            id: 1,
            title: 'E-commerce Website Development',
            description: 'We need a modern, responsive e-commerce website built with React and Node.js. The platform should include product catalog, shopping cart, payment integration, and admin dashboard. Clean code and documentation required.',
            budget: 850,
            deadline: '2 weeks',
            category: 'Web Development',
            skills: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            ownerName: 'Sarah Smith',
            ownerCompany: 'TechStartup Inc.',
            ownerRating: 4.8,
            projectsCompleted: 15,
            location: 'Remote',
            applicants: 12,
            postedDate: '3 days ago',
            requirements: [
                'Strong experience with React and modern JavaScript',
                'Backend development with Node.js and Express',
                'Database design and MongoDB experience',
                'Payment gateway integration experience',
                'Good communication skills'
            ],
            deliverables: [
                'Fully functional e-commerce website',
                'Admin panel for product management',
                'Payment integration with Stripe',
                'Responsive design for all devices',
                'Source code and documentation'
            ]
        },
        {
            id: 2,
            title: 'Mobile App UI/UX Design',
            description: 'Looking for a talented UI/UX designer to create modern, user-friendly designs for a fitness tracking mobile app. Need complete wireframes, mockups, and interactive prototypes.',
            budget: 600,
            deadline: '10 days',
            category: 'UI/UX Design',
            skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Research'],
            ownerName: 'Mike Johnson',
            ownerCompany: 'FitLife Apps',
            ownerRating: 4.9,
            projectsCompleted: 23,
            location: 'Remote',
            applicants: 8,
            postedDate: '1 day ago',
            requirements: [
                'Portfolio showcasing mobile app designs',
                'Proficiency in Figma or Adobe XD',
                'Understanding of mobile UI/UX best practices',
                'Experience with design systems',
                'Ability to create interactive prototypes'
            ],
            deliverables: [
                'Complete wireframes for all screens',
                'High-fidelity mockups',
                'Interactive prototype',
                'Design system documentation',
                'All design files (Figma/XD)'
            ]
        },
        {
            id: 3,
            title: 'Machine Learning Model for Price Prediction',
            description: 'Develop a machine learning model to predict real estate prices based on various features. Need data preprocessing, model training, and deployment with API endpoint.',
            budget: 950,
            deadline: '3 weeks',
            category: 'Machine Learning',
            skills: ['Python', 'TensorFlow', 'scikit-learn', 'Data Analysis'],
            ownerName: 'Emma Davis',
            ownerCompany: 'RealEstate Analytics',
            ownerRating: 4.7,
            projectsCompleted: 18,
            location: 'Remote',
            applicants: 15,
            postedDate: '5 days ago',
            requirements: [
                'Strong Python programming skills',
                'Experience with ML frameworks (TensorFlow/PyTorch)',
                'Data preprocessing and feature engineering',
                'Model evaluation and optimization',
                'API development with Flask or FastAPI'
            ],
            deliverables: [
                'Cleaned and preprocessed dataset',
                'Trained ML model with evaluation metrics',
                'API endpoint for predictions',
                'Model documentation and code',
                'Jupyter notebooks with analysis'
            ]
        }
    ];

    const project = projectData.find(item => item.id === Number(id));

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Navbar2 />
            <div className='container px-20 mx-auto py-10 bg-background min-h-screen'>
                <h3 onClick={() => navigate('/')} className='flex items-center gap-2 text-text-secondary cursor-pointer mb-8'>
                    <ArrowLeft className='w-5 h-5' />
                    Back to projects
                </h3>

                <div className='grid grid-cols-3 gap-5'>
                    {project ? (
                        <>
                            <div className='col-span-2 bg-white p-8 shadow-lg rounded-2xl'>
                                <h3 className='text-primary text-sm bg-blue-50 py-1 px-3 rounded-4xl inline-block'>{project.category}</h3>
                                <h1 className='text-4xl font-bold my-5'>{project.title}</h1>

                                <div className='flex gap-4 items-center'>
                                    <div className='flex items-center gap-2'>
                                        <DollarSign className='w-4 h-4 text-accent' />
                                        <span className='text-accent text-sm'>${project.budget}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Clock className='w-4 h-4 text-text-secondary' />
                                        <span className='text-text-secondary text-sm'>{project.deadline}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <MapPin className='w-4 h-4 text-text-secondary' />
                                        <span className='text-text-secondary text-sm'>{project.location}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Briefcase className='w-4 h-4 text-text-secondary' />
                                        <span className='text-text-secondary text-sm'>{project.applicants} applicants</span>
                                    </div>
                                </div>

                                <h3 className='font-semibold text-2xl mb-3 mt-7'>Project Description</h3>
                                <p className='text-text-secondary'>{project.description}</p>

                                <h3 className='font-semibold text-2xl mb-3 mt-7'>Required Skills</h3>
                                <div className='flex gap-2'>
                                    {project.skills.map((skill, index) => (
                                        <span key={index} className='text-primary text-sm bg-blue-50 py-1 px-3 rounded-4xl inline-block'>{skill}</span>
                                    ))}
                                </div>

                                <h3 className='font-semibold text-2xl mb-3 mt-7'>Requirements</h3>
                                <ul className='space-y-2'>
                                    {project.requirements.map((req, index) => (
                                        <li key={index} className='flex items-start gap-2 text-text-secondary'>
                                            <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>

                                <h3 className='font-semibold text-2xl mb-3 mt-7'>Deliverables</h3>
                                <ul className='space-y-2'>
                                    {project.requirements.map((deliverable, index) => (
                                        <li key={index} className='flex items-start gap-2 text-text-secondary'>
                                            <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <span>{deliverable}</span>
                                        </li>
                                    ))}
                                </ul>

                            </div>

                            <div className='col-span-1 '>
                                <div className='sticky top-34 bg-white rounded-2xl shadow p-8'>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className='bg-primary text-white py-4 w-full rounded-xl'>
                                        Apply for this Project
                                    </button>

                                    <h3 className='text-xl font-semibold my-5'>Project Owner</h3>
                                    <div className='flex items-start gap-3 mb-4'>
                                        <div className='w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shrink-0'>
                                            {project.ownerName.charAt(0)}
                                        </div>
                                        <div>
                                            <h5 className='font-semibold'>{project.ownerName}</h5>
                                            <p className='text-text-secondary text-sm'>{project.ownerCompany}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <span className='text-text-secondary text-sm'>Projects Posted</span>
                                        <span className='text-text-secondary text-sm'>{project.projectsCompleted}</span>
                                    </div>

                                    <div className='flex justify-center'>
                                        <hr className='border-gray-200 my-6 w-full' />
                                    </div>

                                    <h3 className='text-xl font-semibold'>Project Details</h3>
                                    <div className='flex flex-col gap-4 mt-3'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-text-secondary text-sm'>Posted</span>
                                            <span className='text-text-secondary text-sm'>{project.postedDate}</span>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <span className='text-text-secondary text-sm'>Budget</span>
                                            <span className='text-accent text-sm'>${project.budget}</span>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <span className='text-text-secondary text-sm'>Deadline</span>
                                            <span className='text-text-secondary text-sm'>{project.deadline}</span>
                                        </div>

                                        <div className='flex items-center justify-between'>
                                            <span className='text-text-secondary text-sm'>Applicants</span>
                                            <span className='text-text-secondary text-sm'>{project.applicants}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </>
                    ) : (
                        <p>No projects found</p>
                    )}
                </div>
            </div>
            <ApplyModel
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projecTitle={project.title}
            />
        </>
    )
}

export default ProjectDetail
