import { Browser, Dialog, expect, Page, test } from '@playwright/test'
import { CreateUser } from '@sthack/scoreboard-common'
import { AccountFlow } from './AccountFlow.js'

export class AdminFlow {
  accountFlow: AccountFlow
  page: Page

  static #admin: CreateUser = {
    username: 'user42',
    password: 'user42',
    team: 'admin',
  }

  constructor(page: Page) {
    this.page = page
    this.accountFlow = new AccountFlow(page, AdminFlow.#admin)
  }

  static async createNewSession(browser: Browser): Promise<AdminFlow> {
    return await test.step('Create admin browser', async () => {
      const adminContext = await browser.newContext({
        storageState: AccountFlow.getAuthFilePath(AdminFlow.#admin.username),
      })

      const page = await adminContext.newPage()
      return new AdminFlow(page)
    })
  }

  async forceGameState(state: boolean = true) {
    await test.step(`Force game state to ${state ? 'open' : 'closed'}`, async () => {
      await this.page.goto('/')
      await this.page.getByRole('link', { name: 'Admin' }).click()

      await expect(this.page).toHaveURL('/admin')

      const gameStatusToggler = this.page.getByLabel('Game Status')

      if ((await gameStatusToggler.isChecked()) !== state) {
        const autoClose = (dialog: Dialog) => dialog.accept()
        this.page.on('dialog', autoClose)

        await gameStatusToggler.click()

        this.page.off('dialog', autoClose)
      }

      await expect(gameStatusToggler).toBeChecked({ checked: state })
    })
  }

  async close() {
    await this.page.context().close()
  }
}
