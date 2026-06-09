import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import Template from '../models/Template.js';

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  try {
    let { templateId, formData, title, experienceType } = req.body;
    const userId = req.user._id;

    console.log('Creating resume with template ID:', templateId);

    // Find template by _id (MongoDB ObjectId)
    let template = null;
    
    // Check if templateId is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(templateId)) {
      template = await Template.findById(templateId);
    }
    
    // If not found by _id, try by slug (for backward compatibility)
    if (!template) {
      template = await Template.findOne({ slug: templateId });
    }
    
    if (!template) {
      return res.status(404).json({ 
        success: false,
        message: `Template with ID/slug "${templateId}" not found.`
      });
    }

    console.log('Template found:', template.name, 'ID:', template._id);

    // Check if user has access to premium template
    if (template.type === 'premium' && !req.user.isPremium && !req.user.purchasedTemplates?.includes(template._id)) {
      return res.status(403).json({ 
        success: false,
        message: 'Please purchase this template first' 
      });
    }

    // Process personal info from formData
    const personalInfo = {
      fullName: formData?.fullName || '',
      email: formData?.email || '',
      phone: formData?.phone || '',
      address: formData?.address || '',
      linkedin: formData?.linkedin || '',
      portfolio: formData?.portfolio || '',
      profileSummary: formData?.summary || ''
    };

    // Process education
    const education = (formData?.education || []).map(edu => ({
      institution: edu.institution || '',
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.year || edu.startDate || '',
      endDate: edu.endDate || '',
      current: edu.current || false,
      grade: edu.percentage || edu.grade || '',
      description: edu.description || ''
    }));

    // Process experience
    const experience = (formData?.experience || []).map(exp => ({
      company: exp.company || '',
      position: exp.position || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || '',
      achievements: exp.achievements || []
    }));

    // Process skills
    let skills = [];
    if (formData?.skills) {
      if (typeof formData.skills === 'string') {
        skills = formData.skills.split(',').map(s => ({ 
          name: s.trim(), 
          level: 'Intermediate',
          category: 'Technical'
        }));
      } else if (Array.isArray(formData.skills)) {
        skills = formData.skills.map(s => ({
          name: typeof s === 'string' ? s : s.name || '',
          level: s.level || 'Intermediate',
          category: s.category || 'Technical'
        }));
      }
    }

    // Process projects
    const projects = (formData?.projects || []).map(proj => ({
      name: proj.name || '',
      description: proj.description || '',
      technologies: proj.technologies ? (typeof proj.technologies === 'string' ? proj.technologies.split(',') : proj.technologies) : [],
      link: proj.link || '',
      startDate: proj.startDate || '',
      endDate: proj.endDate || ''
    }));

    // Process certifications
    const certifications = (formData?.certifications || []).map(cert => ({
      name: cert.name || '',
      issuer: cert.issuer || '',
      date: cert.year || cert.date || '',
      credentialId: cert.credentialId || '',
      link: cert.link || ''
    }));

    // Process languages
    const languages = (formData?.languages || []).map(lang => ({
      name: lang.name || '',
      proficiency: lang.proficiency || 'Intermediate'
    }));

    // Create resume with ObjectId reference
    const resumeData = {
      userId: userId,
      title: title || `${personalInfo.fullName || 'Untitled'}'s Resume`,
      templateId: template._id,  // Store the ObjectId
      templateSlug: template.slug,
      templateName: template.name,
      isPremiumTemplate: template.type === 'premium',
      experienceType: experienceType || 'fresher',
      personalInfo: personalInfo,
      education: education,
      experience: experience,
      skills: skills,
      projects: projects,
      certifications: certifications,
      languages: languages,
      summary: formData?.summary || ''
    };

    const resume = new Resume(resumeData);
    const savedResume = await resume.save();

    console.log('Resume created successfully:', savedResume._id);

    res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      data: savedResume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create resume', 
      error: error.message 
    });
  }
};

