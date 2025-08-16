// Modern Portfolio Builder Pro

let isLoggedIn = false;
let currentUser = null;
let currentStep = 'personal';
let currentTemplate = 'template1';
let portfolioData = {
    personal: {},
    experience: [],
    projects: [],
    skills: [],
    education: []
};

// Authentication check function
function checkAuthStatus() {
    if (!isLoggedIn) {
        showNotification('Please login to access the Portfolio Builder', 'error');
        showLoginModal();
        return false;
    }
    return true;
}

// Landing Page Functions
function showLoginModal() {
    console.log('showLoginModal called');
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Login modal displayed');
    } else {
        console.error('Login modal not found');
    }
}

function showSignupModal() {
    console.log('showSignupModal called');
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Signup modal displayed');
    } else {
        console.error('Signup modal not found');
    }
}

function closeModal(modalId) {
    console.log('closeModal called for:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        console.log('Modal closed:', modalId);
    } else {
        console.error('Modal not found:', modalId);
    }
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
    simulateLogin(provider);
}

function signupWith(provider) {
    simulateLogin(provider);
}

function simulateLogin(provider) {
    // Show loading state
    const buttons = document.querySelectorAll('.btn-social');
    buttons.forEach(btn => {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        btn.disabled = true;
    });
    
    setTimeout(() => {
        isLoggedIn = true;
        let userName = '';
        let userEmail = '';
        
        switch(provider) {
            case 'google':
                userName = 'Google User';
                userEmail = 'google@example.com';
                break;
            case 'github':
                userName = 'GitHub User';
                userEmail = 'github@example.com';
                break;
            case 'linkedin':
                userName = 'LinkedIn User';
                userEmail = 'linkedin@example.com';
                break;
            default:
                userName = 'Demo User';
                userEmail = 'demo@example.com';
        }
        
        currentUser = { 
            name: userName, 
            email: userEmail 
        };
        
        // Hide landing page and show portfolio app
        const landingPage = document.getElementById('landing-page');
        const portfolioApp = document.getElementById('portfolio-app');
        
        if (landingPage) landingPage.style.display = 'none';
        if (portfolioApp) portfolioApp.style.display = 'block';
        
        // Update user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) userNameElement.textContent = currentUser.name;
        
        closeModal('loginModal');
        closeModal('signupModal');
        
        initializePortfolioBuilder();
        showNotification(`Welcome ${currentUser.name}!`, 'success');
        
        // Reset buttons
        buttons.forEach(btn => {
            btn.innerHTML = btn.getAttribute('data-original-text') || 'Continue with ' + (provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'LinkedIn');
            btn.disabled = false;
        });
    }, 1500);
}

// Enhanced authentication form handling
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    const loginBtn = event.target.querySelector('button[type="submit"]');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    loginBtn.disabled = true;
    
    setTimeout(() => {
        isLoggedIn = true;
        currentUser = { name: email.split('@')[0], email: email };
        
        // Hide landing page and show portfolio app
        const landingPage = document.getElementById('landing-page');
        const portfolioApp = document.getElementById('portfolio-app');
        
        if (landingPage) landingPage.style.display = 'none';
        if (portfolioApp) portfolioApp.style.display = 'block';
        
        // Update user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) userNameElement.textContent = currentUser.name;
        
        closeModal('loginModal');
        initializePortfolioBuilder();
        showNotification(`Welcome back, ${currentUser.name}!`, 'success');
        
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }, 1000);
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate signup process
    const signupBtn = event.target.querySelector('button[type="submit"]');
    const originalText = signupBtn.innerHTML;
    signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    signupBtn.disabled = true;
    
    setTimeout(() => {
        isLoggedIn = true;
        currentUser = { name: name, email: email };
        
        // Hide landing page and show portfolio app
        const landingPage = document.getElementById('landing-page');
        const portfolioApp = document.getElementById('portfolio-app');
        
        if (landingPage) landingPage.style.display = 'none';
        if (portfolioApp) portfolioApp.style.display = 'block';
        
        // Update user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) userNameElement.textContent = currentUser.name;
        
        closeModal('signupModal');
        initializePortfolioBuilder();
        showNotification(`Welcome to Portfolio Builder Pro, ${currentUser.name}!`, 'success');
        
        signupBtn.innerHTML = originalText;
        signupBtn.disabled = false;
    }, 1000);
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('mobile-active');
}

