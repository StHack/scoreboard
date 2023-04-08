import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ChallengeCard } from 'components/ChallengeCard'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { useState } from 'react'
import { exportAsJson } from 'services/share'
import { ChallengeForm } from './ChallengeForm'
import { ChallDescriptionPopup } from 'components/ChallDescriptionPopup'
import { Message } from 'models/Message'

export function ChallengePanel () {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const { challenges, brokeChallenge, repairChallenge } = useAdmin()
  const [challToEdit, setChallToEdit] = useState<Challenge>()
  const {
    messages,
    score: { challsScore },
  } = useGame()

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" gap="2">
        <Button onClick={() => setOpenEdit(true)}>Create challenge</Button>
        <Button
          onClick={() => {
            exportAsJson(challenges, 'challenges')
          }}
        >
          Export as JSON
        </Button>
      </Box>

      <Box
        display={['flex', 'grid']}
        flexDirection="column"
        gridTemplateColumns="repeat(auto-fit, minmax(40rem, 1fr))"
      >
        {challenges.map(c => (
          <ChallengeBlock
            key={c.name}
            chall={c}
            score={challsScore[c.name]}
            messages={messages.filter(m => m.challenge === c.name)}
            onBrokeClick={brokeChallenge}
            onEditClick={() => {
              setChallToEdit(c)
              setOpenEdit(true)
            }}
            onRepairClick={repairChallenge}
          />
        ))}
      </Box>

      {openEdit && (
        <ChallengeForm
          chall={challToEdit}
          onClose={() => {
            setOpenEdit(false)
            setChallToEdit(undefined)
          }}
        />
      )}
    </Box>
  )
}

type ChallengeBlockProps = {
  chall: Challenge
  score: ChallengeScore
  messages: Message[]
  onBrokeClick: (chall: Challenge) => void
  onEditClick: (chall: Challenge) => void
  onRepairClick: (chall: Challenge) => void
}

function ChallengeBlock ({
  chall,
  score,
  messages,
  onBrokeClick,
  onEditClick,
  onRepairClick,
}: ChallengeBlockProps) {
  const { author, category, difficulty, isBroken, isOpen, name } = chall
  const lastSolve = score.achievements[score.achievements.length - 1]
  const [showPreview, setShowPreview] = useState<boolean>(false)

  return (
    <Box
      bg="primary"
      borderColor="secondary"
      borderWidth="medium"
      borderStyle="solid"
      borderRadius="small"
      boxShadow="normal"
      m="2"
      p="1"
      gap="2"
      color={isBroken ? 'red' : ''}
      display="grid"
      gridTemplateColumns="auto 1fr"
      gridTemplateRows="auto 1fr"
      gridTemplateAreas={`
        'card stats'
        'card actions'
      `}
    >
      <Box
        gap="1"
        gridArea="card"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <ChallengeCard
          challenge={chall}
          score={score}
          onClick={() => setShowPreview(true)}
        />
        <p>
          {category} - {difficulty}
        </p>
        <p>{author}</p>
      </Box>
      <Box gridArea="stats">
        <Box as="h1" fontSize="2">
          {name}
        </Box>
        {/* <p>
          Attempted <b>{score.achievements.length}</b> times
        </p> */}
        <p>
          Solved <b>{score.achievements.length}</b> times
          {lastSolve && (
            <span>
              {` (last by "${lastSolve.username}" from "${lastSolve.teamname}")`}
            </span>
          )}
        </p>
      </Box>

      <Box
        gridArea="actions"
        display="flex"
        flexWrap="wrap"
        gap="1"
        alignItems="start"
      >
        {!isBroken && (
          <Button onClick={() => onBrokeClick(chall)}>Broke</Button>
        )}
        {isBroken && (
          <Button onClick={() => onRepairClick(chall)}>Repair</Button>
        )}
        <Button onClick={() => onEditClick(chall)}>Edit</Button>
        {/* <Button onClick={() => setShowPreview(true)}>Preview</Button> */}
      </Box>
      {showPreview && (
        <ChallDescriptionPopup
          challenge={chall}
          messages={messages}
          onClose={() => setShowPreview(false)}
          score={score}
          readonly
        />
      )}
    </Box>
  )
}
