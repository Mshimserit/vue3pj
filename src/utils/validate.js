// src/utils/validate.js

// 手机号验证
export const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 密码强度验证
export const validatePassword = (password) => {
  return /^[a-zA-Z\d]{6,14}$/.test(password)
}

// 邮箱验证
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// XSS 防护
export const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}