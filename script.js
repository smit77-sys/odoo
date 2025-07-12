// SkillSwap Platform - JavaScript Implementation

// Global Variables
let currentUser = null
let isAdmin = false
let users = []
let skills = []
let swapRequests = []
let ratings = []
const locations = ["Remote", "New York", "London", "Tokyo", "Berlin", "Sydney", "Paris"]
const popularSkills = [
  "Graphic Design",
  "Web Development",
  "Spanish",
  "Photography",
  "Cooking",
  "Excel",
  "Photoshop",
  "Yoga",
  "Marketing",
  "Writing",
]

// DOM Elements
const views = {
  home: document.getElementById("home-view"),
  browse: document.getElementById("browse-view"),
  swaps: document.getElementById("swaps-view"),
  profile: document.getElementById("profile-view"),
  admin: document.getElementById("admin-view"),
}

const navLinks = {
  home: document.getElementById("nav-home"),
  browse: document.getElementById("nav-browse"),
  swaps: document.getElementById("nav-swaps"),
  profile: document.getElementById("nav-profile"),
  admin: document.getElementById("nav-admin"),
}

const modals = {
  login: document.getElementById("login-modal"),
  signup: document.getElementById("signup-modal"),
  swap: document.getElementById("swap-modal"),
  rating: document.getElementById("rating-modal"),
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Load sample data
  loadSampleData()

  // Set up event listeners
  setupEventListeners()

  // Show home view by default
  showView("home")

  // Check if user is logged in (for demo purposes)
  checkLoginStatus()

  // Initialize UI components
  initUIComponents()

  // Show floating skills animation on first visit
  showFloatingSkills()
})

// Show floating skills animation
function showFloatingSkills() {
  const floatingContainer = document.getElementById("floating-skills")
  if (floatingContainer) {
    floatingContainer.classList.add("active")

    // Hide after 5 seconds
    setTimeout(() => {
      floatingContainer.classList.remove("active")
    }, 5000)

    // Add click handlers to floating skills
    const floatingSkills = document.querySelectorAll(".floating-skill")
    floatingSkills.forEach((skill) => {
      skill.addEventListener("click", () => {
        const skillName = skill.getAttribute("data-skill")
        document.getElementById("skill-search").value = skillName
        showView("browse")
        renderBrowseView()
        floatingContainer.classList.remove("active")
      })
    })
  }
}

// Password strength checker
function checkPasswordStrength(password) {
  // Reset indicators
  const strengthIndicator = document.getElementById("strength-indicator")
  const strengthText = document.getElementById("strength-text")

  if (!strengthIndicator || !strengthText) return

  strengthIndicator.className = "strength-indicator"
  strengthText.textContent = ""

  if (!password) return

  let strength = 0

  // Length check
  if (password.length > 7) strength++
  if (password.length > 11) strength++

  // Character variety checks
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (password.length < 8) {
    strengthIndicator.className = "strength-indicator strength-weak"
    strengthText.textContent = "Too short"
    strengthText.style.color = "#ff7675"
  } else if (strength < 3) {
    strengthIndicator.className = "strength-indicator strength-weak"
    strengthText.textContent = "Weak"
    strengthText.style.color = "#ff7675"
  } else if (strength < 5) {
    strengthIndicator.className = "strength-indicator strength-medium"
    strengthText.textContent = "Medium"
    strengthText.style.color = "#fdcb6e"
  } else {
    strengthIndicator.className = "strength-indicator strength-strong"
    strengthText.textContent = "Strong"
    strengthText.style.color = "#00b894"
  }
}

// Enhanced signup validation
function validateSignupForm() {
  const name = document.getElementById("signup-name").value.trim()
  const email = document.getElementById("signup-email").value.trim()
  const password = document.getElementById("signup-password").value
  const confirmPassword = document.getElementById("signup-confirm-password").value

  // Reset errors
  document.querySelectorAll(".error-message").forEach((el) => {
    el.style.display = "none"
  })

  let isValid = true

  // Name validation
  if (!name) {
    const nameError = document.getElementById("name-error")
    if (nameError) nameError.style.display = "block"
    isValid = false
  }

  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const emailError = document.getElementById("email-error")
    if (emailError) emailError.style.display = "block"
    isValid = false
  }

  // Password validation
  const passwordError = document.getElementById("password-error")
  if (passwordError) {
    if (password.length < 8) {
      passwordError.textContent = "Password must be at least 8 characters"
      passwordError.style.display = "block"
      isValid = false
    } else if (!/[A-Z]/.test(password)) {
      passwordError.textContent = "Password must contain at least one uppercase letter"
      passwordError.style.display = "block"
      isValid = false
    } else if (!/[0-9]/.test(password)) {
      passwordError.textContent = "Password must contain at least one number"
      passwordError.style.display = "block"
      isValid = false
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      passwordError.textContent = "Password must contain at least one special character"
      passwordError.style.display = "block"
      isValid = false
    }
  }

  // Confirm password
  if (password !== confirmPassword) {
    const confirmPasswordError = document.getElementById("confirm-password-error")
    if (confirmPasswordError) confirmPasswordError.style.display = "block"
    isValid = false
  }

  return isValid
}

