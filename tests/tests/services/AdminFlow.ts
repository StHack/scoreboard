import { Browser, Dialog, expect, Page, test } from '@playwright/test'
import { BaseChallenge, CreateUser } from '@sthack/scoreboard-common'
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
      await this.page.goto('/admin')

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

  async goToChallengesPage() {
    await test.step('Go to challenges page', async () => {
      await this.page.goto('/admin/challenges')
      await expect(this.page).toHaveURL('/admin/challenges')
    })
  }

  async goToChallengeCreate() {
    await test.step('Go to challenge create page', async () => {
      await this.page.goto('/admin/challenges/create')

      await expect(this.page.getByRole('heading')).toContainText(
        'Create a new challenge',
      )
    })
  }

  async goToChallengeEdit(challengeName: string) {
    await test.step(`Go to challenge ${challengeName} edition`, async () => {
      await this.page
        .getByRole('listitem')
        .filter({ hasText: challengeName })
        .getByRole('button', { name: 'Edit challenge' })
        .click()

      await expect(this.page).toHaveURL(/\/admin\/challenges\/.+\/edit/)

      await expect(this.page.getByRole('heading')).toContainText(
        `Edition of challenge "${challengeName}"`,
      )
    })
  }

  async openChallengeEditFlag(challengeName: string) {
    await test.step(`Go to challenge ${challengeName} flag edition`, async () => {
      await this.page
        .getByRole('listitem')
        .filter({ hasText: challengeName })
        .getByRole('button', { name: 'Edit flag' })
        .click()

      await expect(
        this.page.getByRole('dialog').getByRole('heading'),
      ).toContainText(`Modification of "${challengeName}" flag`)
    })
  }

  async fillChallengeForm(challenge: Partial<BaseChallenge>) {
    await test.step('Fill challenge form', async () => {
      const popupForm = this.page

      if (challenge.name) {
        await popupForm.getByLabel('Name').fill(challenge.name)
      }

      if (challenge.description) {
        await popupForm
          .getByPlaceholder('Write your description in')
          .fill(challenge.description)
      }

      if (challenge.flag) {
        const flagEdit = popupForm.getByLabel('FlagEdit flag')
        if (await flagEdit.isVisible()) {
          await flagEdit.click()
        }

        await popupForm.getByLabel('Flag').fill(challenge.flag)
      }

      await popupForm.getByRole('button', { name: /(Create|Update)/ }).click()

      await expect(popupForm).toHaveURL('/admin/challenges')
    })
  }

  async editChallengeFlag(
    challengeName: string,
    challenge: Partial<Pick<BaseChallenge, 'flag' | 'flagPattern'>>,
  ) {
    await test.step(`Edit challenge ${challengeName} flag`, async () => {
      const popupForm = this.page.getByRole('dialog')

      if (challenge.flag) {
        const flagEdit = popupForm.getByLabel('Edit flag')
        if (await flagEdit.isVisible()) {
          await flagEdit.click()
        }

        await popupForm.getByLabel('Flag').fill(challenge.flag)
      }

      if (challenge.flagPattern) {
        await popupForm.getByLabel('Flag pattern').fill(challenge.flagPattern)
      }

      await popupForm.getByRole('button', { name: 'Confirm' }).click()

      await expect(popupForm).not.toBeVisible()
    })
  }

  async close() {
    await this.page.context().close()
  }
}