// Portfolio Builder Functions
function initializePortfolioBuilder() {
    // Check authentication first
    if (!checkAuthStatus()) {
        return;
    }
    
    console.log('Initializing Portfolio Builder...');
    
    // Ensure portfolio app is visible
    const portfolioApp = document.getElementById('portfolio-app');
    if (portfolioApp) {
        portfolioApp.style.display = 'block';
        portfolioApp.style.position = 'relative';
        portfolioApp.style.zIndex = '1001';
    }
    
    // Ensure landing page is hidden
    const landingPage = document.getElementById('landing-page');
    if (landingPage) {
        landingPage.style.display = 'none';
    }
    
    loadFromStorage();
    bindEvents();
    updateProgressBar();
    renderCurrentStep();
    initializeTemplateSelector();
    
    // Show welcome message
    showNotification('Portfolio Builder initialized! Start building your portfolio.', 'info');
    
    console.log('Portfolio Builder initialized successfully');
}

function bindEvents() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check authentication before switching tabs
            if (!checkAuthStatus()) {
                return;
            }
            switchTab(e.target.closest('.nav-btn').dataset.tab);
        });
    });

    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', autoSave);
    });
}

function switchTab(tabName) {
    // Check authentication before switching tabs
    if (!checkAuthStatus()) {
        return;
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'preview') updatePreview();
}

function nextStep() {
    // Check authentication before proceeding
    if (!checkAuthStatus()) {
        return;
    }
    
    const steps = ['personal', 'experience', 'projects', 'skills', 'education'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex < steps.length - 1) {
        currentStep = steps[currentIndex + 1];
        updateProgressBar();
        renderCurrentStep();
        scrollToTop();
    }
}

function previousStep() {
    // Check authentication before proceeding
    if (!checkAuthStatus()) {
        return;
    }
    
    const steps = ['personal', 'experience', 'projects', 'skills', 'education'];
    const currentIndex = steps.indexOf(currentStep);
    
    if (currentIndex > 0) {
        currentStep = steps[currentIndex - 1];
        updateProgressBar();
        renderCurrentStep();
        scrollToTop();
    }
}

function updateProgressBar() {
    const steps = ['personal', 'experience', 'projects', 'skills', 'education'];
    const currentIndex = steps.indexOf(currentStep);
    const progressPercentage = ((currentIndex + 1) / steps.length) * 100;
    
    // Update progress bar
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = progressPercentage + '%';
    }
    
    // Update step indicators
    const stepElements = document.querySelectorAll('.step');
    stepElements.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index === currentIndex) {
            step.classList.add('active');
        } else if (index < currentIndex) {
            step.classList.add('completed');
        }
    });
    
    console.log(`Progress updated: ${progressPercentage}%, Current step: ${currentStep}`);
}

function renderCurrentStep() {
    console.log('Rendering current step:', currentStep);
    
    // Hide all form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show current form section
    const currentSection = document.getElementById(`${currentStep}-form`);
    if (currentSection) {
        currentSection.classList.add('active');
        currentSection.style.display = 'block';
        currentSection.style.position = 'relative';
        currentSection.style.zIndex = '1003';
        console.log('Current section displayed:', currentSection.id);
    } else {
        console.error('Form section not found:', `${currentStep}-form`);
    }
    
    updateFormActions();
}

function updateFormActions() {
    const steps = ['personal', 'experience', 'projects', 'skills', 'education'];
    const currentIndex = steps.indexOf(currentStep);
    
    const prevBtn = document.querySelector('.form-actions .btn-secondary');
    if (prevBtn) {
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'inline-flex';
        if (currentIndex > 0) {
            prevBtn.innerHTML = `<i class="fas fa-arrow-left"></i> Previous: ${steps[currentIndex - 1].charAt(0).toUpperCase() + steps[currentIndex - 1].slice(1)}`;
        }
    }
    
    const nextBtn = document.querySelector('.form-actions .btn-primary');
    if (nextBtn) {
        if (currentIndex === steps.length - 1) {
            nextBtn.innerHTML = `<i class="fas fa-check"></i> Finish & Preview`;
            nextBtn.onclick = finishBuilder;
        } else {
            nextBtn.innerHTML = `Next: ${steps[currentIndex + 1].charAt(0).toUpperCase() + steps[currentIndex + 1].slice(1)} <i class="fas fa-arrow-right"></i>`;
            nextBtn.onclick = nextStep;
        }
    }
}

