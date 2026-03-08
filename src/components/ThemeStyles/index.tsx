import { getThemeCss } from '@/config/theme'

/**
 * Injects theme CSS variables (:root and [data-theme='dark']) from theme config.
 * Rendered in document head so variables are available to globals.css and Tailwind.
 */
export function ThemeStyles() {
  const css = getThemeCss()
  return <style dangerouslySetInnerHTML={{ __html: css }} data-theme-vars />
}
