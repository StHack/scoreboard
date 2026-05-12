import {
  Achievement,
  BaseGameConfig,
  Challenge,
  ChallengeScore,
  Survey,
} from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  ChallengeSolverCardPanel,
  ChartSurveys,
  IconSurvey,
  Popup,
} from '@sthack/scoreboard-ui/components'

type DetailChallPopupProps = {
  challenge: Challenge
  challScore: ChallengeScore
  surveys: Survey[]
  gameConfig: BaseGameConfig
  onClose: () => void
}
export function DetailChallPopup({
  challenge,
  challScore,
  surveys,
  gameConfig,
  onClose,
}: DetailChallPopupProps) {
  const breakthrough = challScore.achievements[0]
  return (
    <Popup
      title={
        gameConfig.isNoCompetition
          ? challenge.name
          : `${challenge.name} - ${challScore.score} pts`
      }
      onClose={onClose}
    >
      {breakthrough && (
        <Box as="h3" fontSize="3" textAlign="center" m="3">
          {`Breakthrough ${label(breakthrough)}`}
        </Box>
      )}

      <ChallengeSolverCardPanel challScore={challScore} />

      {surveys.length > 0 && (
        <BoxPanel title="Surveys" titleIcon={IconSurvey}>
          <ChartSurveys surveys={surveys} />
        </BoxPanel>
      )}
    </Popup>
  )
}
const label = ({ username, teamname, createdAt }: Achievement) =>
  ` at ${createdAt.toLocaleTimeString()} by "${username}" of team "${teamname}"`