// @desc    Get all resumes of a user
// @route   GET /api/resumes
// @access  Private
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .populate('templateId', 'name slug type thumbnail')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('templateId', 'name slug type thumbnail styles structure');

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found' 
      });
    }

    const { experienceType, title, formData, templateId } = req.body;

    console.log('Updating resume with data:', { experienceType, title, templateId });

    // Update basic fields
    if (title) resume.title = title;
    if (experienceType) resume.experienceType = experienceType;
    
    // Update formData fields - Create personalInfo object exactly like createResume
    if (formData) {
      // Create personalInfo object (same structure as createResume)
      resume.personalInfo = {
        fullName: formData.fullName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        linkedin: formData.linkedin || '',
        portfolio: formData.portfolio || '',
        profileSummary: formData.summary || ''
      };
      
      // Update education (same as createResume)
      if (formData.education && Array.isArray(formData.education)) {
        resume.education = formData.education.map(edu => ({
          institution: edu.institution || '',
          degree: edu.degree || '',
          fieldOfStudy: edu.fieldOfStudy || '',
          startDate: edu.year || edu.startDate || '',
          endDate: edu.endDate || '',
          current: edu.current || false,
          grade: edu.percentage || edu.grade || '',
          description: edu.description || ''
        }));
      }
      
      // Update experience (same as createResume)
      if (formData.experience && Array.isArray(formData.experience)) {
        resume.experience = formData.experience.map(exp => ({
          company: exp.company || '',
          position: exp.position || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: exp.current || false,
          description: exp.description || '',
          achievements: exp.achievements || []
        }));
      }
      
      // Update skills (same as createResume)
      if (formData.skills) {
        if (typeof formData.skills === 'string') {
          resume.skills = formData.skills.split(',').map(s => ({ 
            name: s.trim(), 
            level: 'Intermediate',
            category: 'Technical'
          }));
        } else if (Array.isArray(formData.skills)) {
          resume.skills = formData.skills.map(s => ({
            name: typeof s === 'string' ? s : s.name || '',
            level: s.level || 'Intermediate',
            category: s.category || 'Technical'
          }));
        }
      }
      
      // Update projects (same as createResume)
      if (formData.projects && Array.isArray(formData.projects)) {
        resume.projects = formData.projects.map(proj => ({
          name: proj.name || '',
          description: proj.description || '',
          technologies: proj.technologies ? (typeof proj.technologies === 'string' ? proj.technologies.split(',') : proj.technologies) : [],
          link: proj.link || '',
          startDate: proj.startDate || '',
          endDate: proj.endDate || ''
        }));
      }
      
      // Update certifications (same as createResume)
      if (formData.certifications && Array.isArray(formData.certifications)) {
        resume.certifications = formData.certifications.map(cert => ({
          name: cert.name || '',
          issuer: cert.issuer || '',
          date: cert.year || cert.date || '',
          credentialId: cert.credentialId || '',
          link: cert.link || ''
        }));
      }
      
      // Update languages (same as createResume)
      if (formData.languages && Array.isArray(formData.languages)) {
        resume.languages = formData.languages.map(lang => ({
          name: lang.name || '',
          proficiency: lang.proficiency || 'Intermediate'
        }));
      }
      
      // Update summary (same as createResume)
      if (formData.summary !== undefined) {
        resume.summary = formData.summary;
      }
    }
    
    // Handle template update
    if (templateId) {
      let template = null;
      
      // First try to find by ObjectId
      if (mongoose.Types.ObjectId.isValid(templateId)) {
        template = await Template.findById(templateId);
      }
      
      // If not found, try by slug
      if (!template) {
        template = await Template.findOne({ slug: templateId });
      }
      
      if (template) {
        resume.templateId = template._id;
        resume.templateSlug = template.slug;
        resume.templateName = template.name;
        resume.isPremiumTemplate = template.type === 'premium';
        console.log('Template updated to:', template.name);
      }
    }
    
    resume.updatedAt = Date.now();
    const updatedResume = await resume.save();

    console.log('Resume updated successfully:', updatedResume._id);

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: updatedResume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: 'Resume not found' 
      });
    }

    await resume.deleteOne();
    
    res.status(200).json({ 
      success: true,
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};