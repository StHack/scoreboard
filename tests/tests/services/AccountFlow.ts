import { Browser, expect, type Page, test } from '@playwright/test'
import { CreateTeam, CreateUser } from '@sthack/scoreboard-common'

export class AccountFlow {
  page: Page
  user: CreateUser

  constructor(page: Page, user: CreateUser) {
    this.page = page
    this.user = user
  }

  static async createNewSession(
    browser: Browser,
    user: CreateUser,
  ): Promise<AccountFlow> {
    return await test.step(`Create ${user.username} browser`, async () => {
      const userContext = await browser.newContext({
        storageState: AccountFlow.getAuthFilePath(user.username),
      })

      const page = await userContext.newPage()
      return new AccountFlow(page, user)
    })
  }

  static getAuthFilePath(name: string) {
    return `playwright/.auth/${name}.json`
  }

  get authFilePath() {
    return AccountFlow.getAuthFilePath(this.user.username)
  }

  async register({
    checkRegister = true,
  }: Partial<{ checkRegister: boolean }> = {}) {
    await test.step('Register', async () => {
      await this.page.goto('/auth/register')

      await test.step('Fill the form', async () => {
        await this.page.getByLabel('Username').fill(this.user.username)
        await this.page.getByLabel('Password').fill(this.user.password)
        await this.page.getByRole('button', { name: 'Register' }).click()
      })

      if (checkRegister) {
        await expect(this.page).toHaveURL('/auth/login')
      }
    })
  }

  async login({
    persistAuth = false,
    checkAuth = true,
  }: Partial<AccountFLowLoginOption> = {}) {
    await test.step('Login', async () => {
      await this.page.goto('/auth/login')

      await test.step('Fill the form', async () => {
        await this.page.getByLabel('Username').fill(this.user.username)
        await this.page.getByLabel('Password').fill(this.user.password)
        await this.page.getByRole('button', { name: 'Login' }).click()
      })

      if (checkAuth) {
        await this.checkAuth()
      }

      if (persistAuth) {
        await this.page.context().storageState({ path: this.authFilePath })
      }
    })
  }

  async createTeam(team: CreateTeam) {
    await test.step('Create team', async () => {
      await this.page.goto('/account/team')

      const title = await this.page
        .getByRole('heading', { level: 2 })
        .textContent()

      if (title !== team.name) {
        await this.page.getByRole('button', { name: 'Create a team' }).click()

        await test.step('Fill the form', async () => {
          await this.page.getByLabel('Team name').fill(team.name)
          await this.page
            .getByRole('button', { name: 'Create my team' })
            .click()
        })

        await expect(
          this.page.getByRole('heading', { level: 2 }),
        ).toContainText(team.name)
      }
    })
  }

  async checkAuth() {
    await expect(this.page.getByRole('banner')).toContainText(
      this.user.username,
    )
  }

  async readRules() {
    await test.step('Read the rules', async () => {
      await this.page.goto('/rules')

      await expect(
        this.page.getByRole('heading', { name: 'Rules', exact: true }),
      ).toBeVisible()

      await this.page.getByLabel('I confirm that I have read').click()

      await this.page.context().storageState({ path: this.authFilePath })
    })
  }
}

export const playwrightUserTest: CreateUser = {
  username: `playwright-test`,
  password: `playwright-test`,
}

export const playwrightUserTeam: CreateTeam = {
  name: 'playwright-test',
}

type AccountFLowLoginOption = {
  persistAuth: boolean
  checkAuth: boolean
}
