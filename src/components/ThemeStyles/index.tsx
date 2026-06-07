import { getThemeCss } from '@/config/theme'
import { getLandingThemeCss } from '@/config/siteTheme'
import { getCachedGlobal } from '@/utilities/getGlobals'

/**
 * Injects theme CSS variables (:root and [data-theme='dark']) from theme config.
 * Rendered in document head so variables are available to globals.css and Tailwind.
 */
export async function ThemeStyles() {
  const siteTheme = await getCachedGlobal('site-theme', 1)()
  const css = `${getThemeCss()}\n${getLandingThemeCss(siteTheme)}`

  return <style dangerouslySetInnerHTML={{ __html: css }} data-theme-vars />
}
