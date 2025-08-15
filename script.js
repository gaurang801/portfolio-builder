// Application State
let isLoggedIn = false;
let currentUser = null;

// Landing Page Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function showSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.classList.add('active');
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

function switchToSignup() {
    closeModal('loginModal');
    setTimeout(() => showSignupModal(), 150);
}

function switchToLogin() {
    closeModal('signupModal');
    setTimeout(() => showLoginModal(), 150);
}

function loginWith(provider) {
    // Simulate social login - in real app, implement OAuth
    simulateLogin(provider);
}

function signupWith(provider) {
    // Simulate social signup - in real app, implement OAuth
    simulateLogin(provider);
}

function simulateLogin(provider) {
    // Show loading state
    const modal = document.querySelector('.modal.active');
    const button = modal.querySelector(`.${provider}-btn`);
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
    button.disabled = true;
    
    setTimeout(() => {
        isLoggedIn = true;
        currentUser = {
            name: 'Demo User',
            email: 'demo@example.com',
            provider: provider
        };
        
        // Hide landing page, show app
        document.getElementById('landing-page').style.display = 'none';
        document.getElementById('portfolio-app').style.display = 'block';
        
        // Update user info
        document.getElementById('userName').textContent = currentUser.name;
        
        // Close modal
        closeModal(modal.id);
        
        // Initialize portfolio builder
        if (typeof portfolioBuilder === 'undefined') {
            window.portfolioBuilder = new PortfolioBuilder();
        }
        
        showNotification(`Welcome ${currentUser.name}! Logged in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
    }, 2000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleMobileMenu() {
    // Mobile menu functionality
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add click handlers for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Handle auth form submissions
    const authForms = document.querySelectorAll('.auth-form');
    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Simulate form login/signup
            simulateLogin('email');
        });
    });
    
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
});

// Show notification function
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 3000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Portfolio Builder Application
class PortfolioBuilder {
    constructor() {
        this.portfolioData = {
            personal: {},
            experience: [],
            projects: [],
            skills: [],
            education: []
        };
        this.currentTemplate = 'modern';
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.updatePreview();
    }

    // Event Listeners
    bindEvents() {
        // Navigation
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.closest('.nav-btn').dataset.tab);
            });
        });

        // Category switching
        const categories = document.querySelectorAll('.category');
        categories.forEach(category => {
            category.addEventListener('click', (e) => {
                this.switchCategory(e.target.closest('.category').dataset.category);
            });
        });

        // Form auto-save
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.autoSave();
            });
        });

        // Current job checkbox
        const currentJobCheckbox = document.getElementById('currentJob');
        if (currentJobCheckbox) {
            currentJobCheckbox.addEventListener('change', (e) => {
                const endDateInput = document.getElementById('endDate');
                if (e.target.checked) {
                    endDateInput.disabled = true;
                    endDateInput.value = '';
                } else {
                    endDateInput.disabled = false;
                }
            });
        }
    }

    // Tab Management
    switchTab(tabName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show/hide content
        document.querySelectorAll('.tab-content, .welcome-section').forEach(content => {
            content.classList.remove('active');
        });
        
        if (tabName === 'welcome') {
            document.getElementById('welcome').classList.add('active');
        } else {
            document.getElementById(tabName).classList.add('active');
        }

        // Update preview when switching to preview tab
        if (tabName === 'preview') {
            this.updatePreview();
        }
    }

    switchCategory(categoryName) {
        // Update category buttons
        document.querySelectorAll('.category').forEach(cat => {
            cat.classList.remove('active');
        });
        document.querySelector(`[data-category="${categoryName}"]`).classList.add('active');

        // Show/hide forms
        document.querySelectorAll('.section-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${categoryName}-form`).classList.add('active');
    }

    // Data Management
    savePersonalInfo() {
        const form = document.getElementById('personal-form');
        const formData = new FormData(form);
        
        this.portfolioData.personal = {
            fullName: formData.get('fullName') || '',
            title: formData.get('title') || '',
            email: formData.get('email') || '',
            phone: formData.get('phone') || '',
            location: formData.get('location') || '',
            bio: formData.get('bio') || '',
            linkedin: formData.get('linkedin') || '',
            github: formData.get('github') || ''
        };

        this.saveToStorage();
        this.updateSections();
        this.showNotification('Personal information saved!');
    }

    addExperience() {
        const form = document.getElementById('experience-form');
        const formData = new FormData(form);
        
        const experience = {
            id: Date.now(),
            jobTitle: formData.get('jobTitle') || '',
            company: formData.get('company') || '',
            startDate: formData.get('startDate') || '',
            endDate: formData.get('currentJob') ? 'Present' : (formData.get('endDate') || ''),
            description: formData.get('jobDescription') || '',
            current: formData.get('currentJob') === 'on'
        };

        if (experience.jobTitle && experience.company) {
            this.portfolioData.experience.push(experience);
            this.saveToStorage();
            this.updateSections();
            form.reset();
            this.showNotification('Experience added!');
        } else {
            this.showNotification('Please fill in required fields', 'error');
        }
    }

    addProject() {
        const form = document.getElementById('projects-form');
        const formData = new FormData(form);
        
        const project = {
            id: Date.now(),
            name: formData.get('projectName') || '',
            description: formData.get('projectDescription') || '',
            technologies: formData.get('technologies') || '',
            url: formData.get('projectUrl') || '',
            repository: formData.get('repositoryUrl') || ''
        };

        if (project.name && project.description) {
            this.portfolioData.projects.push(project);
            this.saveToStorage();
            this.updateSections();
            form.reset();
            this.showNotification('Project added!');
        } else {
            this.showNotification('Please fill in required fields', 'error');
        }
    }

    addSkill() {
        const form = document.getElementById('skills-form');
        const formData = new FormData(form);
        
        const skill = {
            id: Date.now(),
            name: formData.get('skillName') || '',
            level: formData.get('skillLevel') || 'beginner'
        };

        if (skill.name) {
            this.portfolioData.skills.push(skill);
            this.saveToStorage();
            this.updateSections();
            form.reset();
            this.showNotification('Skill added!');
        } else {
            this.showNotification('Please enter a skill name', 'error');
        }
    }

    addEducation() {
        const form = document.getElementById('education-form');
        const formData = new FormData(form);
        
        const education = {
            id: Date.now(),
            degree: formData.get('degree') || '',
            field: formData.get('field') || '',
            school: formData.get('school') || '',
            year: formData.get('graduationYear') || '',
            gpa: formData.get('gpa') || ''
        };

        if (education.degree && education.school) {
            this.portfolioData.education.push(education);
            this.saveToStorage();
            this.updateSections();
            form.reset();
            this.showNotification('Education added!');
        } else {
            this.showNotification('Please fill in required fields', 'error');
        }
    }

    removeSection(type, id) {
        this.portfolioData[type] = this.portfolioData[type].filter(item => item.id !== parseInt(id));
        this.saveToStorage();
        this.updateSections();
        this.showNotification('Item removed!');
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            this.portfolioData = {
                personal: {},
                experience: [],
                projects: [],
                skills: [],
                education: []
            };
            this.saveToStorage();
            this.updateSections();
            this.clearForms();
            this.showNotification('All data cleared!');
        }
    }

    clearForms() {
        document.querySelectorAll('form').forEach(form => form.reset());
    }

    // UI Updates
    updateSections() {
        const container = document.getElementById('portfolioSections');
        const sections = [];

        // Personal Info
        if (Object.keys(this.portfolioData.personal).length > 0 && this.portfolioData.personal.fullName) {
            sections.push(this.createPersonalSection(this.portfolioData.personal));
        }

        // Experience
        this.portfolioData.experience.forEach(exp => {
            sections.push(this.createExperienceSection(exp));
        });

        // Projects
        this.portfolioData.projects.forEach(project => {
            sections.push(this.createProjectSection(project));
        });

        // Skills
        if (this.portfolioData.skills.length > 0) {
            sections.push(this.createSkillsSection(this.portfolioData.skills));
        }

        // Education
        this.portfolioData.education.forEach(edu => {
            sections.push(this.createEducationSection(edu));
        });

        if (sections.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-plus-circle"></i>
                    <h4>Start building your portfolio</h4>
                    <p>Add sections from the sidebar to build your professional portfolio</p>
                </div>
            `;
        } else {
            container.innerHTML = sections.join('');
        }
    }

    createPersonalSection(personal) {
        return `
            <div class="portfolio-section fade-in">
                <div class="section-actions">
                    <button onclick="portfolioBuilder.clearPersonal()" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4><i class="fas fa-user"></i> Personal Information</h4>
                <div class="personal-info">
                    <p><strong>${personal.fullName}</strong></p>
                    <p>${personal.title}</p>
                    ${personal.email ? `<p><i class="fas fa-envelope"></i> ${personal.email}</p>` : ''}
                    ${personal.phone ? `<p><i class="fas fa-phone"></i> ${personal.phone}</p>` : ''}
                    ${personal.location ? `<p><i class="fas fa-map-marker-alt"></i> ${personal.location}</p>` : ''}
                    ${personal.bio ? `<p style="margin-top: 1rem;">${personal.bio}</p>` : ''}
                </div>
            </div>
        `;
    }

    createExperienceSection(exp) {
        const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
        const endDate = exp.endDate === 'Present' ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
        
        return `
            <div class="portfolio-section fade-in">
                <div class="section-actions">
                    <button onclick="portfolioBuilder.removeSection('experience', ${exp.id})" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4><i class="fas fa-briefcase"></i> ${exp.jobTitle}</h4>
                <div class="experience-info">
                    <p><strong>${exp.company}</strong></p>
                    ${startDate || endDate ? `<p><i class="fas fa-calendar"></i> ${startDate} - ${endDate}</p>` : ''}
                    ${exp.description ? `<p style="margin-top: 1rem;">${exp.description}</p>` : ''}
                </div>
            </div>
        `;
    }

    createProjectSection(project) {
        return `
            <div class="portfolio-section fade-in">
                <div class="section-actions">
                    <button onclick="portfolioBuilder.removeSection('projects', ${project.id})" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4><i class="fas fa-code"></i> ${project.name}</h4>
                <div class="project-info">
                    <p>${project.description}</p>
                    ${project.technologies ? `<p><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                    <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                        ${project.url ? `<a href="${project.url}" target="_blank" style="color: #2b6cb0; text-decoration: none;"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                        ${project.repository ? `<a href="${project.repository}" target="_blank" style="color: #2b6cb0; text-decoration: none;"><i class="fab fa-github"></i> Repository</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    createSkillsSection(skills) {
        const skillsHTML = skills.map(skill => `
            <span class="skill-tag" data-level="${skill.level}">
                ${skill.name}
                <button onclick="portfolioBuilder.removeSection('skills', ${skill.id})" class="remove-skill">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `).join('');

        return `
            <div class="portfolio-section fade-in">
                <h4><i class="fas fa-cogs"></i> Skills</h4>
                <div class="skills-container">
                    ${skillsHTML}
                </div>
                <style>
                    .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
                    .skill-tag { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #eff6ff; color: #2b6cb0; border-radius: 20px; font-size: 0.875rem; font-weight: 500; }
                    .skill-tag[data-level="expert"] { background: #dcfce7; color: #166534; }
                    .skill-tag[data-level="advanced"] { background: #fef3c7; color: #92400e; }
                    .skill-tag[data-level="intermediate"] { background: #dbeafe; color: #1e40af; }
                    .remove-skill { background: none; border: none; color: inherit; cursor: pointer; opacity: 0.7; }
                    .remove-skill:hover { opacity: 1; }
                </style>
            </div>
        `;
    }

    createEducationSection(edu) {
        return `
            <div class="portfolio-section fade-in">
                <div class="section-actions">
                    <button onclick="portfolioBuilder.removeSection('education', ${edu.id})" title="Remove">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <h4><i class="fas fa-graduation-cap"></i> ${edu.degree}</h4>
                <div class="education-info">
                    <p><strong>${edu.school}</strong></p>
                    ${edu.field ? `<p>${edu.field}</p>` : ''}
                    <div style="display: flex; gap: 2rem; margin-top: 0.5rem;">
                        ${edu.year ? `<p><i class="fas fa-calendar"></i> ${edu.year}</p>` : ''}
                        ${edu.gpa ? `<p><i class="fas fa-star"></i> GPA: ${edu.gpa}</p>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    clearPersonal() {
        if (confirm('Remove personal information?')) {
            this.portfolioData.personal = {};
            this.saveToStorage();
            this.updateSections();
            document.getElementById('personal-form').reset();
            this.showNotification('Personal information removed!');
        }
    }

    // Preview Management
    updatePreview() {
        const preview = document.getElementById('portfolioPreview');
        
        if (this.hasContent()) {
            preview.innerHTML = this.generatePreviewHTML();
            preview.className = `portfolio-preview ${this.currentTemplate}-template`;
        } else {
            preview.innerHTML = `
                <div class="preview-placeholder">
                    <i class="fas fa-eye"></i>
                    <h4>No content to preview</h4>
                    <p>Add some content in the builder to see your portfolio here</p>
                </div>
            `;
        }
    }

    hasContent() {
        return Object.keys(this.portfolioData.personal).length > 0 ||
               this.portfolioData.experience.length > 0 ||
               this.portfolioData.projects.length > 0 ||
               this.portfolioData.skills.length > 0 ||
               this.portfolioData.education.length > 0;
    }

    generatePreviewHTML() {
        let html = '';
        
        // Header
        if (this.portfolioData.personal.fullName) {
            html += `
                <div class="portfolio-header">
                    <h1>${this.portfolioData.personal.fullName}</h1>
                    ${this.portfolioData.personal.title ? `<p>${this.portfolioData.personal.title}</p>` : ''}
                    ${this.portfolioData.personal.bio ? `<p style="margin-top: 1rem; opacity: 0.9;">${this.portfolioData.personal.bio}</p>` : ''}
                    <div class="contact-links" style="margin-top: 1.5rem;">
                        ${this.portfolioData.personal.email ? `<a href="mailto:${this.portfolioData.personal.email}"><i class="fas fa-envelope"></i> ${this.portfolioData.personal.email}</a>` : ''}
                        ${this.portfolioData.personal.phone ? `<a href="tel:${this.portfolioData.personal.phone}"><i class="fas fa-phone"></i> ${this.portfolioData.personal.phone}</a>` : ''}
                        ${this.portfolioData.personal.location ? `<span><i class="fas fa-map-marker-alt"></i> ${this.portfolioData.personal.location}</span>` : ''}
                        ${this.portfolioData.personal.linkedin ? `<a href="${this.portfolioData.personal.linkedin}" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                        ${this.portfolioData.personal.github ? `<a href="${this.portfolioData.personal.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    </div>
                </div>
            `;
        }

        html += '<div class="portfolio-content">';

        // Experience
        if (this.portfolioData.experience.length > 0) {
            html += `
                <div class="section">
                    <h2><i class="fas fa-briefcase"></i> Experience</h2>
                    ${this.portfolioData.experience.map(exp => {
                        const startDate = exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
                        const endDate = exp.endDate === 'Present' ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '');
                        
                        return `
                            <div style="margin-bottom: 2rem;">
                                <h3 style="color: #1a202c; margin-bottom: 0.5rem;">${exp.jobTitle}</h3>
                                <p style="color: #2b6cb0; font-weight: 600; margin-bottom: 0.25rem;">${exp.company}</p>
                                ${startDate || endDate ? `<p style="color: #64748b; font-size: 0.875rem; margin-bottom: 1rem;"><i class="fas fa-calendar"></i> ${startDate} - ${endDate}</p>` : ''}
                                ${exp.description ? `<p style="line-height: 1.6;">${exp.description}</p>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        // Projects
        if (this.portfolioData.projects.length > 0) {
            html += `
                <div class="section">
                    <h2><i class="fas fa-code"></i> Projects</h2>
                    <div style="display: grid; gap: 2rem;">
                        ${this.portfolioData.projects.map(project => `
                            <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem;">
                                <h3 style="color: #1a202c; margin-bottom: 1rem;">${project.name}</h3>
                                <p style="margin-bottom: 1rem; line-height: 1.6;">${project.description}</p>
                                ${project.technologies ? `<p style="margin-bottom: 1rem;"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                    ${project.url ? `<a href="${project.url}" target="_blank" style="color: #2b6cb0; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                                    ${project.repository ? `<a href="${project.repository}" target="_blank" style="color: #2b6cb0; text-decoration: none; display: flex; align-items: center; gap: 0.5rem;"><i class="fab fa-github"></i> Repository</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Skills
        if (this.portfolioData.skills.length > 0) {
            html += `
                <div class="section">
                    <h2><i class="fas fa-cogs"></i> Skills</h2>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                        ${this.portfolioData.skills.map(skill => `
                            <span style="display: inline-block; padding: 0.5rem 1rem; background: #eff6ff; color: #2b6cb0; border-radius: 20px; font-size: 0.875rem; font-weight: 500;">${skill.name}</span>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Education
        if (this.portfolioData.education.length > 0) {
            html += `
                <div class="section">
                    <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                    ${this.portfolioData.education.map(edu => `
                        <div style="margin-bottom: 2rem;">
                            <h3 style="color: #1a202c; margin-bottom: 0.5rem;">${edu.degree}</h3>
                            <p style="color: #2b6cb0; font-weight: 600; margin-bottom: 0.25rem;">${edu.school}</p>
                            ${edu.field ? `<p style="color: #64748b; margin-bottom: 0.5rem;">${edu.field}</p>` : ''}
                            <div style="display: flex; gap: 2rem;">
                                ${edu.year ? `<p style="color: #64748b; font-size: 0.875rem;"><i class="fas fa-calendar"></i> ${edu.year}</p>` : ''}
                                ${edu.gpa ? `<p style="color: #64748b; font-size: 0.875rem;"><i class="fas fa-star"></i> GPA: ${edu.gpa}</p>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    // Template Management
    selectTemplate(templateName) {
        this.currentTemplate = templateName;
        this.saveToStorage();
        this.updatePreview();
        this.showNotification(`${templateName.charAt(0).toUpperCase() + templateName.slice(1)} template selected!`);
    }

    changeTemplate() {
        const selector = document.getElementById('templateSelector');
        this.selectTemplate(selector.value);
    }

    // Storage
    saveToStorage() {
        try {
            localStorage.setItem('portfolioData', JSON.stringify(this.portfolioData));
            localStorage.setItem('currentTemplate', this.currentTemplate);
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('portfolioData');
            if (saved) {
                this.portfolioData = { ...this.portfolioData, ...JSON.parse(saved) };
            }
            
            const template = localStorage.getItem('currentTemplate');
            if (template) {
                this.currentTemplate = template;
                const selector = document.getElementById('templateSelector');
                if (selector) selector.value = template;
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
    }

    autoSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            this.saveToStorage();
        }, 1000);
    }

    // Export and Share
    downloadPDF() {
        this.showNotification('PDF download feature coming soon!', 'info');
        // In a real implementation, you would use libraries like jsPDF or puppeteer
    }

    sharePortfolio() {
        if (navigator.share && this.hasContent()) {
            navigator.share({
                title: `${this.portfolioData.personal.fullName || 'My'} Portfolio`,
                text: 'Check out my professional portfolio',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Portfolio URL copied to clipboard!');
            }).catch(() => {
                this.showNotification('Sharing not supported in this browser', 'error');
            });
        }
    }

    // Notifications
    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global functions for HTML onclick events
function startBuilding() {
    portfolioBuilder.switchTab('builder');
}

function showPreview() {
    portfolioBuilder.switchTab('preview');
}

function savePersonalInfo() {
    portfolioBuilder.savePersonalInfo();
}

function addExperience() {
    portfolioBuilder.addExperience();
}

function addProject() {
    portfolioBuilder.addProject();
}

function addSkill() {
    portfolioBuilder.addSkill();
}

function addEducation() {
    portfolioBuilder.addEducation();
}

function clearAll() {
    portfolioBuilder.clearAll();
}

function selectTemplate(template) {
    portfolioBuilder.selectTemplate(template);
}

function changeTemplate() {
    portfolioBuilder.changeTemplate();
}

function downloadPDF() {
    portfolioBuilder.downloadPDF();
}

function sharePortfolio() {
    portfolioBuilder.sharePortfolio();
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the portfolio builder when DOM is ready
let portfolioBuilder;
document.addEventListener('DOMContentLoaded', () => {
    portfolioBuilder = new PortfolioBuilder();
});
