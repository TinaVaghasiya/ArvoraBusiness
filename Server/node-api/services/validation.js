// Validation utility functions

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Validates phone numbers (10-15 digits, may include +, -, spaces, parentheses)
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validateMPin = (mpin) => {
  // Validates 4-digit PIN
  const mpinRegex = /^\d{4}$/;
  return mpinRegex.test(mpin);
};

export const validatePassword = (password) => {
  // Password must be 8-15 characters
  return password && password.length >= 8 && password.length <= 15;
};

export const validateUsername = (username) => {
  // Username must be at least 3 characters
  return username && username.length >= 3;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove potentially dangerous characters
  return input.trim().replace(/[<>]/g, '');
};
