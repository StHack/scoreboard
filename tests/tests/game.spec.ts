import { expect, Page, test } from '@playwright/test'
import { BaseChallenge, FlagPattern } from '@sthack/scoreboard-common'
import { playwrightUserTest } from './services/AccountFlow.js'
import { AdminFlow } from './services/AdminFlow.js'
import { PlayerFlow } from './services/PlayerFlow.js'

const challengeData = (flag: string): BaseChallenge => ({
  author: '',
  category: 'web',
  description: 'This is my description',
  difficulty: 'easy',
  name: `Testing chall #${new Date().getTime()}`,
  flag,
  flagPattern: FlagPattern.disabled,
  img: '',
})

test('New challenge', async ({ browser }) => {
  const flag = 'STHACK{TH1S_1S_M1_FL4G}'
  const challenge = challengeData(flag)

  const adminFlow = await AdminFlow.createNewSession(browser)

  const player = await PlayerFlow.createNewSession(browser, playwrightUserTest)

  await test.step(`Player - connect to the game`, async () => {
    await player.goToGame()
  })

  await test.step(`Admin - create the challenge`, async () => {
    await adminFlow.goToChallengeCreate()
    await adminFlow.fillChallengeForm(challenge)
  })

  await test.step(`Player - submit the flag`, async () => {
    await player.openChallenge(challenge.name)
    await player.submitFlag(flag, true)
  })
})

test(
  "Edition of challenge doesn't break flag submission",
  {
    tag: ['@Edition-2024'],
  },
  async ({ browser }) => {
    const flag = 'STHACK{TH1S_1S_M1_FL4G}'
    const challenge = challengeData(flag)

    const adminFlow = await AdminFlow.createNewSession(browser)

    const player = await PlayerFlow.createNewSession(
      browser,
      playwrightUserTest,
    )

    await test.step(`Player - go to game`, async () => {
      await player.goToGame()
    })

    await test.step(`Admin - create and update the challenge`, async () => {
      await adminFlow.goToChallengeCreate()
      await adminFlow.fillChallengeForm(challenge)

      await adminFlow.goToChallengeEdit(challenge.name)
      await adminFlow.fillChallengeForm({ description: 'New description' })
    })

    await test.step(`Player - submit flag successfully`, async () => {
      await player.openChallenge(challenge.name)
      await player.submitFlag(flag, true)
    })
  },
)

test('Only the last flag is usable', async ({ browser }) => {
  const flag = 'STHACK{TH1S_1S_M1_FL4G}'
  const challenge = challengeData(flag)

  const adminFlow = await AdminFlow.createNewSession(browser)

  const player = await PlayerFlow.createNewSession(browser, playwrightUserTest)

  await test.step(`Player - go to game`, async () => {
    await player.goToGame()
  })

  await test.step(`Admin - create the challenge`, async () => {
    await adminFlow.goToChallengeCreate()
    await adminFlow.fillChallengeForm(challenge)
  })

  const newFlag = 'STHACK{TH1S_1S_M1_FL4G_2}'

  await test.step(`Admin - update the challenge flag`, async () => {
    await adminFlow.openChallengeEditFlag(challenge.name)
    await adminFlow.editChallengeFlag(challenge.name, { flag: newFlag })
  })

  await test.step(`Player - submit old flag and expect failure`, async () => {
    await player.openChallenge(challenge.name)
    await player.submitFlag(flag, false)

    await expect(player.page.getByRole('alert')).toContainText(
      "That's not the right flag",
    )

    await player.submitFlag(newFlag, true)
  })
})

test(
  'Bruteforce is not allowed',
  {
    tag: ['@Edition-2024'],
  },
  async ({ browser }) => {
    test.slow()
    const flag = 'STHACK{TH1S_1S_M1_FL4G}'
    const challenge = challengeData(flag)

    const adminFlow = await AdminFlow.createNewSession(browser)

    const player = await PlayerFlow.createNewSession(
      browser,
      playwrightUserTest,
    )
    await test.step(`Player - go to game`, async () => {
      await player.goToGame()
    })

    await test.step(`Admin - create the challenge`, async () => {
      await adminFlow.goToChallengesPage()
      await adminFlow.goToChallengeCreate()
      await adminFlow.fillChallengeForm(challenge)
    })

    const invalidFlag = 'STHACK{B4D_FL4G}'

    await test.step(`Player - submit invalid flag multiple times`, async () => {
      await player.openChallenge(challenge.name)

      for (let index = 1; index < 6; index++) {
        await test.step(`Submit flag attempt #${index}`, async () => {
          await player.submitFlag(invalidFlag, false)

          const expectedMessage =
            index > 5
              ? 'Bruteforce is not allowed'
              : "That's not the right flag"
          await expect(player.page.getByRole('alert')).toContainText(
            expectedMessage,
          )
        })
      }
    })

    await test.step(`Player - submit correct flag and expect success`, async () => {
      // explicitely wait for the bruteforce delay to expire
      await player.page.waitForTimeout(5_000)

      await player.submitFlag(flag, true)
    })
  },
)
