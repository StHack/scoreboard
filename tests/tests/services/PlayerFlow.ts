import { Browser, expect, type Page, test } from '@playwright/test'
import { CreateUser } from '@sthack/scoreboard-common'
import { AccountFlow } from './AccountFlow.js'

export class PlayerFlow {
  page: Page
  account: AccountFlow

  constructor(account: AccountFlow) {
    this.account = account
    this.page = account.page
  }

  static async createNewSession(
    browser: Browser,
    user: CreateUser,
  ): Promise<PlayerFlow> {
    const userFlow = await AccountFlow.createNewSession(browser, user)
    return new PlayerFlow(userFlow)
  }

  async goToGame() {
    await this.page.goto('/')

    // if (this.page.url() !== '/') {
    //   await this.account.login({ persistAuth: false, checkAuth: true })
    // }
  }

  async openChallenge(challengeName: string) {
    await test.step(`Open challenge ${challengeName}`, async () => {
      const challButton = this.page.getByRole('button', {
        name: `Open challenge "${challengeName}"`,
      })

      await challButton.click()

      await expect(
        this.page.getByRole('dialog').getByRole('heading'),
      ).toContainText(challengeName)
    })
  }

  async submitFlag(flag: string, isSuccessful: boolean) {
    await test.step('Submit challenge flag', async () => {
      const form = this.page.getByRole('dialog')

      await form.getByPlaceholder('Propose your flag').fill(flag)
      await form.getByRole('button', { name: 'Submit your flag' }).click()
      if (isSuccessful) {
        await expect(form).not.toBeVisible()
      } else {
        await expect(form.getByRole('alert')).toBeVisible()
      }
    })
  }
}
