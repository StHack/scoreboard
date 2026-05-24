import { Challenge } from '@sthack/scoreboard-common'
import {
  BoxPanel,
  Button,
  ChallengeDetailCardPanel,
  ChallengeFlagCardPanel,
  ChallengeSolverCardPanel,
  IconClue,
  Loader,
  Logo,
  MotionBox,
} from '@sthack/scoreboard-ui/components'
import { ReactMarkdownRenderers } from '@sthack/scoreboard-ui/styles'
import { Messages } from 'components/Messages'
import { GameContextLoadingState, useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import { SurveyPanel } from './SurveyPanel'

export function ChallengeDetailPanel() {
  const { challengeId } = useParams()
  const { challenges, isLoaded } = useGame()

  const challenge = challenges.find(c => c._id === challengeId)

  if (!isLoaded(GameContextLoadingState.challenges)) {
    return <Loader size="10" placeSelf="center" gridArea="chall" />
  }

  if (!challenge) {
    return (
      <>
        <BackButton />
        <BoxPanel
          title="This challenge doesn't exist"
          placeSelf="center"
          gridArea="chall"
          p="4"
          gap="4"
        >
          <Logo />
        </BoxPanel>
      </>
    )
  }

  return (
    <>
      <title>{`Sthack - ${challenge.name}`}</title>
      <BackButton />
      <ChallengeDetailPanelContent challenge={challenge} />
    </>
  )
}

type ChallengeDetailPanelContentProps = {
  challenge: Challenge
}

function ChallengeDetailPanelContent({
  challenge,
}: ChallengeDetailPanelContentProps) {
  const {
    gameConfig,
    score: { challsScore },
    messages,
    surveys,
  } = useGame()
  const { myTeamScore, attemptChall } = usePlayer()

  const achievement = myTeamScore.solved.find(
    a => a.challengeId === challenge._id,
  )

  const survey = achievement
    ? surveys.find(s => s.achievementId === achievement._id)
    : undefined

  const clues = messages.filter(m => m.challengeId === challenge._id)
  const challScore = challsScore[challenge._id]

  return (
    <MotionBox
      layout
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      gridArea="chall"
      display="flex"
      flexDirection="column"
      gap="2"
      overflowY="auto"
    >
      <BoxPanel
        title={
          <>
            {challenge.name}
            <Logo size="2" />
          </>
        }
        titleIcon={Logo}
        titleProps={{
          // @ts-expect-error irrelevant error
          as: 'h1',
          justifySelf: 'center',
          fontSize: '4',
        }}
      />
      {achievement && !survey && <SurveyPanel achievement={achievement} />}

      <ChallengeDetailCardPanel
        title="Description"
        challenge={challenge}
        challScore={challScore}
        gameConfig={gameConfig}
        currentTeam={myTeamScore.team}
      >
        <ChallengeTokenPanel challenge={challenge} />
        <ChallengeFlagCardPanel
          challenge={challenge}
          teamScore={myTeamScore}
          gameConfig={gameConfig}
          score={challScore}
          onFlagSubmit={attemptChall}
          inline
        />
      </ChallengeDetailCardPanel>

      {clues.length > 0 && (
        <Messages
          title="Clues"
          titleProps={{}}
          titleIcon={IconClue}
          messages={clues}
        />
      )}

      <ChallengeSolverCardPanel
        title="Who has already finish it?"
        challScore={challScore}
      />
    </MotionBox>
  )
}

function BackButton() {
  const navigate = useNavigate()
  return (
    <Button
      gridArea="control"
      onClick={() => navigate(-1)}
      justifySelf="start"
      alignSelf="center"
    >
      Go back
    </Button>
  )
}

function ChallengeTokenPanel({ challenge }: { challenge: Challenge }) {
  const { myTokens } = usePlayer()
  const token = myTokens.find(t => t.challengeId === challenge._id)

  if (!token) {
    return undefined
  }

  return (
    <ReactMarkdown components={ReactMarkdownRenderers}>
      {`> For this challenge, you should use this token to access it: \`${token.value}\``}
    </ReactMarkdown>
  )
}
