// Global state management
const AppState = {
  user: null,
  currentPage: "dashboard",
  theme: localStorage.getItem("academicHub_theme") || "dark",
  currentAuthTab: "login",
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

// Modern utility functions with enhanced capabilities
function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

// Enhanced utility functions for modern interactions
function createRippleEffect(element, event) {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("div");
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    pointer-events: none;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    z-index: 1000;
  `;

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

function addLoadingState(element, duration = 2000) {
  const originalContent = element.innerHTML;
  element.innerHTML = '<div class="loading-spinner"></div> Loading...';
  element.disabled = true;

  setTimeout(() => {
    element.innerHTML = originalContent;
    element.disabled = false;
  }, duration);
}

function animateValue(element, start, end, duration = 1000) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = Math.floor(progress * (end - start) + start);
    element.textContent = current.toLocaleString();
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function showElement(element) {
  if (typeof element === "string") {
    element = $(element);
  }
  if (element) {
    element.style.display = "block";
    element.style.opacity = "0";
    element.style.transform = "translateY(10px)";

    requestAnimationFrame(() => {
      element.style.transition = "all 0.3s ease-out";
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    });
  }
}

function hideElement(element) {
  if (typeof element === "string") {
    element = $(element);
  }
  if (element) {
    element.style.transition = "all 0.3s ease-out";
    element.style.opacity = "0";
    element.style.transform = "translateY(-10px)";

    setTimeout(() => {
      element.style.display = "none";
    }, 300);
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
  const loginBtn = $(".auth-submit .btn-text");
  const loader = $(".auth-submit .btn-loader");
  const submitBtn = $(".auth-submit");

  // Show loading state
  loginBtn.style.opacity = "0";
  loader.style.display = "block";
  submitBtn.disabled = true;

  setTimeout(() => {
    const user = demoUsers.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      AppState.user = user;
      localStorage.setItem("academicHub_user", JSON.stringify(user));

      // Success feedback
      loginBtn.textContent = "Success!";
      loginBtn.style.opacity = "1";
      loader.style.display = "none";
      submitBtn.style.background = "var(--accent-success)";

      setTimeout(() => {
        updateUI();
        hideLogin();
        showNotification(`Welcome back, ${user.name}!`, "success");

        // Reset button
        loginBtn.textContent = "Sign In";
        submitBtn.style.background = "";
        submitBtn.disabled = false;

        // Animate dashboard elements on first load
        setTimeout(() => {
          animateDashboardStats();
        }, 500);
      }, 1000);
      return true;
    } else {
      // Error feedback
      loginBtn.textContent = "Invalid credentials";
      loginBtn.style.opacity = "1";
      loader.style.display = "none";
      submitBtn.style.background = "var(--accent-secondary)";

      // Add shake animation for error
      const modal = $(".modal-content");
      modal.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => (modal.style.animation = ""), 500);

      setTimeout(() => {
        loginBtn.textContent = "Sign In";
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 2000);

      showNotification("Invalid email or password", "error");
      return false;
    }
  }, 1500);
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
  const emailInput = $("#login-email");
  const passwordInput = $("#login-password");

  if (role === "student") {
    emailInput.value = "student@demo.com";
    passwordInput.value = "student123";
  } else {
    emailInput.value = "lecturer@demo.com";
    passwordInput.value = "lecturer123";
  }

  // Add visual feedback
  [emailInput, passwordInput].forEach((input) => {
    input.style.borderColor = "var(--accent-success)";
    setTimeout(() => {
      input.style.borderColor = "";
    }, 2000);
  });
}

function togglePassword(fieldId) {
  const field = $("#" + fieldId);
  const button = field.nextElementSibling;
  const eyeOpen = button.querySelector(".eye-open");
  const eyeClosed = button.querySelector(".eye-closed");

  if (field.type === "password") {
    field.type = "text";
    eyeOpen.style.display = "none";
    eyeClosed.style.display = "block";
  } else {
    field.type = "password";
    eyeOpen.style.display = "block";
    eyeClosed.style.display = "none";
  }

  // Add animation
  button.style.transform = "scale(0.9)";
  setTimeout(() => {
    button.style.transform = "";
  }, 150);
}

// Enhanced navigation with smooth transitions
function navigateToPage(page) {
  // Add loading animation
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = '<div class="loading-spinner"></div>';
  loader.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2000;
    color: var(--primary-500);
  `;
  document.body.appendChild(loader);

  // Hide current page with animation
  const currentPage = $(".page.active");
  if (currentPage) {
    currentPage.style.animation = "pageSlideOut 0.3s ease-in forwards";
  }

  setTimeout(() => {
    // Hide all pages
    $$(".page").forEach((p) => {
      p.classList.remove("active");
      p.style.animation = "";
    });

    // Show selected page
    const targetPage = $("#" + page + "-page");
    if (targetPage) {
      targetPage.classList.add("active");
      targetPage.style.animation = "pageSlideIn 0.3s ease-out forwards";
      AppState.currentPage = page;
    }

    // Update navigation with ripple effect
    $$(".nav-link").forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.page === page) {
        link.classList.add("active");
      }
    });

    // Load page-specific content
    if (page === "resources") {
      setTimeout(() => renderResources(), 100);
    }

    // Remove loader
    loader.remove();
  }, 150);
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
    const downloadBtn = event.target;
    const originalText = downloadBtn.textContent;

    // Add download animation
    downloadBtn.style.background = "var(--accent-success)";
    downloadBtn.innerHTML =
      '<div class="loading-spinner"></div> Downloading...';
    downloadBtn.disabled = true;

    setTimeout(() => {
      resource.downloads++;
      downloadBtn.innerHTML = "✓ Downloaded";
      downloadBtn.style.background = "var(--accent-success)";

      setTimeout(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.background = "";
        downloadBtn.disabled = false;
      }, 2000);

      showNotification(
        `"${resource.title}" downloaded successfully!`,
        "success",
      );
      renderResources(); // Refresh to show updated download count
    }, 1500);
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
  const sortBy = $("#sort-filter").value;
  const clearBtn = $("#search-clear");

  // Show/hide clear button
  if (query) {
    clearBtn.style.display = "block";
  } else {
    clearBtn.style.display = "none";
  }

  let filtered = [...AppState.resources];

  // Filter by search query
  if (query) {
    filtered = filtered.filter(
      (resource) =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.author.toLowerCase().includes(query),
    );
  }

  // Filter by category
  if (category) {
    filtered = filtered.filter((resource) => resource.category === category);
  }

  // Sort results
  switch (sortBy) {
    case "popular":
      filtered.sort((a, b) => b.downloads - a.downloads);
      break;
    case "recent":
      filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
      break;
    case "rating":
      // Simulate rating system
      filtered.sort(() => Math.random() - 0.5);
      break;
    case "downloads":
      filtered.sort((a, b) => b.downloads - a.downloads);
      break;
  }

  renderResources(filtered);

  // Show search results count
  updateSearchResults(filtered.length, AppState.resources.length);
}

