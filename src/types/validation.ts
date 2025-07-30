/**
 * Form Validation Types
 */

export interface ValidationRule {
  (value: any, fieldName: string): string | null;
}

export interface ValidationRules {
  required: (value: any, fieldName: string) => string | null;
  minLength: (min: number) => ValidationRule;
  maxLength: (max: number) => ValidationRule;
  email: (value: any, fieldName: string) => string | null;
  pattern: (regex: RegExp, message: string) => ValidationRule;
  custom: (validateFn: (value: any) => boolean | string) => ValidationRule;
}

export interface FieldConfig {
  value: any;
  rules: ValidationRule[];
}

export interface ValidationState {
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isValid: boolean;
}

export interface ValidationOptions {
  validateOnBlur?: boolean;
  validateOnInput?: boolean;
  debounceMs?: number;
}

export interface TaskValidationRules {
  taskText: ValidationRule[];
}

export interface FormValidationConfig {
  [fieldName: string]: {
    value: any;
    rules: ValidationRule[];
  };
}