function finishBuilder() {
    saveAllData();
    switchTab('preview');
    showNotification('Portfolio completed! Check out your preview.');
}

function saveAllData() {
    savePersonalInfo();
    saveExperience();
    saveProjects();
    saveSkills();
    saveEducation();
}

function savePersonalInfo() {
    const form = document.getElementById('personal-form');
    const formData = new FormData(form);
    
    portfolioData.personal = {
        fullName: formData.get('fullName') || '',
        title: formData.get('title') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        location: formData.get('location') || '',
        bio: formData.get('bio') || '',
        linkedin: formData.get('linkedin') || '',
        github: formData.get('github') || ''
    };
    
    saveToStorage();
}

function saveExperience() {
    const experienceItems = document.querySelectorAll('.experience-item');
    portfolioData.experience = [];
    
    experienceItems.forEach(item => {
        const experience = {
            id: item.dataset.id,
            jobTitle: item.querySelector('[name="jobTitle"]').value,
            company: item.querySelector('[name="company"]').value,
            startDate: item.querySelector('[name="startDate"]').value,
            endDate: item.querySelector('[name="endDate"]').value,
            description: item.querySelector('[name="jobDescription"]').value,
            current: item.querySelector('[name="currentJob"]').checked
        };
        portfolioData.experience.push(experience);
    });
    
    saveToStorage();
}

function saveProjects() {
    const projectItems = document.querySelectorAll('.project-item');
    portfolioData.projects = [];
    
    projectItems.forEach(item => {
        const project = {
            id: item.dataset.id,
            name: item.querySelector('[name="projectName"]').value,
            description: item.querySelector('[name="projectDescription"]').value,
            technologies: item.querySelector('[name="technologies"]').value,
            liveUrl: item.querySelector('[name="projectUrl"]').value,
            repoUrl: item.querySelector('[name="repositoryUrl"]').value
        };
        portfolioData.projects.push(project);
    });
    
    saveToStorage();
}

function saveSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    portfolioData.skills = [];
    
    skillItems.forEach(item => {
        const skill = {
            id: item.dataset.id,
            name: item.querySelector('[name="skillName"]').value,
            level: item.querySelector('[name="skillLevel"]').value
        };
        portfolioData.skills.push(skill);
    });
    
    saveToStorage();
}

function saveEducation() {
    const educationItems = document.querySelectorAll('.education-item');
    portfolioData.education = [];
    
    educationItems.forEach(item => {
        const education = {
            id: item.dataset.id,
            degree: item.querySelector('[name="degree"]').value,
            field: item.querySelector('[name="field"]').value,
            school: item.querySelector('[name="school"]').value,
            graduationYear: item.querySelector('[name="graduationYear"]').value,
            gpa: item.querySelector('[name="gpa"]').value
        };
        portfolioData.education.push(education);
    });
    
    saveToStorage();
}

function addExperienceForm() {
    const experienceList = document.getElementById('experienceList');
    const experienceId = Date.now();
    
    const experienceHtml = `
        <div class="experience-item" data-id="${experienceId}">
            <div class="experience-item-header">
                <div class="experience-item-title">Experience Entry</div>
                <button type="button" class="remove-experience" onclick="removeItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-control">
                    <label for="jobTitle_${experienceId}">Job Title</label>
                    <input type="text" name="jobTitle" id="jobTitle_${experienceId}" placeholder="Senior Developer">
                </div>
                <div class="form-control">
                    <label for="company_${experienceId}">Company</label>
                    <input type="text" name="company" id="company_${experienceId}" placeholder="Tech Corp">
                </div>
            </div>
            <div class="form-row">
                <div class="form-control">
                    <label for="startDate_${experienceId}">Start Date</label>
                    <input type="month" name="startDate" id="startDate_${experienceId}">
                </div>
                <div class="form-control">
                    <label for="endDate_${experienceId}">End Date</label>
                    <input type="month" name="endDate" id="endDate_${experienceId}">
                </div>
            </div>
            <div class="form-control">
                <label class="checkbox-label">
                    <input type="checkbox" name="currentJob" id="currentJob_${experienceId}" onchange="toggleEndDate(this)">
                    Currently working here
                </label>
            </div>
            <div class="form-control">
                <label for="jobDescription_${experienceId}">Description</label>
                <textarea name="jobDescription" id="jobDescription_${experienceId}" rows="4" placeholder="Describe your responsibilities and achievements..."></textarea>
            </div>
        </div>
    `;
    
    experienceList.insertAdjacentHTML('beforeend', experienceHtml);
}

