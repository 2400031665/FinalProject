const form = document.getElementById('projectForm');
const projectsList = document.getElementById('projectsList');
let projects = [];

form.onsubmit = function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const desc = document.getElementById('desc').value.trim();
  const link = document.getElementById('link').value.trim();
  const mentor = document.getElementById('mentor').value.trim();

  const project = { title, desc, link, mentor };
  projects.push(project);
  updateProjectsView();
  form.reset();
};

function updateProjectsView() {
  projectsList.innerHTML = '';
  if(projects.length === 0) {
    projectsList.innerHTML = '<p>No projects added yet.</p>';
    return;
  }
  projects.forEach((p, i) => {
    projectsList.innerHTML += `
      <div class="project-card">
        <strong>${p.title}</strong><br>
        ${p.desc}<br>
        ${p.link ? `<a class="project-link" href="${p.link}" target="_blank">Project Link</a><br>` : ''}
        ${p.mentor ? `Mentor: ${p.mentor}<br>` : ''}
      </div>
    `;
  });
}
