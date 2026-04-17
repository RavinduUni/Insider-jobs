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

        return res.status(200).json({ success: true, projects });

    } catch (error) {
        console.error('Error fetching project by ID:', error);
        return res.status(500).json({ success: false, message: 'Server error while fetching project' });
    }
}