function addProjectForm() {
    const projectsList = document.getElementById('projectsList');
    const projectId = Date.now();
    
    const projectHtml = `
        <div class="project-item" data-id="${projectId}">
            <div class="project-item-header">
                <div class="project-item-title">Project Entry</div>
                <button type="button" class="remove-project" onclick="removeItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-control">
                <label for="projectName_${projectId}">Project Name</label>
                <input type="text" name="projectName" id="projectName_${projectId}" placeholder="Amazing Web App">
            </div>
            <div class="form-control">
                <label for="projectDescription_${projectId}">Description</label>
                <textarea name="projectDescription" id="projectDescription_${projectId}" rows="3" placeholder="Describe what this project does..."></textarea>
            </div>
            <div class="form-row">
                <div class="form-control">
                    <label for="technologies_${projectId}">Technologies Used</label>
                    <input type="text" name="technologies" id="technologies_${projectId}" placeholder="React, Node.js, MongoDB">
                </div>
                <div class="form-control">
                    <label for="projectUrl_${projectId}">Live Demo URL</label>
                    <input type="url" name="projectUrl" id="projectUrl_${projectId}" placeholder="https://myproject.com">
                </div>
            </div>
            <div class="form-control">
                <label for="repositoryUrl_${projectId}">Repository URL</label>
                <input type="url" name="repositoryUrl" id="repositoryUrl_${projectId}" placeholder="https://github.com/user/project">
            </div>
        </div>
    `;
    
    projectsList.insertAdjacentHTML('beforeend', projectHtml);
}

