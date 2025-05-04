// Email validation
export const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Password validation (min 6 characters)
  export const validatePassword = (password) => {
    return password && password.length >= 6;
  };
  
  // Name validation (not empty)
  export const validateName = (name) => {
    return name && name.trim().length > 0;
  };
  
  // Form validation for registration
  export const validateRegistration = (formData) => {
    const errors = {};
    
    if (!validateName(formData.name)) {
      errors.name = 'Name is required';
    }
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Form validation for login
  export const validateLogin = (formData) => {
    const errors = {};
    
    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };