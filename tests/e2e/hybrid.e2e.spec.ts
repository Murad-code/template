import { test, expect } from '@playwright/test'

const baseURL = 'http://localhost:3000'

test.describe('Hybrid project type', () => {
  test.skip(process.env.PROJECT_TYPE !== 'hybrid', 'Set PROJECT_TYPE=hybrid for this spec')

  test('shop and book routes are reachable', async ({ page }) => {
    await page.goto(`${baseURL}/shop`)
    await expect(page).toHaveURL(/\/shop/)

    await page.goto(`${baseURL}/book`)
    await expect(page.getByRole('heading', { name: /book a service/i })).toBeVisible()
  })
})
