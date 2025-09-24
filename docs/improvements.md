# Explanation of my take-home assessment

## 🚀 Product perspective Improvements

### Temporal Phone Waterfall
Implemented a **Temporal workflow** that finds a user's phone number by querying three providers in sequence: Orion Connect (best data, slow), Nimbus Lookup (new provider), and Astra Dialer (fastest, worst data). The workflow stops early when a phone is found and saves it to the database.

The provider order was strategically chosen to prioritize **data quality over speed**, ensuring customers receive the most accurate and reliable phone numbers. We start with the highest-quality provider (Orion Connect) and fall back to faster but lower-quality providers only when necessary, maximizing customer value while maintaining reasonable response times.

From my point of view the product should ask for feedback to the customers in order to evaluate if new providers are working well.

### Data Validation System
Added comprehensive validation for all lead data fields (email, phone, names, company info) with proper error messages. Implemented both strict validation for new data and lenient validation for existing data to handle bulk imports without breaking.

### CSV Bulk Import Enhancement
Improved the CSV import process with better validation, error handling, and user feedback. Users can now see exactly which rows have issues and fix them before importing.

### Domain-Driven Design Architecture
Implemented a clean, scalable architecture using Domain-Driven Design principles with value objects, repositories, and proper separation of concerns. This ensures maintainability and makes the codebase easier to understand and extend.

### Comprehensive Testing Strategy
Added extensive test coverage including unit tests for value objects, domain entities, Temporal workflows, and activities. All tests use proper mocking and follow Temporal testing best practices.

---

## ⚙️ Installation instructions

Installation instructions of my take-home assessment.

1. Please go to backend/
2. Duplicate env.sample to .env
3. Fill the .env with the urls and api_keys provided in /README.md

---

## ⚙️ Technical perspective improvements in detail

### Domain Driven Design
I made a comprehensive refactor to domain driven design that includes:

#### 1. Clean Architecture Structure
* **Separate endpoints for each context**: Each endpoint follows the single responsibility principle, preventing bugs in one API from affecting others
    * Check implementation: `backend/src/leads/interfaces/http/leads.ts`
* **Application layer**: Separated use cases that contain specific business logic without external dependencies
    * `BulkImportLeads.ts` - Handles CSV import logic
    * `EnrichPhoneNumbers.ts` - Manages phone enrichment workflow
    * `GenerateMessages.ts` - Creates personalized messages
    * `VerifyEmails.ts` - Handles email verification process

#### 2. Domain Layer Implementation
* **Lead Entity**: Central domain entity (`Lead.ts`) that encapsulates business rules and state management
    * Factory methods: `create()`, `fromPersistence()`, `fromPersistenceLenient()`
    * Business methods: `updatePhone()`, `equals()`
    * Immutable design with proper encapsulation

#### 3. Value Objects with Validation

In our previous Backend implementation data management and validation was not implemented. 
With this approach each value in the database are described as a value object with their proper validation in the code
This ensures scalibility and manintability in the future.

* **Email**: Email format validation with regex patterns
* **Phone**: International phone number validation
* **FirstName/LastName**: Name validation with length constraints
* **JobTitle**: Professional title validation
* **CompanyName**: Company name validation
* **CompanyWebsite**: URL format validation with domain structure
* **CountryCode**: 2-letter country code validation
* **Message**: Message content validation

#### 4. Repository Pattern
* **LeadRepository Interface**: Defines contract for data persistence
* **LeadPrismaRepository**: Concrete implementation using Prisma ORM
* **Separation of concerns**: Domain logic separated from data access

#### 5. Comprehensive Testing Strategy
* **Unit Tests for Value Objects**: Each value object has dedicated test coverage
* **Domain Entity Tests**: Lead entity business logic testing
* **Activity Tests**: Temporal workflow activity testing with proper mocking
* **Workflow Tests**: End-to-end workflow testing with Temporal SDK
* **Validation Testing**: Edge cases and error scenarios covered

#### 6. Validation Strategy
* **Strict Validation**: Applied when creating new data
* **Lenient Validation**: Used for persistence operations to handle existing data
* **Frontend-Backend Alignment**: Consistent validation rules across layers
* **Error Handling**: Comprehensive error messages for better user experience

#### 7. Technical Improvements
* **TypeScript Integration**: Full type safety across all layers
* **Path Aliases**: Clean import paths using `@` aliases in vitest configuration
* **Modular Design**: Each component has a single responsibility
* **Error Boundaries**: Proper error handling and propagation
* **Immutable Value Objects**: Prevents accidental state mutations
* **Factory Pattern**: Clean object creation with validation
* **Dependency Injection**: Loose coupling between layers

#### 8. Workflow Architecture Improvements
* **Temporal Integration**: Proper workflow orchestration using Temporal SDK
* **Activity Separation**: Each activity has a single responsibility
    * `orionConnectActivity` - Orion Connect provider integration
    * `nimbusLookupActivity` - Nimbus Lookup provider integration  
    * `astraDialerActivity` - Astra Dialer provider integration
    * `savePhoneActivity` - Database persistence for enriched phone numbers
* **Error Handling**: Robust error handling in workflow activities
* **Provider Fallback**: Sequential provider execution with proper fallback logic
* **Testing Strategy**: Comprehensive testing of workflows and activities using Temporal testing SDK

#### 9. Data Validation Enhancements
* **Phone Number Validation**: International format support with proper regex patterns
* **Email Validation**: RFC-compliant email validation with edge case handling
* **Website Validation**: Domain structure validation for company websites
* **Country Code Validation**: ISO 3166-1 alpha-2 country code validation
* **Bulk Import Validation**: Frontend and backend validation alignment for CSV imports

### Temporal Phone Waterfall Implementation

