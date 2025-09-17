// 验证工具函数

// 邮箱验证
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 手机号验证（中国大陆）
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 密码强度验证
export const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`密码长度至少${minLength}位`);
  }
  if (!hasUpperCase) {
    errors.push('密码必须包含大写字母');
  }
  if (!hasLowerCase) {
    errors.push('密码必须包含小写字母');
  }
  if (!hasNumbers) {
    errors.push('密码必须包含数字');
  }
  if (!hasSpecialChar) {
    errors.push('密码必须包含特殊字符');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
  };
};

// 计算密码强度
const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

// URL验证
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 身份证号验证（中国大陆）
export const isValidIdCard = (idCard: string): boolean => {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  
  if (!idCardRegex.test(idCard)) {
    return false;
  }

  // 验证校验码
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(idCard[i]) * weights[i];
  }
  
  const checkCode = checkCodes[sum % 11];
  return checkCode === idCard[17].toUpperCase();
};

// 表单字段验证
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export const validateField = (value: unknown, rules: ValidationRule): string | null => {
  if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return '此字段为必填项';
  }

  if (value && typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return `最少需要${rules.minLength}个字符`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `最多允许${rules.maxLength}个字符`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return '格式不正确';
    }
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

// 批量验证表单
export const validateForm = <T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, ValidationRule>
): { isValid: boolean; errors: Record<keyof T, string | null> } => {
  const errors = {} as Record<keyof T, string | null>;
  let isValid = true;

  for (const field in rules) {
    const error = validateField(data[field], rules[field]);
    errors[field] = error;
    if (error) {
      isValid = false;
    }
  }

  return { isValid, errors };
};

// 常用验证规则
export const commonRules = {
  required: { required: true },
  email: { 
    required: true, 
    custom: (value: string) => isValidEmail(value) ? null : '请输入有效的邮箱地址' 
  },
  phone: { 
    required: true, 
    custom: (value: string) => isValidPhone(value) ? null : '请输入有效的手机号码' 
  },
  password: { 
    required: true, 
    minLength: 8,
    custom: (value: string) => {
      const result = validatePassword(value);
      return result.isValid ? null : result.errors[0];
    }
  },
  url: { 
    custom: (value: string) => value && !isValidUrl(value) ? '请输入有效的URL' : null 
  },
};
