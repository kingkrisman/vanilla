// Global state management
const AppState = {
  user: null,
  currentPage: "dashboard",
  resources: [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      description: "Learn the basics of JavaScript programming language",
      category: "javascript",
      author: "Dr. Smith",
      uploadDate: "2024-01-15",
      downloads: 45,
    },
    {
      id: 2,
      title: "React Components Guide",
      description: "Complete guide to building React components",
      category: "react",
      author: "Prof. Johnson",
      uploadDate: "2024-01-10",
      downloads: 78,
    },
    {
      id: 3,
      title: "CSS Grid Layout",
      description: "Master CSS Grid for modern web layouts",
      category: "css",
      author: "Dr. Wilson",
      uploadDate: "2024-01-08",
      downloads: 32,
    },
    {
      id: 4,
      title: "HTML5 Semantic Elements",
      description: "Understanding HTML5 semantic elements and accessibility",
      category: "html",
      author: "Prof. Davis",
      uploadDate: "2024-01-05",
      downloads: 23,
    },
  ],
};

// Demo users for authentication
const demoUsers = [
  {
    id: 1,
    name: "Dr. Smith",
    email: "lecturer@demo.com",
    password: "lecturer123",
    role: "lecturer",
  },
  {
    id: 2,
    name: "John Doe",
    email: "student@demo.com",
    password: "student123",
    role: "student",
  },
];

// Utility functions
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function showElement(element) {
  if (typeof element === "string") {
    element = $(element);
  }
  if (element) {
    element.style.display = "block";
  }
}

function hideElement(element) {
  if (typeof element === "string") {
    element = $(element);
  }
  if (element) {
    element.style.display = "none";
  }
}

function toggleElement(element) {
  if (typeof element === "string") {
    element = $(element);
  }
  if (element) {
    element.style.display = element.style.display === "none" ? "block" : "none";
  }
}

// Authentication functions
function showLogin() {
  showElement("#auth-modal");
}

function hideLogin() {
  hideElement("#auth-modal");
}

function login(email, password) {
  const user = demoUsers.find(
    (u) => u.email === email && u.password === password,
  );

  if (user) {
    AppState.user = user;
    localStorage.setItem("academicHub_user", JSON.stringify(user));
    updateUI();
    hideLogin();
    showNotification("Login successful!", "success");
    return true;
  } else {
    showNotification("Invalid email or password", "error");
    return false;
  }
}

function logout() {
  AppState.user = null;
  localStorage.removeItem("academicHub_user");
  updateUI();
  showNotification("Logged out successfully", "success");
}

function switchRole() {
  if (AppState.user) {
    const newRole = AppState.user.role === "student" ? "lecturer" : "student";
    AppState.user.role = newRole;
    AppState.user.name = newRole === "lecturer" ? "Dr. Smith" : "John Doe";
    localStorage.setItem("academicHub_user", JSON.stringify(AppState.user));
    updateUI();
    showNotification(`Switched to ${newRole}`, "success");
  }
}

function fillDemoCredentials(role) {
  const emailInput = $("#email");
  const passwordInput = $("#password");

  if (role === "student") {
    emailInput.value = "student@demo.com";
    passwordInput.value = "student123";
  } else {
    emailInput.value = "lecturer@demo.com";
    passwordInput.value = "lecturer123";
  }
}

function togglePassword(fieldId) {
  const field = $("#" + fieldId);
  const button = field.nextElementSibling;

  if (field.type === "password") {
    field.type = "text";
    button.textContent = "🙈";
  } else {
    field.type = "password";
    button.textContent = "👁️";
  }
}

// Navigation functions
function navigateToPage(page) {
  // Hide all pages
  $$(".page").forEach((p) => p.classList.remove("active"));

  // Show selected page
  const targetPage = $("#" + page + "-page");
  if (targetPage) {
    targetPage.classList.add("active");
    AppState.currentPage = page;
  }

  // Update navigation
  $$(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });

  // Load page-specific content
  if (page === "resources") {
    renderResources();
  }
}

// UI Update functions
function updateUI() {
  const user = AppState.user;

  if (user) {
    // Show authenticated UI
    hideElement("#auth-buttons");
    showElement("#user-menu");
    showElement("#main-nav");
    showElement("#user-badge");

    // Update user info
    $("#user-name").textContent = user.name;
    $("#user-email").textContent = user.email;
    $("#user-initial").textContent = user.name.charAt(0);
    $("#user-badge").textContent =
      user.role.charAt(0).toUpperCase() + user.role.slice(1);

    // Show/hide role-specific elements
    if (user.role === "lecturer") {
      showElement("#upload-nav");
      showElement("#upload-btn");
      $("#role-switch").textContent = "Switch to Student";
      $("#user-badge").className = "badge";
    } else {
      hideElement("#upload-nav");
      hideElement("#upload-btn");
      $("#role-switch").textContent = "Switch to Lecturer";
      $("#user-badge").className = "badge";
      $("#user-badge").style.background = "rgba(158, 163, 174, 0.2)";
      $("#user-badge").style.color = "#fafafa";
    }
  } else {
    // Show unauthenticated UI
    showElement("#auth-buttons");
    hideElement("#user-menu");
    hideElement("#main-nav");
    hideElement("#user-badge");
  }
}

// Dropdown functions
function toggleDropdown() {
  toggleElement("#dropdown-menu");
}

