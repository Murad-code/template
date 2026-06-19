import { test, expect } from '@playwright/test'

const baseURL = 'http://localhost:3000'

const bookingProject =
  process.env.PROJECT_TYPE === 'booking' || process.env.PROJECT_TYPE === 'hybrid'

test.describe('Booking flow', () => {
  test.skip(!bookingProject, 'Set PROJECT_TYPE=booking or hybrid for this spec')

  test.beforeAll(async ({ request }) => {
    const serviceSlug = `pw-booking-service-${Date.now()}`

    await request.post(`${baseURL}/api/admins`, {
      data: { email: 'admin@test.com', password: 'admin', roles: ['admin'] },
    })
    const login = await request.post(`${baseURL}/api/admins/login`, {
      data: { email: 'admin@test.com', password: 'admin' },
    })
    if (!login.ok()) {
      throw new Error('Admin login failed for booking e2e setup')
    }
    const res = await request.post(`${baseURL}/api/services`, {
      data: {
        name: 'Playwright booking service',
        slug: serviceSlug,
        durationMinutes: 30,
        active: true,
        enabledPriceInGBP: false,
      },
    })
    if (!res.ok()) {
      const text = await res.text()
      throw new Error(`Create service failed: ${res.status} ${text}`)
    }
  })

  test('guest can complete a free booking and see confirmation', async ({ page }) => {
    await page.goto(`${baseURL}/book`)
    await expect(page.getByRole('heading', { name: /book a service/i })).toBeVisible()

    const serviceSelect = page.locator('#service')
    if (await serviceSelect.count()) {
      await serviceSelect.selectOption({ index: 1 })
    }
    const dayButton = page.locator('[role="grid"] [role="gridcell"] button:not([disabled])').first()
    const hasBookableDay = await dayButton.isVisible().catch(() => false)
    test.skip(!hasBookableDay, 'No bookable day available in current environment')
    await dayButton.click()

    await expect(page.getByRole('button', { name: /^\d{1,2}:\d{2}$/ }).first()).toBeVisible({ timeout: 15_000 })
    await page.getByRole('button', { name: /^\d{1,2}:\d{2}$/ }).first().click()

    await page.locator('#guestEmail').fill('booking-e2e-guest@test.com')
    await page.getByRole('button', { name: /request booking/i }).click()

    await expect(page).toHaveURL(/\/bookings\/\d+/, { timeout: 20_000 })
    await expect(page.getByText(/booking #/i)).toBeVisible()
  })
})
