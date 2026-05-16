import { expect, test } from '@playwright/test'
import { CreateTeam, CreateUser } from '@sthack/scoreboard-common'
import {
  AccountFlow,
  playwrightUserTeam,
  playwrightUserTest,
} from './services/AccountFlow.js'
import { AdminFlow } from './services/AdminFlow.js'

test('Admin - Login', async ({ page }) => {
  const accountFlow = new AdminFlow(page).accountFlow

  await accountFlow.login({ persistAuth: true })

  await accountFlow.readRules()

  await page.goto('/')
  await expect(page).toHaveURL('/admin')
})

test('User - new one flow', async ({ page, browser }) => {
  const ts = Date.now()
  const user: CreateUser = {
    username: `User-${ts}`,
    password: `Password-${ts}`,
  }
  const team: CreateTeam = {
    name: `Team-${ts}`,
  }

  const accountFlow = new AccountFlow(page, user)

  await accountFlow.register()

  const adminFlow = await AdminFlow.createNewSession(browser)
  await adminFlow.forceGameState(false)

  await accountFlow.login({ persistAuth: false, checkAuth: false })
  await accountFlow.readRules()
  await accountFlow.createTeam(team)

  await test.step('When game is closed, user can only go to the team page', async () => {
    await page.goto('/')
    await expect(page).toHaveURL('/account/team')
  })

  await adminFlow.forceGameState(true)

  await page.goto('/')
  await expect(page).toHaveURL('/game')
})

test('User - Create reusable test account', async ({ page, browser }) => {
  const adminFlow = await AdminFlow.createNewSession(browser)
  await adminFlow.forceGameState(true)

  const accountFlow = new AccountFlow(page, playwrightUserTest)

  await accountFlow.register({ checkRegister: false })

  await accountFlow.login({ checkAuth: false, persistAuth: true })

  await accountFlow.readRules()

  await accountFlow.createTeam(playwrightUserTeam)
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

  await userFlow.page.goto('/')

  await expect(userFlow.page).toHaveURL('/account/team')
})

test('Admin - Toggle game status', async ({ browser }) => {
  const adminFlow = await AdminFlow.createNewSession(browser)

  await adminFlow.forceGameState(true)

  await adminFlow.forceGameState(false)
})
