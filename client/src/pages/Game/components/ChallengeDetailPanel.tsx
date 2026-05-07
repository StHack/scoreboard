import { Challenge } from '@sthack/scoreboard-common'
import {
  BoxPanel,
  Button,
  ChallDescriptionDetail,
  Logo,
  MotionBox,
} from '@sthack/scoreboard-ui/components'
import { Messages } from 'components/Messages'
import { useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'
import { useNavigate, useParams } from 'react-router-dom'

export function ChallengeDetailPanel() {
  const { challengeId } = useParams()
  const { challenges } = useGame()

  const challenge = challenges.find(c => c._id === challengeId)

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

  return <ChallengeDetailPanelContent challenge={challenge} />
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
  const navigate = useNavigate()

  return (
    <>
      <title>{`Sthack - ${challenge.name}`}</title>
      <BackButton />
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
      >
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
            onFlagSubmit={async (challengeId, flag) => {
              const result = await attemptChall(challengeId, flag)

              if (result === true) {
                await navigate('/game')
              }

              return result
            }}
          />
          <Messages
            title="Clues"
            messages={messages.filter(m => m.challengeId === challenge._id)}
          />
        </BoxPanel>
      </MotionBox>
    </>
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