function clearSearch() {
  $("#search-input").value = "";
  $("#search-clear").style.display = "none";
  searchResources();
}

function updateSearchResults(found, total) {
  const existingResult = $(".search-results");
  if (existingResult) existingResult.remove();

  const resultElement = document.createElement("div");
  resultElement.className = "search-results";
  resultElement.innerHTML = `
    <p>Showing ${found} of ${total} resources</p>
  `;
  resultElement.style.cssText = `
    margin: var(--space-4) 0;
    color: var(--neutral-400);
    font-size: var(--font-size-sm);
    text-align: center;
  `;

  const resourcesGrid = $("#resources-grid");
  resourcesGrid.parentNode.insertBefore(resultElement, resourcesGrid);
}

function showAnalytics() {
  showNotification("Analytics dashboard coming soon!", "info");

  // Simulate analytics modal
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content analytics-modal">
      <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2>Analytics Dashboard</h2>
      <div class="analytics-grid">
        <div class="analytics-chart">
          <h3>Resource Views</h3>
          <div class="chart-placeholder">📊 Chart visualization</div>
        </div>
        <div class="analytics-chart">
          <h3>Download Trends</h3>
          <div class="chart-placeholder">📈 Trend analysis</div>
        </div>
        <div class="analytics-chart">
          <h3>User Engagement</h3>
          <div class="chart-placeholder">👥 Engagement metrics</div>
        </div>
      </div>
    </div>
  `;

  // Add analytics modal styles
  const style = document.createElement("style");
  style.textContent = `
    .analytics-modal {
      max-width: 800px;
      width: 90vw;
    }
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-4);
      margin-top: var(--space-6);
    }
    .analytics-chart {
      background: var(--glass-bg);
      padding: var(--space-4);
      border-radius: var(--radius-lg);
      border: 1px solid var(--glass-border);
    }
    .chart-placeholder {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-hover);
      border-radius: var(--radius-md);
      margin-top: var(--space-2);
      font-size: var(--font-size-lg);
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(modal);
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
  const closeBtn = $(".close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", hideLogin);
  }

  const authModal = $("#auth-modal");
  if (authModal) {
    authModal.addEventListener("click", function (e) {
      if (e.target === this) {
        hideLogin();
      }
    });
  }

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

  // Enhanced search functionality
  const searchInput = $("#search-input");
  if (searchInput) {
    searchInput.addEventListener("input", searchResources);
  }

  const categoryFilter = $("#category-filter");
  if (categoryFilter) {
    categoryFilter.addEventListener("change", searchResources);
  }

  const sortFilter = $("#sort-filter");
  if (sortFilter) {
    sortFilter.addEventListener("change", searchResources);
  }

  const searchClear = $("#search-clear");
  if (searchClear) {
    searchClear.addEventListener("click", clearSearch);
  }

  // Search on enter key
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        searchResources();
      }
    });
  }

  // Enhanced search button
  const searchBtn = $(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      searchResources();

      // Add search animation
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  }

  // Upload form
  const uploadForm = $("#upload-form");
  if (uploadForm) {
    uploadForm.addEventListener("submit", handleUpload);
  }

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

  // Initialize theme
  initializeTheme();

  // Signup form
  const signupForm = $("#signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (validateForm("#signupForm")) {
        const formData = new FormData(this);
        const userData = {
          firstname: formData.get("firstname"),
          lastname: formData.get("lastname"),
          email: formData.get("email"),
          role: formData.get("role"),
          password: formData.get("password"),
        };

        // Simulate signup process
        const submitBtn = this.querySelector(".auth-submit");
        const btnText = submitBtn.querySelector(".btn-text");
        const loader = submitBtn.querySelector(".btn-loader");

        btnText.style.opacity = "0";
        loader.style.display = "block";
        submitBtn.disabled = true;

        setTimeout(() => {
          btnText.textContent = "Account Created!";
          btnText.style.opacity = "1";
          loader.style.display = "none";
          submitBtn.style.background = "var(--accent-success)";

          setTimeout(() => {
            showNotification(
              "Account created successfully! Please check your email.",
              "success",
            );
            switchAuthTab("login");

            // Reset form
            this.reset();
            btnText.textContent = "Create Account";
            submitBtn.style.background = "";
            submitBtn.disabled = false;
          }, 1500);
        }, 2000);
      }
    });
  }

  // Password strength checking
  const signupPassword = $("#signup-password");
  if (signupPassword) {
    signupPassword.addEventListener("input", function () {
      updatePasswordStrength("#signup-password");
    });
  }

  // Real-time validation
  $$('input[type="email"]').forEach((input) => {
    input.addEventListener("blur", function () {
      const feedback = this.parentElement.querySelector(".input-feedback");
      if (feedback && this.value) {
        if (validateEmail(this.value)) {
          feedback.textContent = "✓ Valid email";
          feedback.className = "input-feedback success";
          this.style.borderColor = "#10b981";
        } else {
          feedback.textContent = "Please enter a valid email";
          feedback.className = "input-feedback error";
          this.style.borderColor = "#ef4444";
        }
      }
    });
  });

  // Initialize resources if on resources page
  if (AppState.currentPage === "resources") {
    renderResources();
  }

  // Add interactive effects
  addInteractiveEffects();

  // Add parallax effect (disabled on mobile for performance)
  if (window.innerWidth > 768) {
    addParallaxEffect();
  }

  // Animate dashboard on initial load if user is logged in
  if (AppState.user && AppState.currentPage === "dashboard") {
    setTimeout(() => {
      animateDashboardStats();
    }, 500);
  }
});

