document.addEventListener('DOMContentLoaded', function() {
    // Get the buttons
    const skillsButton = document.querySelector('#skills-btn');
    const experienceButton = document.querySelector('#experience-btn');
    
    // Get the sections
    const skillsSection = document.querySelector('#skills-section');
    const experienceSection = document.querySelector('#experience-section');
    
    // Hide both sections initially
    skillsSection.classList.add('hidden');
    experienceSection.classList.add('hidden');
    
    // Show Skills Section on button click
    skillsButton.addEventListener('click', function() {
        skillsSection.classList.remove('hidden');
        experienceSection.classList.add('hidden');
    });
    
    // Show Experience Section on button click
    experienceButton.addEventListener('click', function() {
        experienceSection.classList.remove('hidden');
        skillsSection.classList.add('hidden');
    });
});
