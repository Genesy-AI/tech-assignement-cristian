"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Email_1 = require("../../../../src/leads/domain/value-objects/Email");
(0, vitest_1.describe)('Email Value Object', () => {
    (0, vitest_1.describe)('constructor validation', () => {
        (0, vitest_1.it)('should create valid email', () => {
            const email = new Email_1.Email('user@example.com');
            (0, vitest_1.expect)(email.address).toBe('user@example.com');
        });
        (0, vitest_1.it)('should normalize email to lowercase', () => {
            const email = new Email_1.Email('USER@EXAMPLE.COM');
            (0, vitest_1.expect)(email.address).toBe('user@example.com');
        });
        (0, vitest_1.it)('should trim whitespace', () => {
            const email = new Email_1.Email('  user@example.com  ');
            (0, vitest_1.expect)(email.address).toBe('user@example.com');
        });
        (0, vitest_1.it)('should throw error for empty email', () => {
            (0, vitest_1.expect)(() => new Email_1.Email('')).toThrow('Email is required and must be a string');
            (0, vitest_1.expect)(() => new Email_1.Email('   ')).toThrow('Email cannot be empty');
        });
        (0, vitest_1.it)('should throw error for null/undefined email', () => {
            (0, vitest_1.expect)(() => new Email_1.Email(null)).toThrow('Email is required and must be a string');
            (0, vitest_1.expect)(() => new Email_1.Email(undefined)).toThrow('Email is required and must be a string');
        });
        (0, vitest_1.it)('should throw error for invalid format', () => {
            (0, vitest_1.expect)(() => new Email_1.Email('invalid')).toThrow('Email format is invalid');
            (0, vitest_1.expect)(() => new Email_1.Email('invalid@')).toThrow('Email format is invalid');
            (0, vitest_1.expect)(() => new Email_1.Email('@example.com')).toThrow('Email format is invalid');
            (0, vitest_1.expect)(() => new Email_1.Email('user@')).toThrow('Email format is invalid');
        });
        (0, vitest_1.it)('should throw error for consecutive dots', () => {
            (0, vitest_1.expect)(() => new Email_1.Email('user..name@example.com')).toThrow('Email cannot contain consecutive dots');
        });
        (0, vitest_1.it)('should throw error for dots at start/end of local part', () => {
            (0, vitest_1.expect)(() => new Email_1.Email('.user@example.com')).toThrow('Email local part cannot start or end with a dot');
            (0, vitest_1.expect)(() => new Email_1.Email('user.@example.com')).toThrow('Email local part cannot start or end with a dot');
        });
        (0, vitest_1.it)('should throw error for too long email', () => {
            const longEmail = 'a'.repeat(250) + '@example.com';
            (0, vitest_1.expect)(() => new Email_1.Email(longEmail)).toThrow('Email is too long');
        });
    });
    (0, vitest_1.describe)('getters', () => {
        (0, vitest_1.it)('should return correct domain', () => {
            const email = new Email_1.Email('user@example.com');
            (0, vitest_1.expect)(email.domain).toBe('example.com');
        });
        (0, vitest_1.it)('should return correct local part', () => {
            const email = new Email_1.Email('user.name@example.com');
            (0, vitest_1.expect)(email.localPart).toBe('user.name');
        });
    });
    (0, vitest_1.describe)('isValid method', () => {
        (0, vitest_1.it)('should return true for valid business emails', () => {
            const email = new Email_1.Email('john.doe@company.com');
            (0, vitest_1.expect)(email.isValid()).toBe(true);
        });
    });
    (0, vitest_1.describe)('getVerificationResult method', () => {
        (0, vitest_1.it)('should return valid result for all properly formatted emails', () => {
            const email = new Email_1.Email('john@company.co.uk');
            const result = email.getVerificationResult();
            (0, vitest_1.expect)(result.isValid).toBe(true);
            (0, vitest_1.expect)(result.reason).toBeUndefined();
        });
        (0, vitest_1.it)('should return valid for test emails (basic format validation only)', () => {
            const email = new Email_1.Email('test123@company.com');
            const result = email.getVerificationResult();
            (0, vitest_1.expect)(result.isValid).toBe(true);
        });
        (0, vitest_1.it)('should return valid for fake emails (basic format validation only)', () => {
            const email = new Email_1.Email('fake.user@company.com');
            const result = email.getVerificationResult();
            (0, vitest_1.expect)(result.isValid).toBe(true);
        });
        (0, vitest_1.it)('should return valid for noreply emails (basic format validation only)', () => {
            const email = new Email_1.Email('noreply@company.com');
            const result = email.getVerificationResult();
            (0, vitest_1.expect)(result.isValid).toBe(true);
        });
        (0, vitest_1.it)('should return valid for example domains (basic format validation only)', () => {
            const email = new Email_1.Email('user@example.com');
            const result = email.getVerificationResult();
            (0, vitest_1.expect)(result.isValid).toBe(true);
        });
        (0, vitest_1.it)('should return valid for localhost (basic format validation only)', () => {
            const email = new Email_1.Email('user@localhost.dev');
            const result = email.getVerificationResult();
            (0, vitest_1.expect)(result.isValid).toBe(true);
        });
    });
    (0, vitest_1.describe)('equals method', () => {
        (0, vitest_1.it)('should return true for same emails', () => {
            const email1 = new Email_1.Email('user@example.com');
            const email2 = new Email_1.Email('user@example.com');
            (0, vitest_1.expect)(email1.equals(email2)).toBe(true);
        });
        (0, vitest_1.it)('should return true for same emails with different casing', () => {
            const email1 = new Email_1.Email('USER@EXAMPLE.COM');
            const email2 = new Email_1.Email('user@example.com');
            (0, vitest_1.expect)(email1.equals(email2)).toBe(true);
        });
        (0, vitest_1.it)('should return false for different emails', () => {
            const email1 = new Email_1.Email('user1@example.com');
            const email2 = new Email_1.Email('user2@example.com');
            (0, vitest_1.expect)(email1.equals(email2)).toBe(false);
        });
    });
    (0, vitest_1.describe)('toString method', () => {
        (0, vitest_1.it)('should return email address as string', () => {
            const email = new Email_1.Email('user@example.com');
            (0, vitest_1.expect)(email.toString()).toBe('user@example.com');
        });
    });
    (0, vitest_1.describe)('real-world email formats', () => {
        const validEmails = [
            'user@domain.com',
            'user.name@domain.com',
            'user+tag@domain.com',
            'user123@domain.co.uk',
            'user_name@sub.domain.org',
            'a@b.co',
        ];
        validEmails.forEach(emailStr => {
            (0, vitest_1.it)(`should accept valid email: ${emailStr}`, () => {
                (0, vitest_1.expect)(() => new Email_1.Email(emailStr)).not.toThrow();
            });
        });
        const invalidEmails = [
            'plainaddress',
            '@missingdomain.com',
            'missing@.com',
            'missing@domain',
            'spaces @domain.com',
            'user@domain .com',
            'user@@domain.com',
            'user@domain..com',
        ];
        invalidEmails.forEach(emailStr => {
            (0, vitest_1.it)(`should reject invalid email: ${emailStr}`, () => {
                (0, vitest_1.expect)(() => new Email_1.Email(emailStr)).toThrow();
            });
        });
    });
});