// Dashboard animations
function animateDashboardStats() {
  const statCards = $$(".stat-card");
  const statNumbers = $$(".stat-number");

  statCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.animation = "fadeInUp 0.6s ease-out forwards";
      card.style.opacity = "0";

      setTimeout(() => {
        card.style.opacity = "1";
      }, 100);
    }, index * 150);
  });

  // Animate numbers counting up
  setTimeout(() => {
    const numbers = [24, 156, 1247, 4.8];
    statNumbers.forEach((element, index) => {
      const endValue = numbers[index];
      animateValue(element, 0, endValue, 1500);
    });
  }, 500);

  // Animate activity items
  setTimeout(() => {
    const activityItems = $$(".activity-item");
    activityItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.animation = "slideInRight 0.5s ease-out forwards";
      }, index * 100);
    });
  }, 1000);
}

// Enhanced interactions
function addInteractiveEffects() {
  // Add ripple effect to buttons
  $$("button, .btn-primary, .btn-secondary, .btn-ghost").forEach((button) => {
    button.addEventListener("click", function (e) {
      if (!this.disabled) {
        createRippleEffect(this, e);
      }
    });
  });

  // Add hover sound effect (visual feedback)
  $$(".nav-link, .action-btn, .resource-card").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    element.addEventListener("mouseleave", function () {
      this.style.transform = "";
    });
  });

  // Enhanced form validation feedback
  $$("input, textarea, select").forEach((input) => {
    input.addEventListener("invalid", function () {
      this.style.animation = "shake 0.5s ease-in-out";
      setTimeout(() => (this.style.animation = ""), 500);
    });

    input.addEventListener("input", function () {
      if (this.validity.valid) {
        this.style.borderColor = "var(--accent-success)";
      } else {
        this.style.borderColor = "";
      }
    });
  });
}

