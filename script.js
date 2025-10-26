const API_BASE = 'http://localhost:3000/api';

// DOM Elements
const projectsGrid = document.getElementById('projectsGrid');
const contactForm = document.getElementById('contactForm');
const adminModal = document.getElementById('adminModal');
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const addProjectForm = document.getElementById('addProjectForm');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupEventListeners();
});

function setupEventListeners() {
    // Admin login modal
    document.getElementById('adminLogin').addEventListener('click', function(e) {
        e.preventDefault();
        adminModal.style.display = 'block';
    });

    // Close modal
    document.querySelector('.close').addEventListener('click', function() {
        adminModal.style.display = 'none';
    });

    // Login form
    loginForm.addEventListener('submit', handleLogin);

    // Add project form
    addProjectForm.addEventListener('submit', handleAddProject);

    // Contact form
    contactForm.addEventListener('submit', handleContact);
}

// Load projects from backend
async function loadProjects() {
    try {
        const response = await fetch(${API_BASE}/projects);
        const projects = await response.json();
        
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
}

// Display projects in grid
function displayProjects(projects) {
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p>No projects yet. Check back soon!</p>';
        return;
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                ${project.image ? <img src="${project.image}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;"> : 'Project Image'}
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => <span class="tech-tag">${tech}</span>).join('')}
                </div>
                <a href="${project.link}" class="project-link" target="_blank">View Project</a>
            </div>
        </div>
    `).join('');
}

// Handle contact form submission
async function handleContact(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch(${API_BASE}/contact, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Message sent successfully!');
            contactForm.reset();
        } else {
            alert('Error sending message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending message. Please try again.');
    }
}

// Handle admin login
async function handleLogin(e) {
    e.preventDefault();
    
    const loginData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch(${API_BASE}/auth/login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            adminPanel.style.display = 'block';
            loginForm.style.display = 'none';
            alert('Login successful!');
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed. Please try again.');
    }
}

// Handle adding new project
async function handleAddProject(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login first');
        return;
    }

    const projectData = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        image: document.getElementById('projectImage').value,
        link: document.getElementById('projectLink').value,
        technologies: document.getElementById('projectTech').value.split(',').map(tech => tech.trim())
    };

    try {
        const response = await fetch(${API_BASE}/projects, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${token}
            },
            body: JSON.stringify(projectData)
        });

        if (response.ok) {
            alert('Project added successfully!');
            addProjectForm.reset();
            loadProjects(); // Reload projects
        } else {
            alert('Error adding project');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error adding project. Please try again.');
    }
}

// Utility function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === adminModal) {
        adminModal.style.display = 'none';
    }
});