// Load sample data for demonstration
function loadSampleData() {
  // Sample users
  users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      location: "New York",
      profilePhoto: "https://randomuser.me/api/portraits/men/32.jpg",
      isPublic: true,
      offeredSkills: ["Web Development", "JavaScript", "React"],
      wantedSkills: ["Graphic Design", "Photography"],
      availability: ["weekends", "evenings"],
      isAdmin: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      location: "London",
      profilePhoto: "https://randomuser.me/api/portraits/women/44.jpg",
      isPublic: true,
      offeredSkills: ["Graphic Design", "Photoshop", "Illustrator"],
      wantedSkills: ["Web Development", "Spanish"],
      availability: ["weekdays", "evenings"],
      isAdmin: false,
    },
    {
      id: 3,
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      location: "Remote",
      profilePhoto: "https://randomuser.me/api/portraits/men/75.jpg",
      isPublic: false,
      offeredSkills: ["Project Management", "Coaching"],
      wantedSkills: ["Data Analysis", "Machine Learning"],
      availability: ["weekdays"],
      isAdmin: true,
    },
  ]

  // Generate more sample users
  for (let i = 4; i <= 20; i++) {
    users.push({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: `password${i}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      profilePhoto: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 100)}.jpg`,
      isPublic: Math.random() > 0.3,
      offeredSkills: getRandomSkills(2, 4),
      wantedSkills: getRandomSkills(2, 4),
      availability: getRandomAvailability(),
      isAdmin: false,
    })
  }

  // Sample swap requests
  swapRequests = [
    {
      id: 1,
      fromUserId: 1,
      toUserId: 2,
      offeredSkill: "Web Development",
      wantedSkill: "Graphic Design",
      message: "I can help you with web development in exchange for graphic design lessons.",
      status: "pending",
      createdAt: new Date("2023-05-15"),
    },
    {
      id: 2,
      fromUserId: 2,
      toUserId: 1,
      offeredSkill: "Photoshop",
      wantedSkill: "JavaScript",
      message: "I can teach you Photoshop basics if you help me with JavaScript.",
      status: "accepted",
      createdAt: new Date("2023-05-10"),
    },
    {
      id: 3,
      fromUserId: 1,
      toUserId: 3,
      offeredSkill: "React",
      wantedSkill: "Data Analysis",
      message: "Looking to learn data analysis in exchange for React tutoring.",
      status: "completed",
      createdAt: new Date("2023-04-20"),
      completedAt: new Date("2023-05-01"),
    },
  ]

  // Sample ratings
  ratings = [
    {
      id: 1,
      swapId: 3,
      fromUserId: 1,
      toUserId: 3,
      rating: 5,
      comment: "Great teacher! Learned a lot about data analysis.",
      createdAt: new Date("2023-05-02"),
    },
    {
      id: 2,
      swapId: 3,
      fromUserId: 3,
      toUserId: 1,
      rating: 4,
      comment: "Very knowledgeable about React.",
      createdAt: new Date("2023-05-02"),
    },
  ]

  // Extract all unique skills from users
  const allSkills = new Set()
  users.forEach((user) => {
    user.offeredSkills.forEach((skill) => allSkills.add(skill))
    user.wantedSkills.forEach((skill) => allSkills.add(skill))
  })
  skills = Array.from(allSkills)
}

// Helper function to get random skills
function getRandomSkills(min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min
  const shuffled = [...popularSkills].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Helper function to get random availability
function getRandomAvailability() {
  const options = ["weekends", "evenings", "weekdays"]
  const count = Math.floor(Math.random() * 3) + 1
  const shuffled = [...options].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Set up all event listeners
function setupEventListeners() {
  // Navigation links
  if (navLinks.home) {
    navLinks.home.addEventListener("click", (e) => {
      e.preventDefault()
      showView("home")
    })
  }

  if (navLinks.browse) {
    navLinks.browse.addEventListener("click", (e) => {
      e.preventDefault()
      showView("browse")
      renderBrowseView()
    })
  }

  if (navLinks.swaps) {
    navLinks.swaps.addEventListener("click", (e) => {
      e.preventDefault()
      showView("swaps")
      renderSwapsView()
    })
  }

  if (navLinks.profile) {
    navLinks.profile.addEventListener("click", (e) => {
      e.preventDefault()
      showView("profile")
      renderProfileView()
    })
  }

  if (navLinks.admin) {
    navLinks.admin.addEventListener("click", (e) => {
      e.preventDefault()
      showView("admin")
      renderAdminView()
    })
  }

  // User profile button
  const userProfileBtn = document.getElementById("user-profile-btn")
  if (userProfileBtn) {
    userProfileBtn.addEventListener("click", (e) => {
      e.preventDefault()
      if (currentUser) {
        showView("profile")
        renderProfileView()
      } else {
        openModal("login")
      }
    })
  }

  // Auth buttons
  const loginBtn = document.getElementById("login-btn")
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      openModal("login")
    })
  }

  const signupBtn = document.getElementById("signup-btn")
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      openModal("signup")
    })
  }

  const getStartedBtn = document.getElementById("get-started-btn")
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      openModal("signup")
    })
  }

  // Modal close buttons
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", closeAllModals)
  })

  // Auth forms
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup)
  }

  const showSignupLink = document.getElementById("show-signup-link")
  if (showSignupLink) {
    showSignupLink.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllModals()
      openModal("signup")
    })
  }

  const showLoginLink = document.getElementById("show-login-link")
  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault()
      closeAllModals()
      openModal("login")
    })
  }

  // Password strength checking
  const signupPassword = document.getElementById("signup-password")
  if (signupPassword) {
    signupPassword.addEventListener("input", function () {
      checkPasswordStrength(this.value)
    })
  }

  // Profile actions
  const toggleStatusBtn = document.getElementById("toggle-status-btn")
  if (toggleStatusBtn) {
    toggleStatusBtn.addEventListener("click", toggleProfileStatus)
  }

  const addOfferedSkillBtn = document.getElementById("add-offered-skill")
  if (addOfferedSkillBtn) {
    addOfferedSkillBtn.addEventListener("click", addOfferedSkill)
  }

  const addWantedSkillBtn = document.getElementById("add-wanted-skill")
  if (addWantedSkillBtn) {
    addWantedSkillBtn.addEventListener("click", addWantedSkill)
  }

  const changePhotoBtn = document.getElementById("change-photo-btn")
  const photoUpload = document.getElementById("photo-upload")
  if (changePhotoBtn && photoUpload) {
    changePhotoBtn.addEventListener("click", () => {
      photoUpload.click()
    })
    photoUpload.addEventListener("change", handlePhotoUpload)
  }

  // Browse view actions
  const searchBtn = document.getElementById("search-btn")
  if (searchBtn) {
    searchBtn.addEventListener("click", renderBrowseView)
  }

  const skillSearch = document.getElementById("skill-search")
  if (skillSearch) {
    skillSearch.addEventListener("keyup", (e) => {
      if (e.key === "Enter") renderBrowseView()
    })
  }

  const resetFilters = document.getElementById("reset-filters")
  if (resetFilters) {
    resetFilters.addEventListener("click", resetFiltersHandler)
  }

  // Swaps view actions
  document.querySelectorAll(".swaps-tabs .tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tab = e.target.getAttribute("data-tab")
      switchSwapsTab(tab)
    })
  })

  // Admin view actions
  document.querySelectorAll(".admin-tabs .tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tab = e.target.getAttribute("data-tab")
      switchAdminTab(tab)
    })
  })

  const adminSearchBtn = document.getElementById("admin-search-btn")
  if (adminSearchBtn) {
    adminSearchBtn.addEventListener("click", renderAdminUsers)
  }

  const exportUsersBtn = document.getElementById("export-users-btn")
  if (exportUsersBtn) {
    exportUsersBtn.addEventListener("click", exportUserData)
  }

  const sendMessageBtn = document.getElementById("send-message-btn")
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", sendPlatformMessage)
  }

  const generateReportBtn = document.getElementById("generate-report-btn")
  if (generateReportBtn) {
    generateReportBtn.addEventListener("click", generateReport)
  }

  const downloadReportBtn = document.getElementById("download-report-btn")
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener("click", downloadReport)
  }

  // Click outside modal to close
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeAllModals()
    }
  })

  // Availability checkboxes
  const availabilityCheckboxes = ["weekends-availability", "evenings-availability", "weekdays-availability"]
  availabilityCheckboxes.forEach((id) => {
    const checkbox = document.getElementById(id)
    if (checkbox) {
      checkbox.addEventListener("change", updateAvailability)
    }
  })
}

