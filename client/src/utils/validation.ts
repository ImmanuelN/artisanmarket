export interface ValidationError {
  field: string;
  message: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: string;
}

export const validateRegistration = (data: RegistrationData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  } else if (data.name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!emailRegex.test(data.email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  } else if (data.password.length > 128) {
    errors.push({ field: 'password', message: 'Password cannot exceed 128 characters' });
  }

  // Password confirmation validation
  if (data.confirmPassword !== undefined) {
    if (!data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Password confirmation is required' });
    } else if (data.password !== data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
  }

  // Role validation
  if (data.role && !['customer', 'vendor'].includes(data.role)) {
    errors.push({ field: 'role', message: 'Invalid role selected' });
  }

  return errors;
};

export const validateLogin = (email: string, password: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!emailRegex.test(email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Password validation
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};

export const getFieldError = (errors: ValidationError[], field: string): string | undefined => {
  return errors.find(error => error.field === field)?.message;
};