#### 10. Workflow Architecture
* **Sequential Provider Execution**: Implemented waterfall pattern with three providers
    * **Orion Connect** (Primary) - Best data quality, slower response
    * **Nimbus Lookup** (Secondary) - New market provider
    * **Astra Dialer** (Tertiary) - Fastest provider, lower data quality
* **Early Termination**: Workflow stops immediately when phone number is found
* **Idempotent Design**: Only one workflow execution per lead to prevent duplicates

#### 11. Activity Implementation
* **Provider Activities**: Each provider has dedicated activity with proper error handling
    * `orionConnectActivity` - Processes Orion Connect API calls
    * `nimbusLookupActivity` - Processes Nimbus Lookup API calls
    * `astraDialerActivity` - Processes Astra Dialer API requests
* **Save Activity**: `savePhoneActivity` - Persists enriched phone numbers to database
* **Error Handling**: Comprehensive error handling with proper fallback mechanisms

#### 12. Provider Integration Details
* **Orion Connect**: 
    - Uses `fullName` and `companyWebsite` for lookup
    - Authentication via `x-auth-me` header
    - Best data quality but slower response times
* **Nimbus Lookup**:
    - Uses `email` and `jobTitle` for lookup
    - Authentication via query parameter `api`
    - Returns structured data with country code
* **Astra Dialer**:
    - Uses `email` for lookup
    - Authentication via `apiKey` header
    - Fastest response but lower data quality

#### 13. Workflow Features - Requirements Implementation

**✅ Each provider call is an activity with short timeout:**
- **Orion Connect**: 30 seconds timeout (best data, slower response)
- **Nimbus Lookup**: 20 seconds timeout (new provider)
- **Astra Dialer**: 15 seconds timeout (fastest provider)
- **Save Phone**: 10 seconds timeout (database operation)

**✅ Retry policy with 3 attempts and exponential backoff:**
- **Orion Connect**: 3 attempts, 2.0 backoff coefficient, max 10 seconds
- **Nimbus Lookup**: 3 attempts, 2.0 backoff coefficient, max 8 seconds  
- **Astra Dialer**: 5 attempts, 1.5 backoff coefficient, max 5 seconds
- **Save Phone**: 3 attempts, 2.0 backoff coefficient, max 5 seconds

**✅ Stop early when phone is found:**
- Workflow terminates immediately after successful phone discovery
- No unnecessary calls to remaining providers
- Efficient resource usage and faster response times

**✅ Idempotent workflow (only one per lead):**
- Unique workflow ID: `enrich-phone-${lead.id}` (line 50 in `EnrichPhoneNumbers.ts`)
- Temporal prevents duplicate executions automatically
- Consistent results regardless of retry attempts

**✅ Abstraction layer for different provider inputs:**
- **Orion Connect**: Uses `fullName` + `companyWebsite`
- **Nimbus Lookup**: Uses `email` + `jobTitle` 
- **Astra Dialer**: Uses `email` only
- Unified `PhoneEnrichmentInput` interface handles all variations

**✅ Process feedback to user:**
- Console logging for each provider attempt
- Success/failure status reporting
- Error messages for debugging and monitoring
- Frontend integration ready for real-time updates

**✅ Frontend updates:**
- Database persistence triggers frontend refresh
- Lead list updates automatically when phone is enriched
- User can see enrichment status and results

**✅ Rate limit awareness (Nice to have):**
- Exponential backoff automatically handles 429 rate limit errors
- Provider-specific retry policies for different rate limits
- Graceful degradation when rate limited

#### 14. Testing Strategy
* **Unit Tests**: Comprehensive testing of each activity
* **Integration Tests**: End-to-end workflow testing
* **Mock Providers**: Isolated testing without external API calls
* **Error Scenarios**: Testing all failure modes and edge cases
* **Temporal SDK Testing**: Proper workflow testing using `@temporalio/testing`

---

## 🐛 Bug Fixes

### 1. Email Validation Bug

**Problem**: Email verification feature was running indefinitely without providing feedback to users.

**Root Cause Analysis**:
- **File**: `backend/src/workflows/activities/utils.ts`
- **Issue**: The `verifyEmail` method contained incorrect validation logic
- **Impact**: Users experienced infinite loading states with no error feedback
- **Architecture Problem**: Email validation was unnecessarily placed within Temporal workflows

**Solution Implemented**:

For validate emails we don't need distributed systems, it's a simpler string validation with some patterns that can be easly validated by our API, this adds value to our product because: will be faster (less logic operations), scalable and easy to maintain.

- **Moved email validation to API layer**: Relocated validation logic from Temporal activities to the application layer

**Technical Changes**:
- Removed `verifyEmail` method from Temporal activities
- Implemented email validation in `Email` value object with proper regex patterns
- Added comprehensive error handling in `VerifyEmailsController`
- Enhanced frontend validation alignment

### 2. Country Code Validation Bug

**Problem**: CSV imports were displaying invalid characters in country code fields instead of proper ISO country codes.

**Root Cause Analysis**:
- **Missing validation**: No proper validation for country code format
- **Data inconsistency**: Numbers and special characters appearing in country code fields
- **Frontend-backend mismatch**: Inconsistent validation rules between client and server

**Solution Implemented**:
- **Frontend validation**: Enhanced CSV parser to validate country codes during import
- **Backend validation**: Implemented `CountryCode` value object with ISO 3166-1 alpha-2 validation
- **Data cleaning**: Added preprocessing to clean invalid country code data
- **User feedback**: Clear error messages for invalid country codes

**Technical Changes**:
- Created `CountryCode` value object with regex validation: `/^[A-Z]{2}$/`
- Updated `csvParser.ts` to validate country codes during CSV processing
- Added proper error handling and user notifications
- Implemented data sanitization for existing records