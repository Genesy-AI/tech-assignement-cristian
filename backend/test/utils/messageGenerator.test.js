"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const MessageTemplateService_1 = require("../../src/leads/domain/services/MessageTemplateService");
(0, vitest_1.describe)('generateMessageFromTemplate', () => {
    const fullLead = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
        companyName: 'Tech Corp',
        countryCode: 'US',
    };
    const partialLead = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        jobTitle: undefined,
        companyName: '',
        countryCode: 'CA',
    };
    const minimalLead = {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
    };
    (0, vitest_1.describe)('successful message generation', () => {
        (0, vitest_1.it)('should replace single field in template', () => {
            const template = 'Hello {firstName}!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello John!');
        });
        (0, vitest_1.it)('should replace multiple different fields in template', () => {
            const template = 'Hi {firstName} {lastName}, welcome to {companyName}!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hi John Doe, welcome to Tech Corp!');
        });
        (0, vitest_1.it)('should replace the same field multiple times', () => {
            const template = 'Hello {firstName}, how are you {firstName}?';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello John, how are you John?');
        });
        (0, vitest_1.it)('should handle template with all available fields', () => {
            const template = 'Name: {firstName} {lastName}, Email: {email}, Job: {jobTitle} at {companyName}, Country: {countryCode}';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Name: John Doe, Email: john.doe@example.com, Job: Software Engineer at Tech Corp, Country: US');
        });
        (0, vitest_1.it)('should handle template with no field placeholders', () => {
            const template = 'This is a static message with no placeholders.';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('This is a static message with no placeholders.');
        });
        (0, vitest_1.it)('should handle empty template', () => {
            const template = '';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('');
        });
        (0, vitest_1.it)('should handle complex message template', () => {
            const template = 'Dear {firstName},\n\nI hope this message finds you well. I noticed you work at {companyName} as a {jobTitle}. I would love to connect with you.\n\nBest regards!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Dear John,\n\nI hope this message finds you well. I noticed you work at Tech Corp as a Software Engineer. I would love to connect with you.\n\nBest regards!');
        });
    });
    (0, vitest_1.describe)('error handling for missing fields', () => {
        (0, vitest_1.it)('should throw error when field is null', () => {
            const leadWithNullField = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                jobTitle: null,
            };
            const template = 'Your job title is {jobTitle}';
            (0, vitest_1.expect)(() => (0, MessageTemplateService_1.generateMessageFromTemplate)(template, leadWithNullField)).toThrow('Missing required field: jobTitle');
        });
        (0, vitest_1.it)('should throw error when field is undefined', () => {
            const template = 'Your job title is {jobTitle}';
            (0, vitest_1.expect)(() => (0, MessageTemplateService_1.generateMessageFromTemplate)(template, partialLead)).toThrow('Missing required field: jobTitle');
        });
        (0, vitest_1.it)('should throw error when field is empty string', () => {
            const template = 'You work at {companyName}';
            (0, vitest_1.expect)(() => (0, MessageTemplateService_1.generateMessageFromTemplate)(template, partialLead)).toThrow('Missing required field: companyName');
        });
        (0, vitest_1.it)('should throw error when field does not exist on lead', () => {
            const leadWithMissingField = {
                firstName: 'Bob',
                lastName: 'Johnson',
                email: 'bob@example.com',
                jobTitle: undefined,
            };
            const template = 'Your job title is {jobTitle}';
            (0, vitest_1.expect)(() => (0, MessageTemplateService_1.generateMessageFromTemplate)(template, leadWithMissingField)).toThrow('Missing required field: jobTitle');
        });
    });
    (0, vitest_1.describe)('handling of unknown and invalid fields', () => {
        (0, vitest_1.it)('should throw error for unknown field in template', () => {
            const template = 'Hello {firstName} {unknownField}!';
            (0, vitest_1.expect)(() => (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead)).toThrow('Unknown field in template: unknownField');
        });
        (0, vitest_1.it)('should ignore invalid field patterns with hyphens', () => {
            const template = 'Hello {first-name}!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello {first-name}!');
        });
        (0, vitest_1.it)('should ignore invalid field patterns with spaces', () => {
            const template = 'Hello {first name}!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello {first name}!');
        });
    });
    (0, vitest_1.describe)('edge cases and malformed templates', () => {
        (0, vitest_1.it)('should handle malformed brackets (single opening bracket)', () => {
            const template = 'Hello {firstName';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello {firstName');
        });
        (0, vitest_1.it)('should handle malformed brackets (single closing bracket)', () => {
            const template = 'Hello firstName}';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello firstName}');
        });
        (0, vitest_1.it)('should ignore empty brackets', () => {
            const template = 'Hello {} {firstName}!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello {} John!');
        });
        (0, vitest_1.it)('should handle nested brackets', () => {
            const template = 'Hello {{firstName}}!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            (0, vitest_1.expect)(result).toBe('Hello {John}!');
        });
        (0, vitest_1.it)('should handle brackets with numbers', () => {
            const template = 'Hello {firstName123}!';
            (0, vitest_1.expect)(() => (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead)).toThrow('Unknown field in template: firstName123');
        });
        (0, vitest_1.it)('should handle case sensitivity', () => {
            const template = 'Hello {FirstName}!';
            (0, vitest_1.expect)(() => (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead)).toThrow('Unknown field in template: FirstName');
        });
    });
    (0, vitest_1.describe)('performance and large templates', () => {
        (0, vitest_1.it)('should handle template with many field replacements', () => {
            const template = Array(100).fill('{firstName}').join(' ');
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, fullLead);
            const expected = Array(100).fill('John').join(' ');
            (0, vitest_1.expect)(result).toBe(expected);
        });
        (0, vitest_1.it)('should handle very long field values', () => {
            const longLead = {
                firstName: 'A'.repeat(1000),
                lastName: 'Long',
                email: 'long@example.com',
                companyName: 'B'.repeat(500),
            };
            const template = 'Name: {firstName}, Company: {companyName}';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, longLead);
            (0, vitest_1.expect)(result).toBe(`Name: ${'A'.repeat(1000)}, Company: ${'B'.repeat(500)}`);
        });
    });
    (0, vitest_1.describe)('special characters and encoding', () => {
        (0, vitest_1.it)('should handle special characters in field values', () => {
            const specialLead = {
                firstName: 'José',
                lastName: 'García',
                email: 'josé@café.com',
                companyName: 'Café & Co.',
            };
            const template = 'Hello {firstName} from {companyName}! Email: {email}';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, specialLead);
            (0, vitest_1.expect)(result).toBe('Hello José from Café & Co.! Email: josé@café.com');
        });
        (0, vitest_1.it)('should handle emojis in field values', () => {
            const emojiLead = {
                firstName: 'John 😊',
                lastName: 'Emoji',
                email: 'john@example.com',
                companyName: 'TechCorp 🚀',
            };
            const template = 'Hi {firstName} from {companyName}!';
            const result = (0, MessageTemplateService_1.generateMessageFromTemplate)(template, emojiLead);
            (0, vitest_1.expect)(result).toBe('Hi John 😊 from TechCorp 🚀!');
        });
    });
});
