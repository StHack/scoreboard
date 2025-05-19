import { expect, test } from '@playwright/test'
import { CreateUser } from '@sthack/scoreboard-common'
import { AccountFlow, playwrightUserTest } from './services/AccountFlow.js'
import { AdminFlow } from './services/AdminFlow.js'

test('Admin - Login', async ({ page }) => {
  const accountFlow = new AdminFlow(page).accountFlow

  await accountFlow.login({ persistAuth: true })

  await accountFlow.readRules()
})

test('User - new one flow', async ({ page, browser }) => {
  const ts = Date.now()
  const user: CreateUser = {
    username: `User-${ts}`,
    password: `Password-${ts}`,
    team: `Team-${ts}`,
  }

  const accountFlow = new AccountFlow(page, user)

  await accountFlow.register()

  const adminFlow = await AdminFlow.createNewSession(browser)
  await adminFlow.forceGameState(false)

  await test.step('When game is closed, user cannot connect', async () => {
    await accountFlow.login({ persistAuth: false, checkAuth: false })
    await expect(page.getByText('Unauthorized')).toBeVisible()
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  await adminFlow.forceGameState(true)

  await accountFlow.login({ persistAuth: false })

  await accountFlow.readRules()

  await expect(page).toHaveURL('/game')
})

test('User - Create reusable test account', async ({ page, browser }) => {
  const adminFlow = await AdminFlow.createNewSession(browser)
  await adminFlow.forceGameState(true)

  const accountFlow = new AccountFlow(page, playwrightUserTest)

  await accountFlow.register({ checkRegister: false })

  await accountFlow.login({ checkAuth: false, persistAuth: true })

  await accountFlow.readRules()
})

test('User - should be kicked on game ended', async ({ browser }) => {
  const adminFlow = await AdminFlow.createNewSession(browser)
  await adminFlow.forceGameState(true)

  const userFlow = await AccountFlow.createNewSession(
    browser,
    playwrightUserTest,
  )
  // await userFlow.login({ persistAuth: false })

  await test.step('Connect user', async () => {
    await userFlow.page.goto('/')
    await userFlow.checkAuth()
  })

  await test.step('Admin - End the game', async () => {
    await adminFlow.forceGameState(false)
  })

  await expect(userFlow.page).toHaveURL('/auth/login')

  await userFlow.page.reload()

  await expect(userFlow.page).toHaveURL('/auth/login')

  await userFlow.login({ checkAuth: false })

  await expect(userFlow.page.getByRole('alert')).toContainText('Unauthorized')
})

test('Admin - Toggle game status', async ({ browser }) => {
  const adminFlow = await AdminFlow.createNewSession(browser)

  await adminFlow.forceGameState(true)

  await adminFlow.forceGameState(false)
})
