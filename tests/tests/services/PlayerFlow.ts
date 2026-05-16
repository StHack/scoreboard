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
    await test.step(`[${this.account.user.username}] Go to game page`, async () => {
      await this.page.goto('/game')
      // await waitForSpecificMessage(
      //   this.page,
      //   'ws://localhost:3000/api/socket/',
      //   '/api/game,1',
      // )
      await expect(this.page).toHaveURL('/game')
    })
  }

  async openChallenge(challengeName: string) {
    await test.step(`[${this.account.user.username}] Open challenge ${challengeName}`, async () => {
      await this.page.waitForTimeout(1000)
      await this.page
        .getByRole('link', {
          name: `Open challenge "${challengeName}"`,
        })
        .click()

      await expect(this.page.getByRole('heading', { level: 1 })).toContainText(
        challengeName,
      )
    })
  }

  async submitFlag(flag: string, isSuccessful: boolean) {
    await test.step(`[${this.account.user.username}] Submit challenge flag`, async () => {
      await this.page.waitForTimeout(1000)
      const form = this.page.locator('form[name="flag-submit"]')

      await form.getByRole('textbox').fill(flag)
      await form.getByRole('button', { name: 'Submit your flag' }).click()
      if (isSuccessful) {
        await expect(form).not.toBeVisible()
      } else {
        await expect(form.getByRole('alert')).toBeVisible()
      }
    })
  }
}