// Parallax scrolling effect
function addParallaxEffect() {
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = $$(".stat-card, .card");

    parallaxElements.forEach((element, index) => {
      const speed = 0.5 + index * 0.1;
      const yPos = -((scrolled * speed) / 10);
      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
}

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
// Authentication tab switching
function switchAuthTab(tab) {
  AppState.currentAuthTab = tab;

  // Update tab buttons
  $$(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.tab === tab) {
      btn.classList.add("active");
    }
  });

  // Update tab content
  $$(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  const targetTab = $(`#${tab}-tab`);
  if (targetTab) {
    targetTab.classList.add("active");
  }

  // Update header text
  const title = $("#auth-title");
  const subtitle = $("#auth-subtitle");

  if (tab === "login") {
    if (title) title.textContent = "Welcome Back";
    if (subtitle)
      subtitle.textContent = "Access your personalized learning dashboard";
  } else {
    if (title) title.textContent = "Join AcademicHub";
    if (subtitle)
      subtitle.textContent = "Create your account and start learning today";
  }
}

// Theme management
function initializeTheme() {
  const savedTheme = localStorage.getItem("academicHub_theme") || "dark";
  AppState.theme = savedTheme;
  document.body.classList.toggle("light-mode", savedTheme === "light");
  updateThemeIcon();
}

function toggleTheme() {
  AppState.theme = AppState.theme === "dark" ? "light" : "dark";
  localStorage.setItem("academicHub_theme", AppState.theme);
  document.body.classList.toggle("light-mode", AppState.theme === "light");
  updateThemeIcon();

  // Add transition effect
  document.body.style.transition = "all 0.3s ease";
  setTimeout(() => {
    document.body.style.transition = "";
  }, 300);
}

function updateThemeIcon() {
  const sunIcon = $(".sun-icon");
  const moonIcon = $(".moon-icon");

  if (AppState.theme === "light") {
    if (sunIcon) sunIcon.style.opacity = "0";
    if (moonIcon) moonIcon.style.opacity = "1";
  } else {
    if (sunIcon) sunIcon.style.opacity = "1";
    if (moonIcon) moonIcon.style.opacity = "0";
  }
}

// Social login simulation
function socialLogin(provider) {
  showNotification(
    `${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`,
    "info",
  );
}

// Additional modal functions
function showForgotPassword() {
  showNotification("Password reset functionality coming soon!", "info");
}

function showTerms() {
  showNotification("Terms of Service modal coming soon!", "info");
}

function showPrivacy() {
  showNotification("Privacy Policy modal coming soon!", "info");
}

// Password strength checker
function checkPasswordStrength(password) {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  strength = Object.values(checks).filter(Boolean).length;

  const strengthLevels = ["weak", "weak", "fair", "good", "strong"];
  return {
    score: strength,
    level: strengthLevels[Math.min(strength, 4)],
    checks,
  };
}

function updatePasswordStrength(inputId) {
  const input = $(inputId);
  const strengthBar =
    input?.parentElement?.nextElementSibling?.querySelector(".strength-fill");
  const strengthText =
    input?.parentElement?.nextElementSibling?.querySelector(".strength-text");

  if (!input || !strengthBar || !strengthText) return;

  const result = checkPasswordStrength(input.value);

  // Update bar
  strengthBar.className = `strength-fill ${result.level}`;

  // Update text
  strengthText.className = `strength-text ${result.level}`;
  strengthText.textContent =
    result.level === "weak"
      ? "Weak password"
      : result.level === "fair"
        ? "Fair password"
        : result.level === "good"
          ? "Good password"
          : result.level === "strong"
            ? "Strong password"
            : "Password strength";
}

// Enhanced form validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateForm(formId) {
  const form = $(formId);
  if (!form) return false;

  let isValid = true;
  const inputs = form.querySelectorAll("input[required], select[required]");

  inputs.forEach((input) => {
    const feedback = input.parentElement.querySelector(".input-feedback");
    if (!feedback) return;

    let message = "";
    let type = "";

    if (!input.value.trim()) {
      message = "This field is required";
      type = "error";
      isValid = false;
    } else if (input.type === "email" && !validateEmail(input.value)) {
      message = "Please enter a valid email address";
      type = "error";
      isValid = false;
    } else if (input.id === "signup-confirm-password") {
      const password = $("#signup-password")?.value;
      if (input.value !== password) {
        message = "Passwords do not match";
        type = "error";
        isValid = false;
      }
    }

    if (message) {
      feedback.textContent = message;
      feedback.className = `input-feedback ${type}`;
      input.style.borderColor = type === "error" ? "#ef4444" : "#10b981";
    } else {
      feedback.textContent = "";
      feedback.className = "input-feedback";
      input.style.borderColor = "";
    }
  });

  return isValid;
}

window.animateDashboardStats = animateDashboardStats;
window.showAnalytics = showAnalytics;
window.clearSearch = clearSearch;
window.switchAuthTab = switchAuthTab;
window.toggleTheme = toggleTheme;
window.socialLogin = socialLogin;
window.showForgotPassword = showForgotPassword;
window.showTerms = showTerms;
window.showPrivacy = showPrivacy;
