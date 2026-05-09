import { Challenge } from '@sthack/scoreboard-common'
import {
  BoxPanel,
  Button,
  ChallDescriptionDetail,
  Loader,
  Logo,
  MotionBox,
} from '@sthack/scoreboard-ui/components'
import { Messages } from 'components/Messages'
import { GameContextLoadingState, useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'
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
  } = useGame()
  const { myTeamScore, attemptChall } = usePlayer()

  const achievement = myTeamScore.solved.find(
    a => a.challengeId === challenge._id,
  )

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
      gap="3"
      overflowY="auto"
    >
      <MotionBox
        layout
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 },
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {achievement && <SurveyPanel achievement={achievement} />}
      </MotionBox>

      <BoxPanel
        title={challenge.name}
        titleProps={{
          justifySelf: 'center',
          fontSize: '4',
        }}
      >
        <ChallDescriptionDetail
          challenge={challenge}
          teamScore={myTeamScore}
          gameConfig={gameConfig}
          score={challsScore[challenge._id]}
          onFlagSubmit={attemptChall}
        />
      </BoxPanel>

      <Messages
        title="Clues"
        messages={messages.filter(m => m.challengeId === challenge._id)}
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
