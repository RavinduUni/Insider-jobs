import Application from "../models/Application.js";
import Project from "../models/Project.js"

export const getAllProjects = async (req, res) => {
    try {

        const projects = await Project.find().populate('recruiter', 'name companyName');
        
        return res.status(200).json({ success: true, projects });
        
    } catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching projects' });
    }
}

export const getProjectsByRecruiterId = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        
        const projects = await Project.find({ recruiter: recruiterId }).populate('recruiter', 'name companyName');

        if (!projects.length) {
            return res.status(404).json({ success: false, message: 'Projects not found' });
        }

        const applicationsCount = await Promise.all(projects.map(async (project) => {
            const count = await Application.countDocuments({ projectId: project._id });
            return { projectId: project._id, count };
        }));

        const projectsWithCounts = projects.map(project => {
            const countObj = applicationsCount.find(c => c.projectId.toString() === project._id.toString());
            return { ...project._doc, applicationsCount: countObj ? countObj.count : 0 };
        });

        return res.status(200).json({ success: true, projects: projectsWithCounts });

    } catch (error) {
        console.error('Error fetching project by ID:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching project' });
    }
}

export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
        console.log('Fetching project with ID:', projectId); // Debug log
        const project = await Project.findById(projectId).populate('recruiter', 'name companyName');

        if (!project) {
            return res.status(404).json({ success: false, message: 'Projects not found' });
        }
        return res.status(200).json({ success: true, project });

    } catch (error) {
        console.error('Error fetching project by ID:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching project' });
    }
}