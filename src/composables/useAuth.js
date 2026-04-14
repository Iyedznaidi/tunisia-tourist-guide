import { ref } from 'vue'
import router from '../router'
import {
  add_user,
  get_all_users,
  get_user_by_email,
  get_user_by_email_and_password,
  set_all_users,
  update_user_by_email,
} from '../entities/user'

// ─── Reactive State ────────────────────────────────────────────────────────────
const isAuthenticated = ref(false)
const currentUser = ref(null)
const authError = ref('')

// Session lifetime: 24 hours in milliseconds
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

// Mock "database" key in localStorage for registered users
const USERS_KEY = 'ttg_users'
const SESSION_KEY = 'ttg_session'

// ─── Helpers ───────────────────────────────────────────────────────────────────
function loadUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    set_all_users(users)
    return get_all_users()
  } catch {
    set_all_users([])
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function persistSession(user) {
  const session = {
    user,
    expiry: Date.now() + SESSION_DURATION_MS,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

// ─── Composable ────────────────────────────────────────────────────────────────
export function useAuth() {
  /**
   * Restore session from localStorage on app startup.
   * If the stored session has expired, auto-logout.
   */
  function initAuth() {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (!raw) return
      const session = JSON.parse(raw)
      if (!session || !session.user || !session.expiry) return

      if (Date.now() > session.expiry) {
        // Session expired – clean up silently; the snackbar is shown via authError
        clearSession()
        authError.value = 'Your session has expired. Please log in again.'
        return
      }

      isAuthenticated.value = true
      currentUser.value = session.user
    } catch {
      clearSession()
    }
  }

  /**
   * Mock login: accepts any registered user or the built-in demo account.
   * Sets isAuthenticated, currentUser, and persists to localStorage.
   */
  function login(email, password) {
    authError.value = ''

    if (!email || !password) {
      authError.value = 'Please enter your email and password.'
      return false
    }

    // Check registered users first
    loadUsers()
    const found = get_user_by_email_and_password(email, password)

    if (found) {
      const { password: _pw, ...userWithoutPw } = found // don't store password in state
      isAuthenticated.value = true
      currentUser.value = userWithoutPw
      persistSession(userWithoutPw)
      return true
    }

    // Built-in demo account (always works)
    if (email === 'ahmed@example.com' && password === 'password123') {
      const demoUser = {
        id: 1,
        fullName: 'Ahmed Ben Ali',
        email: 'ahmed@example.com',
        username: 'ahmed_adventures',
        role: 'host',
        avatar: null,
        location: 'Tunis, Tunisia',
        bio: 'Passionate traveler exploring every corner of Tunisia',
        interests: ['Sea', 'Culture', 'Food', 'History'],
        joinedDate: '2024-01-15',
      }
      isAuthenticated.value = true
      currentUser.value = demoUser
      persistSession(demoUser)
      return true
    }

    authError.value = 'Invalid email or password. Please try again.'
    return false
  }

  /**
   * Mock signup: validates, stores user in the localStorage "database", and
   * logs the user in automatically without requiring email verification.
   */
  function signup(fullName, email, password, role = 'visitor') {
    authError.value = ''

    if (!fullName || !email || !password) {
      authError.value = 'Please fill in all required fields.'
      return false
    }

    loadUsers()
    if (get_user_by_email(email)) {
      authError.value = 'An account with this email already exists.'
      return false
    }

    const newUser = {
      id: Date.now(),
      fullName,
      email,
      // Derive a base username from the email local-part; append a short random
      // suffix to avoid collisions when multiple emails share the same local-part.
      username:
        email.split('@')[0].replace(/[^a-z0-9_]/gi, '_') +
        '_' +
        Math.random().toString(36).slice(2, 6),
      // NOTE: storing passwords in plain text is acceptable ONLY for this mock
      // implementation. In a real application, never store plain-text passwords —
      // always use a proper hashing algorithm (e.g. bcrypt) on the server.
      password,
      role: role || 'visitor',
      avatar: null,
      location: '',
      bio: '',
      interests: [],
      joinedDate: new Date().toISOString().split('T')[0],
    }

    add_user(newUser)
    saveUsers(get_all_users())

    const { password: _pw, ...userWithoutPw } = newUser
    isAuthenticated.value = true
    currentUser.value = userWithoutPw
    persistSession(userWithoutPw)
    return true
  }

  /**
   * Log out current user: clear reactive state, remove session from
   * localStorage, and navigate to /login.
   */
  function logout() {
    isAuthenticated.value = false
    currentUser.value = null
    authError.value = ''
    clearSession()
    router.push('/login')
  }

  /**
   * Update the current user's profile (e.g. from the edit-profile dialog).
   * Persists the changes back to localStorage.
   */
  function updateProfile(updates) {
    if (!currentUser.value) return
    currentUser.value = { ...currentUser.value, ...updates }

    // Persist updated user to the session
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      try {
        const session = JSON.parse(raw)
        session.user = currentUser.value
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      } catch {
        // ignore
      }
    }

    // Also update the user record in the mock user DB if it exists there
    loadUsers()
    const updatedUser = update_user_by_email(currentUser.value.email, updates)
    if (updatedUser) {
      saveUsers(get_all_users())
    }
  }

  return {
    // state
    isAuthenticated,
    currentUser,
    authError,
    // methods
    initAuth,
    login,
    signup,
    logout,
    updateProfile,
  }
}
