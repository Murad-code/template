import { getSiteConfig } from '@/config/site'
import { getCachedGlobal } from '@/utilities/getGlobals'

import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const config = getSiteConfig()
  const header = await getCachedGlobal('header', 1)()
  const menu = header.navItems ?? []

  return <HeaderClient menu={menu} ecommerceEnabled={config.ecommerceEnabled} />
}
