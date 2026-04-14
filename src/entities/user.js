export class User {
  constructor({
    id,
    fullName,
    email,
    username,
    password,
    role,
    avatar,
    location,
    bio,
    interests,
    joinedDate,
  }) {
    this.id = id
    this.fullName = fullName
    this.email = email
    this.username = username
    this.password = password
    this.role = role
    this.avatar = avatar
    this.location = location
    this.bio = bio
    this.interests = interests
    this.joinedDate = joinedDate
  }
}

export const USER_LIST = []
const USER_FIELDS = [
  'id',
  'fullName',
  'email',
  'username',
  'password',
  'role',
  'avatar',
  'location',
  'bio',
  'interests',
  'joinedDate',
]

export function get_all_users() {
  return USER_LIST
}

export function set_all_users(users) {
  USER_LIST.length = 0
  users.forEach((user) => add_user(user))
}

export function add_user(user) {
  const userToAdd = user instanceof User ? user : new User(user)
  USER_LIST.push(userToAdd)
}

export function get_user_by_email_and_password(email, password) {
  return USER_LIST.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  )
}

export function get_user_by_email(email) {
  return USER_LIST.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null
}

export function update_user_by_email(email, updates) {
  const idx = USER_LIST.findIndex((user) => user.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) return null
  Object.keys(updates).forEach((key) => {
    if (USER_FIELDS.includes(key)) {
      USER_LIST[idx][key] = updates[key]
    }
  })
  return USER_LIST[idx]
}

export function delete_user_by_email(email) {
  const idx = USER_LIST.findIndex((user) => user.email.toLowerCase() === email.toLowerCase())
  if (idx === -1) return false
  USER_LIST.splice(idx, 1)
  return true
}
