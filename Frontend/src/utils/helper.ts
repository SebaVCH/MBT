export interface EmailValidator {
    (email: string): boolean;
}

export const validateEmail: EmailValidator = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
