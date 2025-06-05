export const validation = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  
  password: {
    required: 'Password is required',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters'
    }
  },
  
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[\d\s()+-]+$/,
      message: 'Invalid phone number'
    }
  },
  
  required: (fieldName) => ({
    required: `${fieldName} is required`
  }),
  
  minLength: (fieldName, length) => ({
    minLength: {
      value: length,
      message: `${fieldName} must be at least ${length} characters`
    }
  }),
  
  maxLength: (fieldName, length) => ({
    maxLength: {
      value: length,
      message: `${fieldName} must be less than ${length} characters`
    }
  })
};