// View management
function showView(viewName) {
  // Hide all views
  Object.values(views).forEach((view) => {
    if (view) view.style.display = "none"
  })

  // Deactivate all nav links
  Object.values(navLinks).forEach((link) => {
    if (link) link.classList.remove("active")
  })

  // Show selected view and activate nav link
  if (views[viewName]) {
    views[viewName].style.display = "block"
  }
  if (navLinks[viewName]) {
    navLinks[viewName].classList.add("active")
  }

  // Special handling for certain views
  if (viewName === "home") {
    renderHomeView()
  }
}

// Modal management
function openModal(modalName) {
  closeAllModals()
  if (modals[modalName]) {
    modals[modalName].style.display = "block"
  }
}

function closeAllModals() {
  Object.values(modals).forEach((modal) => {
    if (modal) modal.style.display = "none"
  })
}

// Check login status (for demo purposes)
function checkLoginStatus() {
  // For demo, we'll consider no one logged in initially
  updateAuthUI()
}

// Update UI based on authentication status
function updateAuthUI() {
  const loginBtn = document.getElementById("login-btn")
  const signupBtn = document.getElementById("signup-btn")
  const userProfileBtn = document.getElementById("user-profile-btn")
  const navAdmin = document.getElementById("nav-admin")

  if (currentUser) {
    if (loginBtn) loginBtn.style.display = "none"
    if (signupBtn) signupBtn.style.display = "none"
    if (userProfileBtn) {
      userProfileBtn.style.display = "block"
      const img = userProfileBtn.querySelector("img")
      if (img) {
        img.src = currentUser.profilePhoto
        img.alt = currentUser.name
      }
    }

    if (currentUser.isAdmin) {
      if (navAdmin) navAdmin.style.display = "block"
      isAdmin = true
    } else {
      if (navAdmin) navAdmin.style.display = "none"
      isAdmin = false
    }
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block"
    if (signupBtn) signupBtn.style.display = "inline-block"
    if (userProfileBtn) userProfileBtn.style.display = "none"
    if (navAdmin) navAdmin.style.display = "none"
    isAdmin = false
  }
}

// Authentication handlers
function handleLogin(e) {
  e.preventDefault()

  const emailInput = document.getElementById("login-email")
  const passwordInput = document.getElementById("login-password")

  if (!emailInput || !passwordInput) return

  const email = emailInput.value
  const password = passwordInput.value

  // Find user
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    currentUser = user
    updateAuthUI()
    closeAllModals()
    showView("home")
    renderHomeView()
    showToast("Welcome back!", "success")
  } else {
    showToast("Invalid email or password", "error")
  }
}

function handleSignup(e) {
  e.preventDefault()

  if (!validateSignupForm()) {
    return
  }

  const nameInput = document.getElementById("signup-name")
  const emailInput = document.getElementById("signup-email")
  const passwordInput = document.getElementById("signup-password")

  if (!nameInput || !emailInput || !passwordInput) return

  const name = nameInput.value
  const email = emailInput.value
  const password = passwordInput.value

  if (users.some((u) => u.email === email)) {
    showToast("Email already in use", "error")
    return
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    location: "",
    profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
    isPublic: false,
    offeredSkills: [],
    wantedSkills: [],
    availability: [],
    isAdmin: false,
  }

  users.push(newUser)
  currentUser = newUser
  updateAuthUI()
  closeAllModals()
  showView("profile")
  renderProfileView()
  showToast("Account created successfully!", "success")
}

