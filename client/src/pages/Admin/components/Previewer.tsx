import { Challenge, DummyChallenge } from '@sthack/scoreboard-common'
import {
  ChallengeDetailCardPanel,
  ChallengeFlagCardPanel,
  Popup,
} from '@sthack/scoreboard-ui/components'
import { useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'

type PreviewerProps = {
  challenge: Challenge
  readonly?: boolean
  onClose: () => void
}
export function Previewer({ challenge, readonly, onClose }: PreviewerProps) {
  const { attemptChall } = usePlayer()
  const { gameConfig } = useGame()
  return (
    <Popup title={`Preview: ${challenge.name}`} onClose={onClose}>
      <ChallengeDetailCardPanel
        challenge={challenge}
        challScore={fakeChallScore}
        gameConfig={gameConfig}
      >
        {!readonly && (
          <ChallengeFlagCardPanel
            challenge={challenge}
            gameConfig={gameConfig}
            onFlagSubmit={attemptChall}
            score={fakeChallScore}
            inline
          />
        )}
      </ChallengeDetailCardPanel>
    </Popup>
  )
}

const fakeChallScore = {
  challenge: DummyChallenge,
  achievements: [],
  score: 100,
}
