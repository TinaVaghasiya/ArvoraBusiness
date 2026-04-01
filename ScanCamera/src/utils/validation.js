// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }
  return { isValid: true, error: "" };
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  if (!phone || !phone.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }
  if (phone.length < 7) {
    return { isValid: false, error: "Phone number is invalid" };
  }
  if (phone.length > 15) {
    return { isValid: false, error: "Phone number is invalid" };
  }
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }
  return { isValid: true, error: "" };
};

// Name validation
export const validateName = (name, fieldName = "Name") => {
  if (!name || !name.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} is too long` };
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { isValid: false, error: `${fieldName} should only contain letters` };
  }
  return { isValid: true, error: "" };
};

// Website validation
export const validateWebsite = (website) => {
  if (!website || !website.trim()) {
    return { isValid: true, error: "" }; // Optional field
  }
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (!urlRegex.test(website)) {
    return { isValid: false, error: "Please enter a valid website URL" };
  }
  return { isValid: true, error: "" };
};

// Company validation
export const validateCompany = (company) => {
  if (!company || !company.trim()) {
    return { isValid: true, error: "" }; // Optional field
  }
  if (company.trim().length > 100) {
    return { isValid: false, error: "Company name is too long" };
  }
  return { isValid: true, error: "" };
};

// Address validation
export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return { isValid: true, error: "" }; // Optional field
  }
  if (address.trim().length > 200) {
    return { isValid: false, error: "Address is too long" };
  }
  return { isValid: true, error: "" };
};
