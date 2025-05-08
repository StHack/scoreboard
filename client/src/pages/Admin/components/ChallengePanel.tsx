import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ExportJsonButton } from 'components/ExportJsonButton'
import { IconCreate } from 'components/Icon'
import { SearchInput } from 'components/SearchInput'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChallengeBlock } from './ChallengeBlock'

export function ChallengePanel() {
  const {
    challenges,
    attempts,
    brokeChallenge,
    deleteChallenge,
    repairChallenge,
  } = useAdmin()
  const [search, setSearch] = useState<string>('')
  const {
    messages,
    score: { challsScore },
  } = useGame()

  const navigate = useNavigate()

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" gap="2">
      <Box display="flex" flexDirection="row" gap="2">
        <Button
          onClick={() => navigate(`/admin/challenges/create`)}
          title="Create challenge"
          icon={IconCreate}
          responsiveLabel
        >
          Create challenge
        </Button>
        <ExportJsonButton data={challenges} filename="challenges" />
        <SearchInput
          search={search}
          onChange={setSearch}
          placeholder="Search by chall or author name"
        />
      </Box>

      <Box
        display={['flex', 'grid']}
        flexDirection="column"
        gridTemplateColumns="repeat(auto-fit, minmax(40rem, 1fr))"
        overflowY="auto"
        gap="2"
        role="list"
      >
        {challenges
          .filter(
            c =>
              c.author.toLowerCase().includes(search) ||
              c.name.toLowerCase().includes(search),
          )
          .map(c => (
            <ChallengeBlock
              key={c._id}
              chall={c}
              score={
                challsScore[c._id] ?? {
                  challenge: c,
                  score: 0,
                  achievements: [],
                }
              }
              messages={messages.filter(m => m.challengeId === c._id)}
              attempts={attempts.filter(a => a.challengeId === c._id)}
              onBrokeClick={brokeChallenge}
              onEditClick={() => navigate(`/admin/challenges/${c._id}/edit`)}
              onRepairClick={repairChallenge}
              onDeleteClick={deleteChallenge}
            />
          ))}
      </Box>
    </Box>
  )
}
