/**
 * Composable for form validation logic
 * Provides reusable validation patterns for input fields
 */

import { ref, computed, readonly } from "vue";
import type { Ref, ComputedRef } from "vue";
import type {
  ValidationRule,
  ValidationErrors,
  ValidationRules,
  FieldConfig,
  FormValidationConfig,
  ValidationOptions,
} from "../types";

export const useFormValidation = () => {
  // Validation state
  const errors: Ref<ValidationErrors> = ref({});
  const touched: Ref<Record<string, boolean>> = ref({});

  // Validation rules
  const validationRules: ValidationRules = {
    required: (value: any, fieldName: string): string | null => {
      const trimmed = typeof value === "string" ? value.trim() : value;
      return !trimmed ? `${fieldName} is required` : null;
    },

    minLength:
      (min: number): ValidationRule =>
      (value: any, fieldName: string): string | null => {
        const trimmed = typeof value === "string" ? value.trim() : value;
        return trimmed && trimmed.length < min
          ? `${fieldName} must be at least ${min} characters`
          : null;
      },

    maxLength:
      (max: number): ValidationRule =>
      (value: any, fieldName: string): string | null => {
        const trimmed = typeof value === "string" ? value.trim() : value;
        return trimmed && trimmed.length > max
          ? `${fieldName} cannot exceed ${max} characters`
          : null;
      },

    email: (value: any, fieldName: string): string | null => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value)
        ? `${fieldName} must be a valid email`
        : null;
    },

    pattern:
      (regex: RegExp, message: string): ValidationRule =>
      (value: any, fieldName: string): string | null => {
        if (!value) return null;
        return !regex.test(value) ? message : null;
      },

    custom:
      (validateFn: (value: any) => boolean | string | null): ValidationRule =>
      (value: any, fieldName: string): string | null => {
        const result = validateFn(value);
        if (typeof result === "string") return result;
        if (result === null) return null;
        return result ? null : `${fieldName} is invalid`;
      },
  };

  // Task-specific validation rules
  const taskValidationRules = {
    taskText: [
      validationRules.required,
      validationRules.minLength(1),
      validationRules.maxLength(200),
      validationRules.custom((value) => {
        if (value && value.trim().length === 0) {
          return "Task cannot be only whitespace";
        }
        return null;
      }),
    ],
  };

  // Validate a single field
  const validateField = (
    fieldName: string,
    value: any,
    rules: ValidationRule[] = []
  ): boolean => {
    const fieldErrors = [];

    for (const rule of rules) {
      const error = rule(value, fieldName);
      if (error) {
        fieldErrors.push(error);
        break; // Stop on first error
      }
    }

    errors.value[fieldName] = fieldErrors.length > 0 ? fieldErrors[0] : null;
    return fieldErrors.length === 0;
  };

  // Validate multiple fields
  const validateFields = (fieldsConfig: FormValidationConfig): boolean => {
    let isValid = true;

    Object.entries(fieldsConfig).forEach(([fieldName, { value, rules }]) => {
      const fieldValid = validateField(fieldName, value, rules);
      if (!fieldValid) isValid = false;
    });

    return isValid;
  };

  // Clear error for a field
  const clearFieldError = (fieldName: string): void => {
    errors.value[fieldName] = null;
  };

  // Clear all errors
  const clearAllErrors = (): void => {
    errors.value = {};
    touched.value = {};
  };

  // Mark field as touched
  const touchField = (fieldName: string): void => {
    touched.value[fieldName] = true;
  };

  // Check if field has error
  const hasFieldError = (fieldName: string): boolean => {
    return Boolean(errors.value[fieldName]);
  };

  // Get field error message
  const getFieldError = (fieldName: string): string | null => {
    return errors.value[fieldName] || null;
  };

  // Computed properties
  const hasAnyErrors = computed(() => {
    return Object.values(errors.value).some((error) => error !== null);
  });

  const errorCount = computed(() => {
    return Object.values(errors.value).filter((error) => error !== null).length;
  });

  // Task-specific validation helper
  const validateTaskText = (text: string): boolean => {
    return validateField("taskText", text, taskValidationRules.taskText);
  };

  // Form submission helper
  const validateForm = (
    formData: Record<string, any>,
    validationConfig: Record<string, ValidationRule[]>
  ): boolean => {
    const fieldsConfig: FormValidationConfig = {};

    Object.entries(validationConfig).forEach(([fieldName, rules]) => {
      fieldsConfig[fieldName] = {
        value: formData[fieldName],
        rules,
      };
    });

    return validateFields(fieldsConfig);
  };

  // Real-time validation setup
  const setupFieldValidation = (
    fieldName: string,
    valueRef: Ref<any>,
    rules: ValidationRule[],
    options: ValidationOptions = {}
  ) => {
    const {
      validateOnBlur = true,
      validateOnInput = false,
      debounceMs = 300,
    } = options;

    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    const validate = () => {
      validateField(fieldName, valueRef.value, rules);
    };

    const debouncedValidate = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(validate, debounceMs);
    };

    return {
      validate,
      debouncedValidate,
      onBlur: validateOnBlur
        ? () => {
            touchField(fieldName);
            validate();
          }
        : undefined,
      onInput: validateOnInput
        ? debouncedValidate
        : () => clearFieldError(fieldName),
    };
  };

  return {
    // State
    errors: readonly(errors),
    touched: readonly(touched),

    // Computed
    hasAnyErrors,
    errorCount,

    // Validation methods
    validateField,
    validateFields,
    validateForm,
    validateTaskText,

    // Error management
    clearFieldError,
    clearAllErrors,
    touchField,
    hasFieldError,
    getFieldError,

    // Helpers
    setupFieldValidation,
    validationRules,
    taskValidationRules,
  };
};

// Specialized hook for task form validation
export const useTaskFormValidation = () => {
  const validation = useFormValidation();

  const validateAndSubmit = async (
    taskText: string,
    onSubmit: (text: string) => Promise<void>
  ): Promise<{ success: boolean; error: string | null }> => {
    const isValid = validation.validateTaskText(taskText);

    if (isValid) {
      try {
        await onSubmit(taskText.trim());
        return { success: true, error: null };
      } catch (error) {
        const errorMessage = (error as Error).message || "Failed to add task";
        validation.clearFieldError("taskText");
        // Manually set error since errors might be readonly
        Object.assign(validation.errors.value, { taskText: errorMessage });
        return { success: false, error: errorMessage };
      }
    }

    return { success: false, error: validation.getFieldError("taskText") };
  };

  return {
    ...validation,
    validateAndSubmit,
  };
};
