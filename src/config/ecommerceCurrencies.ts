import { GBP } from '@payloadcms/plugin-ecommerce'
import type { CurrenciesConfig } from '@payloadcms/plugin-ecommerce/types'

/**
 * Single source of truth for GBP-only ecommerce + plugin price fields (`priceInGBP`, etc.).
 * Used by `ecommercePlugin`, client `EcommerceProvider`, and `pricesField` on Services.
 */
export const ecommerceCurrenciesConfig: CurrenciesConfig = {
  defaultCurrency: 'GBP',
  supportedCurrencies: [GBP],
}