function addSkillForm() {
    const skillsList = document.getElementById('skillsList');
    const skillId = Date.now();
    
    const skillHtml = `
        <div class="skill-item" data-id="${skillId}">
            <div class="skill-item-header">
                <div class="skill-item-title">Skill Entry</div>
                <button type="button" class="remove-skill" onclick="removeItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-control">
                    <label for="skillName_${skillId}">Skill Name</label>
                    <input type="text" name="skillName" id="skillName_${skillId}" placeholder="JavaScript">
                </div>
                <div class="form-control">
                    <label for="skillLevel_${skillId}">Proficiency Level</label>
                    <select name="skillLevel" id="skillLevel_${skillId}">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    skillsList.insertAdjacentHTML('beforeend', skillHtml);
}

function addEducationForm() {
    const educationList = document.getElementById('educationList');
    const educationId = Date.now();
    
    const educationHtml = `
        <div class="education-item" data-id="${educationId}">
            <div class="education-item-header">
                <div class="education-item-title">Education Entry</div>
                <button type="button" class="remove-education" onclick="removeItem(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-control">
                    <label for="degree_${educationId}">Degree</label>
                    <input type="text" name="degree" id="degree_${educationId}" placeholder="Bachelor of Science">
                </div>
                <div class="form-control">
                    <label for="field_${educationId}">Field of Study</label>
                    <input type="text" name="field" id="field_${educationId}" placeholder="Computer Science">
                </div>
            </div>
            <div class="form-row">
                <div class="form-control">
                    <label for="school_${educationId}">School/University</label>
                    <input type="text" name="school" id="school_${educationId}" placeholder="University of Technology">
                </div>
                <div class="form-control">
                    <label for="graduationYear_${educationId}">Graduation Year</label>
                    <input type="number" name="graduationYear" id="graduationYear_${educationId}" placeholder="2023">
                </div>
            </div>
            <div class="form-control">
                <label for="gpa_${educationId}">GPA (optional)</label>
                <input type="text" name="gpa" id="gpa_${educationId}" placeholder="3.8/4.0">
            </div>
        </div>
    `;
    
    educationList.insertAdjacentHTML('beforeend', educationHtml);
}

function removeItem(button) {
    const item = button.closest('.experience-item, .project-item, .skill-item, .education-item');
    item.remove();
    autoSave();
}

function toggleEndDate(checkbox) {
    const endDateInput = checkbox.closest('.experience-item').querySelector('[name="endDate"]');
    if (checkbox.checked) {
        endDateInput.disabled = true;
        endDateInput.value = '';
    } else {
        endDateInput.disabled = false;
    }
}

function autoSave() {
    saveAllData();
}

function saveToStorage() {
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
}

function loadFromStorage() {
    const saved = localStorage.getItem('portfolioData');
    if (saved) {
        portfolioData = JSON.parse(saved);
        populateForms();
    }
}

function populateForms() {
    if (portfolioData.personal) {
        Object.keys(portfolioData.personal).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = portfolioData.personal[key];
        });
    }
    
    populateExperience();
    populateProjects();
    populateSkills();
    populateEducation();
}

function populateExperience() {
    const experienceList = document.getElementById('experienceList');
    experienceList.innerHTML = '';
    
    portfolioData.experience.forEach(exp => {
        addExperienceForm();
        const lastItem = experienceList.lastElementChild;
        lastItem.dataset.id = exp.id;
        
        lastItem.querySelector('[name="jobTitle"]').value = exp.jobTitle || '';
        lastItem.querySelector('[name="company"]').value = exp.company || '';
        lastItem.querySelector('[name="startDate"]').value = exp.startDate || '';
        lastItem.querySelector('[name="endDate"]').value = exp.endDate || '';
        lastItem.querySelector('[name="jobDescription"]').value = exp.description || '';
        
        const currentCheckbox = lastItem.querySelector('[name="currentJob"]');
        currentCheckbox.checked = exp.current || false;
        toggleEndDate(currentCheckbox);
    });
}

function populateProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    portfolioData.projects.forEach(project => {
        addProjectForm();
        const lastItem = projectsList.lastElementChild;
        lastItem.dataset.id = project.id;
        
        lastItem.querySelector('[name="projectName"]').value = project.name || '';
        lastItem.querySelector('[name="projectDescription"]').value = project.description || '';
        lastItem.querySelector('[name="technologies"]').value = project.technologies || '';
        lastItem.querySelector('[name="projectUrl"]').value = project.liveUrl || '';
        lastItem.querySelector('[name="repositoryUrl"]').value = project.repoUrl || '';
    });
}

function populateSkills() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    
    portfolioData.skills.forEach(skill => {
        addSkillForm();
        const lastItem = skillsList.lastElementChild;
        lastItem.dataset.id = skill.id;
        
        lastItem.querySelector('[name="skillName"]').value = skill.name || '';
        lastItem.querySelector('[name="skillLevel"]').value = skill.level || 'beginner';
    });
}

function populateEducation() {
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';
    
    portfolioData.education.forEach(education => {
        addEducationForm();
        const lastItem = educationList.lastElementChild;
        lastItem.dataset.id = education.id;
        
        lastItem.querySelector('[name="degree"]').value = education.degree || '';
        lastItem.querySelector('[name="field"]').value = education.field || '';
        lastItem.querySelector('[name="school"]').value = education.school || '';
        lastItem.querySelector('[name="graduationYear"]').value = education.graduationYear || '';
        lastItem.querySelector('[name="gpa"]').value = education.gpa || '';
    });
}

// Template Functions
function selectTemplate(templateName) {
    // Check authentication before selecting template
    if (!checkAuthStatus()) {
        return;
    }
    
    currentTemplate = templateName;
    updatePreview();
    showNotification(`Template "${templateName}" selected!`);
}

function changeTemplate() {
    // Check authentication before changing template
    if (!checkAuthStatus()) {
        return;
    }
    
    const selector = document.getElementById('templateSelector');
    currentTemplate = selector.value;
    updatePreview();
}

// Preview Functions
function updatePreview() {
    const previewContainer = document.getElementById('portfolioPreview');
    if (!previewContainer) return;
    
    const template = currentTemplate || 'template1';
    const previewHtml = generatePreviewHTML(template);
    previewContainer.innerHTML = previewHtml;
}

function generatePreviewHTML(template) {
    const data = portfolioData;
    
    switch (template) {
        case 'template1':
            return generateTemplate1HTML(data);
        case 'template2':
            return generateTemplate2HTML(data);
        case 'template3':
            return generateTemplate3HTML(data);
        case 'template4':
            return generateTemplate4HTML(data);
        default:
            return generateTemplate1HTML(data);
    }
}

function generateTemplate1HTML(data) {
    return `
        <div class="template1-preview">
            <div class="preview-header">
                <h1>${data.personal.fullName || 'Your Name'}</h1>
                <p class="title">${data.personal.title || 'Professional Title'}</p>
                <p class="bio">${data.personal.bio || 'Your professional bio will appear here...'}</p>
                <div class="contact-info">
                    ${data.personal.email ? `<span><i class="fas fa-envelope"></i> ${data.personal.email}</span>` : ''}
                    ${data.personal.phone ? `<span><i class="fas fa-phone"></i> ${data.personal.phone}</span>` : ''}
                    ${data.personal.location ? `<span><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</span>` : ''}
                </div>
            </div>
            
            ${data.experience.length > 0 ? `
            <div class="preview-section">
                <h2><i class="fas fa-briefcase"></i> Experience</h2>
                ${data.experience.map(exp => `
                    <div class="experience-item">
                        <h3>${exp.jobTitle}</h3>
                        <p class="company">${exp.company}</p>
                        <p class="period">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                        <p class="description">${exp.description}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.projects.length > 0 ? `
            <div class="preview-section">
                <h2><i class="fas fa-code"></i> Projects</h2>
                ${data.projects.map(project => `
                    <div class="project-item">
                        <h3>${project.name}</h3>
                        <p class="description">${project.description}</p>
                        <p class="technologies"><strong>Technologies:</strong> ${project.technologies}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${data.skills.length > 0 ? `
            <div class="preview-section">
                <h2><i class="fas fa-cogs"></i> Skills</h2>
                <div class="skills-grid">
                    ${data.skills.map(skill => `
                        <div class="skill-item ${skill.level}">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-level">${skill.level}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            ${data.education.length > 0 ? `
            <div class="preview-section">
                <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                ${data.education.map(edu => `
                    <div class="education-item">
                        <h3>${edu.degree} in ${edu.field}</h3>
                        <p class="school">${edu.school}</p>
                        <p class="year">${edu.graduationYear}</p>
                        ${edu.gpa ? `<p class="gpa">GPA: ${edu.gpa}</p>` : ''}
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    `;
}

function generateTemplate2HTML(data) {
    return `
        <div class="template2-preview">
            <div class="sidebar">
                <div class="profile">
                    <div class="avatar"></div>
                    <h1>${data.personal.fullName || 'Your Name'}</h1>
                    <p class="title">${data.personal.title || 'Professional Title'}</p>
                    <p class="bio">${data.personal.bio || 'Your professional bio will appear here...'}</p>
                </div>
                <div class="contact">
                    <h3>Contact</h3>
                    ${data.personal.email ? `<p><i class="fas fa-envelope"></i> ${data.personal.email}</p>` : ''}
                    ${data.personal.phone ? `<p><i class="fas fa-phone"></i> ${data.personal.phone}</p>` : ''}
                    ${data.personal.location ? `<p><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</p>` : ''}
                </div>
            </div>
            <div class="main-content">
                ${data.experience.length > 0 ? `
                <section>
                    <h2>Experience</h2>
                    ${data.experience.map(exp => `
                        <div class="experience-item">
                            <h3>${exp.jobTitle}</h3>
                            <p class="company">${exp.company}</p>
                            <p class="period">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
                            <p class="description">${exp.description}</p>
                        </div>
                    `).join('')}
                </section>
                ` : ''}
                
                ${data.projects.length > 0 ? `
                <section>
                    <h2>Projects</h2>
                    ${data.projects.map(project => `
                        <div class="project-item">
                            <h3>${project.name}</h3>
                            <p class="description">${project.description}</p>
                            <p class="technologies"><strong>Technologies:</strong> ${project.technologies}</p>
                        </div>
                    `).join('')}
                </section>
                ` : ''}
            </div>
        </div>
    `;
}

function generateTemplate3HTML(data) {
    return `
        <div class="template3-preview">
            <div class="hero-section">
                <h1>${data.personal.fullName || 'Your Name'}</h1>
                <p class="title">${data.personal.title || 'Professional Title'}</p>
                <p class="bio">${data.personal.bio || 'Your professional bio will appear here...'}</p>
            </div>
            
            <div class="grid-sections">
                ${data.experience.length > 0 ? `
                <div class="grid-item experience">
                    <h2>Experience</h2>
                    ${data.experience.map(exp => `
                        <div class="item">
                            <h3>${exp.jobTitle}</h3>
                            <p>${exp.company}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.projects.length > 0 ? `
                <div class="grid-item projects">
                    <h2>Projects</h2>
                    ${data.projects.map(project => `
                        <div class="item">
                            <h3>${project.name}</h3>
                            <p>${project.technologies}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${data.skills.length > 0 ? `
                <div class="grid-item skills">
                    <h2>Skills</h2>
                    <div class="skills-list">
                        ${data.skills.map(skill => `
                            <span class="skill ${skill.level}">${skill.name}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

function generateTemplate4HTML(data) {
    return `
        <div class="template4-preview">
            <div class="premium-header">
                <div class="header-content">
                    <div class="profile-section">
                        <div class="profile-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="profile-info">
                            <h1 class="name">${data.personal.fullName || 'Your Name'}</h1>
                            <p class="title">${data.personal.title || 'Professional Title'}</p>
                            <p class="bio">${data.personal.bio || 'Your professional bio will appear here...'}</p>
                        </div>
                    </div>
                    <div class="contact-section">
                        ${data.personal.email ? `<div class="contact-item"><i class="fas fa-envelope"></i> ${data.personal.email}</div>` : ''}
                        ${data.personal.phone ? `<div class="contact-item"><i class="fas fa-phone"></i> ${data.personal.phone}</div>` : ''}
                        ${data.personal.location ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i> ${data.personal.location}</div>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="premium-content">
                ${data.experience.length > 0 ? `
                <section class="content-section experience-section">
                    <h2><i class="fas fa-briefcase"></i> Professional Experience</h2>
                    <div class="experience-grid">
                        ${data.experience.map(exp => `
                            <div class="experience-card">
                                <div class="exp-header">
                                    <h3>${exp.jobTitle}</h3>
                                    <span class="company">${exp.company}</span>
                                </div>
                                <div class="exp-period">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
                                <p class="exp-description">${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
                
                ${data.projects.length > 0 ? `
                <section class="content-section projects-section">
                    <h2><i class="fas fa-code"></i> Featured Projects</h2>
                    <div class="projects-grid">
                        ${data.projects.map(project => `
                            <div class="project-card">
                                <h3>${project.name}</h3>
                                <p class="project-description">${project.description}</p>
                                <div class="project-tech">
                                    <strong>Technologies:</strong> ${project.technologies}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
                
                ${data.skills.length > 0 ? `
                <section class="content-section skills-section">
                    <h2><i class="fas fa-cogs"></i> Skills & Expertise</h2>
                    <div class="skills-grid">
                        ${data.skills.map(skill => `
                            <div class="skill-card ${skill.level}">
                                <span class="skill-name">${skill.name}</span>
                                <div class="skill-level-indicator">
                                    <span class="level-text">${skill.level}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
                
                ${data.education.length > 0 ? `
                <section class="content-section education-section">
                    <h2><i class="fas fa-graduation-cap"></i> Education</h2>
                    <div class="education-grid">
                        ${data.education.map(edu => `
                            <div class="education-card">
                                <h3>${edu.degree}</h3>
                                <p class="field">${edu.field}</p>
                                <p class="school">${edu.school}</p>
                                <p class="year">${edu.graduationYear}</p>
                                ${edu.gpa ? `<p class="gpa">GPA: ${edu.gpa}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
            </div>
        </div>
    `;
}

// Export Functions
function downloadPDF() {
    // Check authentication before export
    if (!checkAuthStatus()) {
        return;
    }
    
    const element = document.getElementById('portfolioPreview');
    if (!element) {
        showNotification('No portfolio content to export', 'error');
        return;
    }
    
    if (typeof html2pdf !== 'undefined') {
        const opt = {
            margin: 1,
            filename: 'portfolio.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
    } else {
        showNotification('PDF export library not loaded', 'error');
    }
}

function downloadPNG() {
    // Check authentication before export
    if (!checkAuthStatus()) {
        return;
    }
    
    const element = document.getElementById('portfolioPreview');
    if (!element) {
        showNotification('No portfolio content to export', 'error');
        return;
    }
    
    if (typeof html2canvas !== 'undefined') {
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'portfolio.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        showNotification('PNG export library not loaded', 'error');
    }
}

function sharePortfolio() {
    // Check authentication before sharing
    if (!checkAuthStatus()) {
        return;
    }
    
    const shareData = {
        title: 'My Portfolio',
        text: 'Check out my professional portfolio!',
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('Portfolio link copied to clipboard!', 'success');
        });
    }
}

// Utility Functions
function goBack() {
    // Show landing page and hide portfolio app
    const landingPage = document.getElementById('landing-page');
    const portfolioApp = document.getElementById('portfolio-app');
    
    if (landingPage) landingPage.style.display = 'block';
    if (portfolioApp) portfolioApp.style.display = 'none';
    
    // Reset login state
    isLoggedIn = false;
    currentUser = null;
    
    showNotification('Returned to landing page', 'info');
}

function showUserMenu() {
    const userBtn = document.querySelector('.user-btn');
    userBtn.classList.toggle('active');
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 50
        });
    }
    
    // Initialize modals
    initializeModals();
    
    // Initialize form handlers
    initializeFormHandlers();
    
    // Initialize template selector
    initializeTemplateSelector();
    
    // Check if user is already logged in
    checkInitialAuthStatus();
});

function checkInitialAuthStatus() {
    // If user is not logged in, ensure portfolio app is hidden
    if (!isLoggedIn) {
        const portfolioApp = document.getElementById('portfolio-app');
        const landingPage = document.getElementById('landing-page');
        
        if (portfolioApp) portfolioApp.style.display = 'none';
        if (landingPage) landingPage.style.display = 'block';
        
        console.log('User not authenticated, showing landing page');
    } else {
        // User is logged in, show portfolio app
        const portfolioApp = document.getElementById('portfolio-app');
        const landingPage = document.getElementById('landing-page');
        
        if (portfolioApp) portfolioApp.style.display = 'block';
        if (landingPage) landingPage.style.display = 'none';
        
        console.log('User authenticated, showing portfolio app');
        initializePortfolioBuilder();
    }
}

function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                const modalId = modal.id;
                closeModal(modalId);
            }
        });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function initializeFormHandlers() {
    // Add form submission handlers
    const loginForm = document.querySelector('#loginModal .auth-form');
    const signupForm = document.querySelector('#signupModal .auth-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function initializeTemplateSelector() {
    // Initialize template selector in the builder
    const templateSelector = document.getElementById('templateSelector');
    if (templateSelector) {
        templateSelector.value = currentTemplate;
        templateSelector.addEventListener('change', changeTemplate);
    }
}

// Enhanced portfolio builder initialization
function initializePortfolioBuilder() {
    console.log('Initializing Portfolio Builder...');
    
    // Check authentication first
    if (!checkAuthStatus()) {
        return;
    }
    
    // Ensure portfolio app is visible
    const portfolioApp = document.getElementById('portfolio-app');
    if (portfolioApp) {
        portfolioApp.style.display = 'block';
        portfolioApp.style.position = 'relative';
        portfolioApp.style.zIndex = '1001';
    }
    
    // Ensure landing page is hidden
    const landingPage = document.getElementById('landing-page');
    if (landingPage) {
        landingPage.style.display = 'none';
    }
    
    loadFromStorage();
    bindEvents();
    updateProgressBar();
    renderCurrentStep();
    initializeTemplateSelector();
    
    // Show welcome message
    showNotification('Portfolio Builder initialized! Start building your portfolio.', 'info');
    
    console.log('Portfolio Builder initialized successfully');
}