// Resources functions
function renderResources(filteredResources = null) {
  const resourcesGrid = $("#resources-grid");
  const resources = filteredResources || AppState.resources;

  resourcesGrid.innerHTML = "";

  resources.forEach((resource) => {
    const resourceCard = createResourceCard(resource);
    resourcesGrid.appendChild(resourceCard);
  });
}

function createResourceCard(resource) {
  const card = document.createElement("div");
  card.className = "resource-card";

  card.innerHTML = `
        <div class="resource-header">
            <div>
                <h3 class="resource-title">${resource.title}</h3>
                <span class="resource-category">${resource.category.toUpperCase()}</span>
            </div>
        </div>
        <p class="resource-description">${resource.description}</p>
        <div class="resource-meta">
            <span>By ${resource.author}</span>
            <span>${resource.downloads} downloads</span>
        </div>
        <div class="resource-actions">
            <button class="btn-secondary" onclick="downloadResource(${resource.id})">Download</button>
            <button class="btn-secondary" onclick="viewResource(${resource.id})">View Details</button>
        </div>
    `;

  return card;
}

function downloadResource(id) {
  const resource = AppState.resources.find((r) => r.id === id);
  if (resource) {
    resource.downloads++;
    showNotification(`Downloading "${resource.title}"...`, "success");
    // In a real app, this would trigger an actual download
  }
}

function viewResource(id) {
  const resource = AppState.resources.find((r) => r.id === id);
  if (resource) {
    showNotification(`Viewing "${resource.title}"`, "info");
    // In a real app, this would show a detailed view
  }
}

function searchResources() {
  const query = $("#search-input").value.toLowerCase();
  const category = $("#category-filter").value;

  let filtered = AppState.resources;

  if (query) {
    filtered = filtered.filter(
      (resource) =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query),
    );
  }

  if (category) {
    filtered = filtered.filter((resource) => resource.category === category);
  }

  renderResources(filtered);
}

// Upload functions
function handleUpload(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const file = formData.get("file");

  if (!title || !category) {
    showNotification("Please fill in all required fields", "error");
    return;
  }

  if (!file || file.size === 0) {
    showNotification("Please select a file to upload", "error");
    return;
  }

  // Simulate upload
  const newResource = {
    id: AppState.resources.length + 1,
    title,
    description: description || "No description provided",
    category,
    author: AppState.user.name,
    uploadDate: new Date().toISOString().split("T")[0],
    downloads: 0,
  };

  AppState.resources.unshift(newResource);
  showNotification("Resource uploaded successfully!", "success");

  // Reset form
  event.target.reset();

  // Navigate to resources page
  navigateToPage("resources");
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = $(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "1rem 1.5rem",
    borderRadius: "8px",
    color: "#fafafa",
    fontWeight: "500",
    zIndex: "1000",
    opacity: "0",
    transform: "translateY(-20px)",
    transition: "all 0.3s ease",
  });

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "#10b981";
      break;
    case "error":
      notification.style.background = "#ef4444";
      break;
    case "info":
    default:
      notification.style.background = "#3a45df";
      break;
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Check for stored user
  const storedUser = localStorage.getItem("academicHub_user");
  if (storedUser) {
    AppState.user = JSON.parse(storedUser);
  }

  // Initialize UI
  updateUI();

  // Modal close functionality
  $(".close").addEventListener("click", hideLogin);
  $("#auth-modal").addEventListener("click", function (e) {
    if (e.target === this) {
      hideLogin();
    }
  });

  // Login form
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = $("#email").value;
    const password = $("#password").value;
    login(email, password);
  });

  // Navigation links
  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.dataset.page;
      if (page) {
        navigateToPage(page);
      }
    });
  });

  // Search functionality
  $("#search-input").addEventListener("input", searchResources);
  $("#category-filter").addEventListener("change", searchResources);

  // Upload form
  $("#upload-form").addEventListener("submit", handleUpload);

  // File upload drag and drop
  const fileUpload = $(".file-upload");
  const fileInput = $("#file");

  fileUpload.addEventListener("click", () => fileInput.click());

  fileUpload.addEventListener("dragover", function (e) {
    e.preventDefault();
    this.style.borderColor = "#3a45df";
  });

  fileUpload.addEventListener("dragleave", function (e) {
    e.preventDefault();
    this.style.borderColor = "#212530";
  });

  fileUpload.addEventListener("drop", function (e) {
    e.preventDefault();
    this.style.borderColor = "#212530";

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      $(".file-upload-text p").textContent = `Selected: ${files[0].name}`;
    }
  });

  fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
      $(".file-upload-text p").textContent = `Selected: ${this.files[0].name}`;
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".dropdown")) {
      hideElement("#dropdown-menu");
    }
  });

  // Escape key to close modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideLogin();
      hideElement("#dropdown-menu");
    }
  });

  // Initialize resources if on resources page
  if (AppState.currentPage === "resources") {
    renderResources();
  }
});

// Expose functions to global scope for inline event handlers
window.showLogin = showLogin;
window.logout = logout;
window.switchRole = switchRole;
window.fillDemoCredentials = fillDemoCredentials;
window.togglePassword = togglePassword;
window.navigateToPage = navigateToPage;
window.toggleDropdown = toggleDropdown;
window.downloadResource = downloadResource;
window.viewResource = viewResource;