// Profile view functions
function renderProfileView() {
  if (!currentUser) {
    showView("home")
    return
  }

  // Basic info
  const profileName = document.getElementById("profile-name")
  const profilePic = document.getElementById("profile-pic")

  if (profileName) profileName.textContent = currentUser.name
  if (profilePic) profilePic.src = currentUser.profilePhoto

  // Location
  const locationText = document.getElementById("location-text")
  if (locationText) {
    locationText.textContent = currentUser.location || "Not specified"
  }

  // Profile status
  const statusBadge = document.getElementById("profile-status")
  const toggleBtn = document.getElementById("toggle-status-btn")

  if (statusBadge && toggleBtn) {
    if (currentUser.isPublic) {
      statusBadge.textContent = "Public"
      statusBadge.className = "status-badge status-public"
      toggleBtn.textContent = "Make Private"
    } else {
      statusBadge.textContent = "Private"
      statusBadge.className = "status-badge status-private"
      toggleBtn.textContent = "Make Public"
    }
  }

  // Offered skills
  renderSkillsList("offered-skills", currentUser.offeredSkills, true)

  // Wanted skills
  renderSkillsList("wanted-skills", currentUser.wantedSkills, true)

  // Availability
  const weekendsAvailability = document.getElementById("weekends-availability")
  const eveningsAvailability = document.getElementById("evenings-availability")
  const weekdaysAvailability = document.getElementById("weekdays-availability")

  if (weekendsAvailability) weekendsAvailability.checked = currentUser.availability.includes("weekends")
  if (eveningsAvailability) eveningsAvailability.checked = currentUser.availability.includes("evenings")
  if (weekdaysAvailability) weekdaysAvailability.checked = currentUser.availability.includes("weekdays")

  // Ratings
  renderUserRatings()
}

function renderSkillsList(containerId, skillsList, editable = false) {
  const container = document.getElementById(containerId)
  if (!container) return

  container.innerHTML = ""

  if (skillsList.length === 0) {
    container.innerHTML = '<p class="no-skills">No skills added yet</p>'
    return
  }

  skillsList.forEach((skill) => {
    const skillItem = document.createElement("div")
    skillItem.className = "skill-item"
    skillItem.innerHTML = `
            <span>${skill}</span>
            ${editable ? '<button class="remove-skill" data-skill="' + skill + '">&times;</button>' : ""}
        `
    container.appendChild(skillItem)
  })

  // Add event listeners to remove buttons
  if (editable) {
    container.querySelectorAll(".remove-skill").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const skill = e.target.getAttribute("data-skill")
        removeSkill(containerId, skill)
      })
    })
  }
}

function removeSkill(containerId, skill) {
  if (containerId === "offered-skills") {
    currentUser.offeredSkills = currentUser.offeredSkills.filter((s) => s !== skill)
  } else {
    currentUser.wantedSkills = currentUser.wantedSkills.filter((s) => s !== skill)
  }

  // Update in users array
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
  }

  renderProfileView()
  showToast("Skill added!", "success")
}

function toggleProfileStatus() {
  if (!currentUser) return

  currentUser.isPublic = !currentUser.isPublic

  // Update in users array
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
  }

  renderProfileView()
  showToast(`Profile is now ${currentUser.isPublic ? "public" : "private"}`, "info")
}

function addOfferedSkill() {
  const input = document.getElementById("new-offered-skill")
  if (!input || !currentUser) return

  const skill = input.value.trim()

  if (skill && !currentUser.offeredSkills.includes(skill)) {
    currentUser.offeredSkills.push(skill)

    // Update in users array
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
    }

    input.value = ""
    renderProfileView()
    showToast("Skill added!", "success")
  }
}

function addWantedSkill() {
  const input = document.getElementById("new-wanted-skill")
  if (!input || !currentUser) return

  const skill = input.value.trim()

  if (skill && !currentUser.wantedSkills.includes(skill)) {
    currentUser.wantedSkills.push(skill)

    // Update in users array
    const userIndex = users.findIndex((u) => u.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = currentUser
    }

    input.value = ""
    renderProfileView()
    showToast("Skill added!", "success")
  }
}

function handlePhotoUpload(e) {
  const file = e.target.files[0]
  if (file && currentUser) {
    const reader = new FileReader()
    reader.onload = (event) => {
      currentUser.profilePhoto = event.target.result

      // Update in users array
      const userIndex = users.findIndex((u) => u.id === currentUser.id)
      if (userIndex !== -1) {
        users[userIndex] = currentUser
      }

      // Update profile picture in UI
      const profilePic = document.getElementById("profile-pic")
      const profilePicSmall = document.querySelector(".profile-pic-small")

      if (profilePic) profilePic.src = event.target.result
      if (profilePicSmall) profilePicSmall.src = event.target.result

      showToast("Profile photo updated!", "success")
    }
    reader.readAsDataURL(file)
  }
}

function updateAvailability() {
  if (!currentUser) return

  const availability = []

  const weekends = document.getElementById("weekends-availability")
  const evenings = document.getElementById("evenings-availability")
  const weekdays = document.getElementById("weekdays-availability")

  if (weekends && weekends.checked) availability.push("weekends")
  if (evenings && evenings.checked) availability.push("evenings")
  if (weekdays && weekdays.checked) availability.push("weekdays")

  currentUser.availability = availability

  // Update in users array
  const userIndex = users.findIndex((u) => u.id === currentUser.id)
  if (userIndex !== -1) {
    users[userIndex] = currentUser
  }
}

function renderUserRatings() {
  const container = document.getElementById("user-ratings")
  if (!container || !currentUser) return

  container.innerHTML = ""

  // Get ratings for current user
  const userRatings = ratings.filter((r) => r.toUserId === currentUser.id)

  if (userRatings.length === 0) {
    container.innerHTML = "<p>No ratings yet</p>"
    return
  }

  userRatings.forEach((rating) => {
    const fromUser = users.find((u) => u.id === rating.fromUserId)
    const swap = swapRequests.find((s) => s.id === rating.swapId)

    if (!fromUser) return

    const ratingElement = document.createElement("div")
    ratingElement.className = "rating"
    ratingElement.innerHTML = `
            <div class="rating-stars">
                ${"★".repeat(rating.rating)}${"☆".repeat(5 - rating.rating)}
            </div>
            <div class="rating-user">From ${fromUser.name}</div>
            <div class="rating-skill">For ${swap ? swap.offeredSkill : "a skill swap"}</div>
            <div class="rating-comment">"${rating.comment}"</div>
        `
    container.appendChild(ratingElement)
  })
}

// Home view functions
function renderHomeView() {
  renderPopularSkills()
}

