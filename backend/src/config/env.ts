/**
 * Environment configuration for provider API keys and secrets
 */

export interface ProviderConfig {
  orionConnect: {
    authKey: string
    baseUrl: string
  }
  nimbusLookup: {
    apiKey: string
    baseUrl: string
  }
  astraDialer: {
    apiKey: string
    baseUrl: string
  }
}

/**
 * Loads and validates environment variables for all providers
 */
export function loadProviderConfig(): ProviderConfig {
  const config: ProviderConfig = {
    orionConnect: {
      authKey: process.env.ORION_CONNECT_AUTH_KEY || '',
      baseUrl: process.env.ORION_CONNECT_BASE_URL || 'https://api.genesy.ai/api/tmp/orionConnect'
    },
    nimbusLookup: {
      apiKey: process.env.NIMBUS_LOOKUP_API_KEY || '',
      baseUrl: process.env.NIMBUS_LOOKUP_BASE_URL || 'https://api.genesy.ai/api/tmp/numbusLookup'
    },
    astraDialer: {
      apiKey: process.env.ASTRA_DIALER_API_KEY || '',
      baseUrl: process.env.ASTRA_DIALER_BASE_URL || 'https://api.genesy.ai/api/tmp/astraDialer'
    }
  }

  // Validate that required API keys are provided
  const missingKeys: string[] = []
  
  if (!config.orionConnect.authKey) {
    missingKeys.push('ORION_CONNECT_AUTH_KEY')
  }
  
  if (!config.nimbusLookup.apiKey) {
    missingKeys.push('NIMBUS_LOOKUP_API_KEY')
  }
  
  if (!config.astraDialer.apiKey) {
    missingKeys.push('ASTRA_DIALER_API_KEY')
  }

  if (missingKeys.length > 0) {
    throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`)
  }

  return config
}

/**
 * Get provider configuration with fallback to default values
 * This version doesn't throw errors for missing keys (useful for development)
 */
export function getProviderConfig(): ProviderConfig {
  return {
    orionConnect: {
      authKey: process.env.ORION_CONNECT_AUTH_KEY || 'mySecretKey123',
      baseUrl: process.env.ORION_CONNECT_BASE_URL || 'https://api.genesy.ai/api/tmp/orionConnect'
    },
    nimbusLookup: {
      apiKey: process.env.NIMBUS_LOOKUP_API_KEY || '000099998888',
      baseUrl: process.env.NIMBUS_LOOKUP_BASE_URL || 'https://api.genesy.ai/api/tmp/numbusLookup'
    },
    astraDialer: {
      apiKey: process.env.ASTRA_DIALER_API_KEY || '1234jhgf',
      baseUrl: process.env.ASTRA_DIALER_BASE_URL || 'https://api.genesy.ai/api/tmp/astraDialer'
    }
  }
}
