export type BaseGameConfig = {
  teamSize: number
  baseChallScore: number
  isRewardProportional: boolean
  isDifficultyIncluded: boolean
  isNoCompetition: boolean
}

export type GameConfig = BaseGameConfig & {
  registrationOpened: boolean
  gameOpened: boolean
  teamCount: number
}

export const DefaultGameConfig: GameConfig = {
  baseChallScore: 50,
  teamSize: 5,
  isRewardProportional: true,
  isDifficultyIncluded: false,
  isNoCompetition: true,

  registrationOpened: false,
  gameOpened: false,
  teamCount: 0,
}