function renderPopularSkills() {
  const container = document.getElementById("popular-skills")
  if (!container) return

  container.innerHTML = ""

  popularSkills.forEach((skill) => {
    const skillCard = document.createElement("div")
    skillCard.className = "skill-card"
    skillCard.innerHTML = `
            <i class="fas fa-${getSkillIcon(skill)}"></i>
            <h4>${skill}</h4>
            <p>${Math.floor(Math.random() * 50) + 10} people offering this skill</p>
        `
    skillCard.addEventListener("click", () => {
      const skillSearch = document.getElementById("skill-search")
      if (skillSearch) skillSearch.value = skill
      showView("browse")
      renderBrowseView()
    })
    container.appendChild(skillCard)
  })
}

function getSkillIcon(skill) {
  const skillIcons = {
    "Graphic Design": "palette",
    "Web Development": "code",
    Spanish: "language",
    Photography: "camera",
    Cooking: "utensils",
    Excel: "file-excel",
    Photoshop: "image",
    Yoga: "spa",
    Marketing: "bullhorn",
    Writing: "pen",
  }

  return skillIcons[skill] || "star"
}

// Browse view functions
function renderBrowseView() {
  const skillSearch = document.getElementById("skill-search")
  const locationFilter = document.getElementById("location-filter")
  const availabilityFilter = document.getElementById("availability-filter")

  const searchTerm = skillSearch ? skillSearch.value.toLowerCase() : ""
  const locationFilterValue = locationFilter ? locationFilter.value : ""
  const availabilityFilterValue = availabilityFilter ? availabilityFilter.value : ""

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Skip private profiles and current user
    if (!user.isPublic || (currentUser && user.id === currentUser.id)) return false

    // Apply search filter
    if (searchTerm) {
      const hasSkill = [...user.offeredSkills, ...user.wantedSkills].some((skill) =>
        skill.toLowerCase().includes(searchTerm),
      )
      if (!hasSkill) return false
    }

    // Apply location filter
    if (locationFilterValue && locationFilterValue !== "remote" && user.location !== locationFilterValue) {
      return false
    }

    if (locationFilterValue === "remote" && user.location.toLowerCase() !== "remote") {
      return false
    }

    // Apply availability filter
    if (availabilityFilterValue && !user.availability.includes(availabilityFilterValue)) {
      return false
    }

    return true
  })

  // Update results count
  const resultsCount = document.getElementById("results-count")
  if (resultsCount) {
    resultsCount.textContent = filteredUsers.length
  }

  // Render results
  const container = document.getElementById("search-results")
  if (!container) return

  container.innerHTML = ""

  if (filteredUsers.length === 0) {
    container.innerHTML = '<p class="no-results">No users found matching your criteria</p>'
    return
  }

  filteredUsers.forEach((user) => {
    const userCard = document.createElement("div")
    userCard.className = "user-card"
    userCard.innerHTML = `
            <div class="user-card-header">
                <img src="${user.profilePhoto}" alt="${user.name}" class="user-card-pic">
                <div class="user-card-info">
                    <h3>${user.name}</h3>
                    <div class="user-card-location">
                        <i class="fas fa-map-marker-alt"></i> ${user.location || "Location not specified"}
                    </div>
                </div>
            </div>
            <div class="user-card-body">
                <div class="user-card-skills">
                    <h4>Offers:</h4>
                    ${user.offeredSkills.map((skill) => `<span class="skill-tag offer">${skill}</span>`).join("")}
                    <h4>Wants:</h4>
                    ${user.wantedSkills.map((skill) => `<span class="skill-tag want">${skill}</span>`).join("")}
                </div>
            </div>
            <div class="user-card-footer">
                <div class="availability-badge">
                    <i class="fas fa-clock"></i> ${user.availability.join(", ") || "Not specified"}
                </div>
                <button class="btn btn-primary btn-small request-swap-btn" data-user-id="${user.id}">Request Swap</button>
            </div>
        `
    container.appendChild(userCard)
  })

  // Add event listeners to swap buttons
  document.querySelectorAll(".request-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const userId = e.target.getAttribute("data-user-id")
      openSwapModal(userId)
    })
  })
}

function resetFiltersHandler() {
  const skillSearch = document.getElementById("skill-search")
  const locationFilter = document.getElementById("location-filter")
  const availabilityFilter = document.getElementById("availability-filter")

  if (skillSearch) skillSearch.value = ""
  if (locationFilter) locationFilter.value = ""
  if (availabilityFilter) availabilityFilter.value = ""

  renderBrowseView()
}

function openSwapModal(userId) {
  if (!currentUser) {
    openModal("login")
    return
  }

  const user = users.find((u) => u.id === Number.parseInt(userId))
  if (!user) return

  // Set modal title
  const modalTitle = document.getElementById("swap-modal-title")
  if (modalTitle) {
    modalTitle.textContent = `Request Swap with ${user.name}`
  }

  // Prepare modal content
  const modalContent = document.getElementById("swap-modal-content")
  if (!modalContent) return

  modalContent.innerHTML = `
        <div class="swap-modal-details">
            <div class="swap-modal-users">
                <img src="${currentUser.profilePhoto}" alt="${currentUser.name}">
                <div class="swap-modal-arrow"><i class="fas fa-exchange-alt"></i></div>
                <img src="${user.profilePhoto}" alt="${user.name}">
            </div>
            <div class="swap-modal-skills">
                <p>You offer <strong>${currentUser.offeredSkills[0] || "a skill"}</strong> in exchange for <strong>${user.offeredSkills[0] || "a skill"}</strong></p>
            </div>
            <div class="swap-modal-message">
                <label for="swap-message">Message to ${user.name}:</label>
                <textarea id="swap-message" placeholder="Explain what you'd like to learn/teach"></textarea>
            </div>
            <div class="swap-modal-actions">
                <button class="btn btn-outline" id="cancel-swap-btn">Cancel</button>
                <button class="btn btn-primary" id="send-swap-btn" data-user-id="${user.id}">Send Request</button>
            </div>
        </div>
    `

  // Add event listeners
  const cancelSwapBtn = document.getElementById("cancel-swap-btn")
  const sendSwapBtn = document.getElementById("send-swap-btn")

  if (cancelSwapBtn) {
    cancelSwapBtn.addEventListener("click", closeAllModals)
  }

  if (sendSwapBtn) {
    sendSwapBtn.addEventListener("click", sendSwapRequest)
  }

  openModal("swap")
}

