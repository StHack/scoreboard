export type BaseGameConfig = {
  teamSize: number
  baseChallScore: number
  isRewardProportional: boolean
  isDifficultyIncluded: boolean
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

  registrationOpened: false,
  gameOpened: false,
  teamCount: 0,
}