function sendSwapRequest(e) {
  const userId = e.target.getAttribute("data-user-id")
  const messageTextarea = document.getElementById("swap-message")
  const message = messageTextarea ? messageTextarea.value : ""

  if (!currentUser) return

  // For demo, we'll just use the first offered/wanted skills
  const offeredSkill = currentUser.offeredSkills[0] || "a skill"
  const targetUser = users.find((u) => u.id === Number.parseInt(userId))
  const wantedSkill = targetUser ? targetUser.offeredSkills[0] || "a skill" : "a skill"

  // Create new swap request
  const newRequest = {
    id: swapRequests.length + 1,
    fromUserId: currentUser.id,
    toUserId: Number.parseInt(userId),
    offeredSkill,
    wantedSkill,
    message,
    status: "pending",
    createdAt: new Date(),
  }

  swapRequests.push(newRequest)
  closeAllModals()

  // Show success message
  showToast("Swap request sent successfully!", "success")

  // Update swaps view if we're on it
  if (views.swaps && views.swaps.style.display === "block") {
    renderSwapsView()
  }
}

// Swaps view functions
function renderSwapsView() {
  if (!currentUser) {
    showView("home")
    return
  }

  // Show pending swaps by default
  switchSwapsTab("pending")
}

function switchSwapsTab(tab) {
  // Update active tab
  document.querySelectorAll(".swaps-tabs .tab-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-tab") === tab) {
      btn.classList.add("active")
    }
  })

  // Hide all tab contents
  document.querySelectorAll(".swaps-list").forEach((list) => {
    list.style.display = "none"
  })

  // Show selected tab content
  const containerId = `${tab}-swaps`
  const container = document.getElementById(containerId)
  if (!container) return

  container.style.display = "block"
  container.innerHTML = ""

  // Get swaps for this tab
  let swaps = []
  if (tab === "pending") {
    swaps = swapRequests.filter(
      (req) => req.status === "pending" && (req.fromUserId === currentUser.id || req.toUserId === currentUser.id),
    )
  } else if (tab === "accepted") {
    swaps = swapRequests.filter(
      (req) => req.status === "accepted" && (req.fromUserId === currentUser.id || req.toUserId === currentUser.id),
    )
  } else if (tab === "completed") {
    swaps = swapRequests.filter(
      (req) => req.status === "completed" && (req.fromUserId === currentUser.id || req.toUserId === currentUser.id),
    )
  }

  if (swaps.length === 0) {
    container.innerHTML = `<p class="no-swaps">No ${tab} swaps found</p>`
    return
  }

  swaps.forEach((swap) => {
    const fromUser = users.find((u) => u.id === swap.fromUserId)
    const toUser = users.find((u) => u.id === swap.toUserId)

    if (!fromUser || !toUser) return

    const isCurrentUserSender = swap.fromUserId === currentUser.id
    const otherUser = isCurrentUserSender ? toUser : fromUser

    const swapItem = document.createElement("div")
    swapItem.className = `swap-item status-${swap.status}`
    swapItem.innerHTML = `
            <div class="swap-info">
                <div class="swap-users">
                    <img src="${fromUser.profilePhoto}" alt="${fromUser.name}">
                    <div class="swap-arrow"><i class="fas fa-exchange-alt"></i></div>
                    <img src="${toUser.profilePhoto}" alt="${toUser.name}">
                </div>
                <div class="swap-details">
                    <p><strong>${fromUser.name}</strong> offers <span class="skill-tag offer">${swap.offeredSkill}</span></p>
                    <p><strong>${toUser.name}</strong> wants <span class="skill-tag want">${swap.wantedSkill}</span></p>
                    ${swap.message ? `<p class="swap-message">"${swap.message}"</p>` : ""}
                    <p class="swap-date">${formatDate(swap.createdAt)}</p>
                </div>
            </div>
            <div class="swap-status ${swap.status}">${swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}</div>
            <div class="swap-actions">
                ${
                  swap.status === "pending" && swap.toUserId === currentUser.id
                    ? `
                    <button class="btn btn-primary btn-small accept-swap-btn" data-swap-id="${swap.id}">Accept</button>
                    <button class="btn btn-outline btn-small reject-swap-btn" data-swap-id="${swap.id}">Reject</button>
                `
                    : ""
                }
                ${
                  swap.status === "pending" && swap.fromUserId === currentUser.id
                    ? `
                    <button class="btn btn-outline btn-small cancel-swap-btn" data-swap-id="${swap.id}">Cancel</button>
                `
                    : ""
                }
                ${
                  swap.status === "accepted"
                    ? `
                    <button class="btn btn-primary btn-small complete-swap-btn" data-swap-id="${swap.id}">Mark Complete</button>
                `
                    : ""
                }
                ${
                  swap.status === "completed" &&
                  !ratings.some((r) => r.swapId === swap.id && r.fromUserId === currentUser.id)
                    ? `
                    <button class="btn btn-primary btn-small rate-swap-btn" data-swap-id="${swap.id}" data-user-id="${otherUser.id}">Rate Swap</button>
                `
                    : ""
                }
            </div>
        `
    container.appendChild(swapItem)
  })

  // Add event listeners to action buttons
  document.querySelectorAll(".accept-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      acceptSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".reject-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      rejectSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".cancel-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      cancelSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".complete-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      completeSwapRequest(swapId)
    })
  })

  document.querySelectorAll(".rate-swap-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      openRatingModal(swapId, userId)
    })
  })
}

function acceptSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    swapRequests[swapIndex].status = "accepted"
    renderSwapsView()
    showToast("Swap request accepted!", "success")
  }
}

function rejectSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    swapRequests.splice(swapIndex, 1)
    renderSwapsView()
    showToast("Swap request rejected", "info")
  }
}

function cancelSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    swapRequests.splice(swapIndex, 1)
    renderSwapsView()
    showToast("Swap request cancelled", "info")
  }
}

function completeSwapRequest(swapId) {
  const swapIndex = swapRequests.findIndex((s) => s.id === swapId)
  if (swapIndex !== -1) {
    swapRequests[swapIndex].status = "completed"
    swapRequests[swapIndex].completedAt = new Date()
    renderSwapsView()
    showToast("Swap marked as completed!", "success")
  }
}

function openRatingModal(swapId, userId) {
  const user = users.find((u) => u.id === userId)
  if (!user) return

  const modalTitle = document.getElementById("rating-modal-title")
  if (modalTitle) {
    modalTitle.textContent = `Rate Your Swap with ${user.name}`
  }

  const modalContent = document.getElementById("rating-modal-content")
  if (!modalContent) return

  modalContent.innerHTML = `
        <div class="rating-form">
            <div class="rating-input">
                <i class="fas fa-star" data-rating="1"></i>
                <i class="fas fa-star" data-rating="2"></i>
                <i class="fas fa-star" data-rating="3"></i>
                <i class="fas fa-star" data-rating="4"></i>
                <i class="fas fa-star" data-rating="5"></i>
            </div>
            <input type="hidden" id="selected-rating" value="0">
            <div class="form-group">
                <label for="rating-comment">Your Feedback (optional)</label>
                <textarea id="rating-comment" placeholder="How was your experience?"></textarea>
            </div>
            <div class="rating-actions">
                <button class="btn btn-outline" id="cancel-rating-btn">Cancel</button>
                <button class="btn btn-primary" id="submit-rating-btn" data-swap-id="${swapId}" data-user-id="${userId}">Submit Rating</button>
            </div>
        </div>
    `

  // Set up star rating interaction
  const stars = modalContent.querySelectorAll(".rating-input i")
  stars.forEach((star) => {
    star.addEventListener("click", (e) => {
      const rating = Number.parseInt(e.target.getAttribute("data-rating"))
      const selectedRating = document.getElementById("selected-rating")
      if (selectedRating) selectedRating.value = rating

      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add("active")
        } else {
          s.classList.remove("active")
        }
      })
    })

    star.addEventListener("mouseover", (e) => {
      const rating = Number.parseInt(e.target.getAttribute("data-rating"))

      stars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add("hover")
        } else {
          s.classList.remove("hover")
        }
      })
    })

    star.addEventListener("mouseout", () => {
      stars.forEach((s) => s.classList.remove("hover"))
    })
  })

  const cancelRatingBtn = document.getElementById("cancel-rating-btn")
  const submitRatingBtn = document.getElementById("submit-rating-btn")

  if (cancelRatingBtn) {
    cancelRatingBtn.addEventListener("click", closeAllModals)
  }

  if (submitRatingBtn) {
    submitRatingBtn.addEventListener("click", submitRating)
  }

  openModal("rating")
}

function submitRating(e) {
  const swapId = Number.parseInt(e.target.getAttribute("data-swap-id"))
  const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
  const selectedRating = document.getElementById("selected-rating")
  const ratingComment = document.getElementById("rating-comment")

  const rating = selectedRating ? Number.parseInt(selectedRating.value) : 0
  const comment = ratingComment ? ratingComment.value : ""

  if (rating === 0) {
    showToast("Please select a rating", "warning")
    return
  }

  const newRating = {
    id: ratings.length + 1,
    swapId,
    fromUserId: currentUser.id,
    toUserId: userId,
    rating,
    comment,
    createdAt: new Date(),
  }

  ratings.push(newRating)
  closeAllModals()
  renderSwapsView()
  showToast("Thank you for your rating!", "success")
}

// Admin view functions
function renderAdminView() {
  if (!currentUser || !currentUser.isAdmin) {
    showView("home")
    return
  }

  // Show users tab by default
  switchAdminTab("admin-users")
}

function switchAdminTab(tab) {
  // Update active tab
  document.querySelectorAll(".admin-tabs .tab-btn").forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-tab") === tab) {
      btn.classList.add("active")
    }
  })

  // Hide all tab contents
  document.querySelectorAll(".admin-tab-content").forEach((content) => {
    content.style.display = "none"
  })

  // Show selected tab content
  const containerId = `${tab}-tab`
  const container = document.getElementById(containerId)
  if (container) {
    container.style.display = "block"
  }

  // Load content for the tab
  if (tab === "admin-users") {
    renderAdminUsers()
  } else if (tab === "admin-content") {
    renderPendingSkills()
  }
}

function renderAdminUsers() {
  const searchInput = document.getElementById("admin-user-search")
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : ""

  let filteredUsers = users
  if (searchTerm) {
    filteredUsers = users.filter(
      (user) => user.name.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm),
    )
  }

  const tableBody = document.getElementById("admin-users-table")
  if (!tableBody) return

  tableBody.innerHTML = ""

  filteredUsers.forEach((user) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${user.id}</td>
            <td>
                <div class="user-info">
                    <img src="${user.profilePhoto}" alt="${user.name}" class="user-table-pic">
                    ${user.name}
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="status-badge ${user.isPublic ? "status-public" : "status-private"}">
                    ${user.isPublic ? "Public" : "Private"}
                </span>
                ${user.isAdmin ? '<span class="badge badge-primary">Admin</span>' : ""}
            </td>
            <td>
                <div class="admin-actions">
                    <button class="btn btn-outline btn-small admin-edit-btn" data-user-id="${user.id}">Edit</button>
                    ${
                      !user.isAdmin
                        ? `
                        <button class="btn btn-danger btn-small admin-ban-btn" data-user-id="${user.id}">
                            ${user.isBanned ? "Unban" : "Ban"}
                        </button>
                    `
                        : ""
                    }
                </div>
            </td>
        `
    tableBody.appendChild(row)
  })

  // Add event listeners to action buttons
  document.querySelectorAll(".admin-edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      editUser(userId)
    })
  })

  document.querySelectorAll(".admin-ban-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      toggleBanUser(userId)
    })
  })
}

function renderPendingSkills() {
  // Get all skills that need approval (in a real app, these would be flagged)
  const pendingSkills = []
  users.forEach((user) => {
    user.offeredSkills.forEach((skill) => {
      if (!skills.includes(skill)) {
        pendingSkills.push({
          userId: user.id,
          userName: user.name,
          skill,
        })
      }
    })
    user.wantedSkills.forEach((skill) => {
      if (!skills.includes(skill)) {
        pendingSkills.push({
          userId: user.id,
          userName: user.name,
          skill,
        })
      }
    })
  })

  const container = document.getElementById("pending-skills-list")
  if (!container) return

  container.innerHTML = ""

  if (pendingSkills.length === 0) {
    container.innerHTML = "<p>No skills pending approval</p>"
    return
  }

  pendingSkills.forEach((item) => {
    const skillItem = document.createElement("div")
    skillItem.className = "pending-skill-item"
    skillItem.innerHTML = `
            <div class="skill-info">
                <h4>${item.skill}</h4>
                <p>Submitted by: ${item.userName}</p>
            </div>
            <div class="skill-actions">
                <button class="btn btn-primary btn-small approve-skill-btn" data-skill="${item.skill}" data-user-id="${item.userId}">Approve</button>
                <button class="btn btn-outline btn-small reject-skill-btn" data-skill="${item.skill}" data-user-id="${item.userId}">Reject</button>
            </div>
        `
    container.appendChild(skillItem)
  })

  // Add event listeners to action buttons
  document.querySelectorAll(".approve-skill-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const skill = e.target.getAttribute("data-skill")
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      approveSkill(skill, userId)
    })
  })

  document.querySelectorAll(".reject-skill-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const skill = e.target.getAttribute("data-skill")
      const userId = Number.parseInt(e.target.getAttribute("data-user-id"))
      rejectSkill(skill, userId)
    })
  })
}

function editUser(userId) {
  const user = users.find((u) => u.id === userId)
  if (!user) return

  showToast(`Edit user: ${user.name} - This would open an edit form in a real implementation.`, "info")
}

function toggleBanUser(userId) {
  const userIndex = users.findIndex((u) => u.id === userId)
  if (userIndex !== -1) {
    users[userIndex].isBanned = !users[userIndex].isBanned
    renderAdminUsers()
    showToast(`User ${users[userIndex].isBanned ? "banned" : "unbanned"}`, "info")
  }
}

function approveSkill(skill, userId) {
  if (!skills.includes(skill)) {
    skills.push(skill)
  }

  showToast(`Skill "${skill}" approved`, "success")
  renderPendingSkills()
}

function rejectSkill(skill, userId) {
  showToast(`Skill "${skill}" rejected`, "info")
  renderPendingSkills()
}

function exportUserData() {
  showToast("User data exported successfully", "success")
}

function sendPlatformMessage() {
  const subjectInput = document.getElementById("message-subject")
  const contentInput = document.getElementById("message-content")
  const urgentInput = document.getElementById("urgent-message")

  const subject = subjectInput ? subjectInput.value : ""
  const content = contentInput ? contentInput.value : ""
  const isUrgent = urgentInput ? urgentInput.checked : false

  if (!subject || !content) {
    showToast("Please enter both subject and content", "warning")
    return
  }

  showToast(`Message sent to all users${isUrgent ? " (urgent)" : ""}`, "success")

  // Clear form
  if (subjectInput) subjectInput.value = ""
  if (contentInput) contentInput.value = ""
  if (urgentInput) urgentInput.checked = false
}

function generateReport() {
  const reportTypeSelect = document.getElementById("report-type")
  const startDateInput = document.getElementById("report-start-date")
  const endDateInput = document.getElementById("report-end-date")

  const reportType = reportTypeSelect ? reportTypeSelect.value : "swaps"
  const startDate = startDateInput ? startDateInput.value : ""
  const endDate = endDateInput ? endDateInput.value : ""

  let reportData = ""

  if (reportType === "swaps") {
    reportData = `
            <h3>Swap Statistics</h3>
            <p>Total swaps: ${swapRequests.length}</p>
            <p>Pending: ${swapRequests.filter((s) => s.status === "pending").length}</p>
            <p>Accepted: ${swapRequests.filter((s) => s.status === "accepted").length}</p>
            <p>Completed: ${swapRequests.filter((s) => s.status === "completed").length}</p>
        `
  } else if (reportType === "users") {
    reportData = `
            <h3>User Activity</h3>
            <p>Total users: ${users.length}</p>
            <p>Active users: ${users.filter((u) => !u.isBanned).length}</p>
            <p>Banned users: ${users.filter((u) => u.isBanned).length}</p>
            <p>Admins: ${users.filter((u) => u.isAdmin).length}</p>
        `
  } else if (reportType === "feedback") {
    const avgRating =
      ratings.length > 0 ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1) : "0"
    reportData = `
            <h3>Feedback Summary</h3>
            <p>Total ratings: ${ratings.length}</p>
            <p>Average rating: ${avgRating}</p>
        `
  }

  const reportResults = document.getElementById("report-results")
  if (reportResults) {
    reportResults.innerHTML = reportData
  }

  showToast("Report generated", "success")
}

function downloadReport() {
  showToast("Report downloaded as CSV", "success")
}

// Utility functions
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function showToast(message, type) {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
    `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add("show")
  }, 100)

  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => {
      toast.remove()
    }, 300)
  }, 3000)
}

function getToastIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-circle",
    warning: "exclamation-triangle",
    info: "info-circle",
  }
  return icons[type] || "info-circle"
}

// Initialize any UI components
function initUIComponents() {
  // Populate location filter dropdown
  const locationFilter = document.getElementById("location-filter")
  if (locationFilter) {
    locations.forEach((location) => {
      const option = document.createElement("option")
      option.value = location
      option.textContent = location
      locationFilter.appendChild(option)
    })
  }

  // Add scroll event listener for header effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".app-header")
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add("scrolled")
      } else {
        header.classList.remove("scrolled")
      }
    }
  })
}
