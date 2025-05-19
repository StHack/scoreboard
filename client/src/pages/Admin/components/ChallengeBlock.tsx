import {
  Attempt,
  Challenge,
  ChallengeScore,
  Message,
  UserRole,
} from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ChallDescriptionPopup } from 'components/ChallDescriptionPopup'
import { ChallengeCard } from 'components/ChallengeCard'
import {
  IconBreak,
  IconDelete,
  IconEdit,
  IconFlagEdit,
  IconPreview,
  IconRepair,
} from 'components/Icon'
import { RoleBasedButton } from 'components/RoleBasedButton'
import { useAuth } from 'hooks/useAuthentication'
import { ProvidePlayer } from 'hooks/usePlayer'
import { useState } from 'react'
import { FlagEditForm } from './FlagEditForm'

type ChallengeBlockProps = {
  chall: Challenge
  score: ChallengeScore
  messages: Message[]
  attempts: Attempt[]
  onBrokeClick: (chall: Challenge) => void
  onDeleteClick: (chall: Challenge) => void
  onEditClick: (chall: Challenge) => void
  onRepairClick: (chall: Challenge) => void
}
export function ChallengeBlock({
  chall,
  score,
  messages,
  onBrokeClick,
  onDeleteClick,
  onEditClick,
  onRepairClick,
}: ChallengeBlockProps) {
  const { roles } = useAuth()
  const { author, category, difficulty, isBroken, name } = chall
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [showFlagEdit, setShowFlagEdit] = useState<boolean>(false)

  return (
    <Box
      bg="background"
      borderColor="secondary"
      borderWidth="medium"
      borderStyle="solid"
      borderRadius="small"
      boxShadow="normal"
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
      role="listitem"
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
          size="6"
        />
      </Box>
      <Box gridArea="stats">
        <Box as="h1" fontSize="2">
          {name}
        </Box>
        <p>{`by "${author}"`}</p>
        <p>{`${category} - ${difficulty}`}</p>
      </Box>

      <Box
        gridArea="actions"
        display="flex"
        flexWrap="wrap"
        placeContent="start"
        gap="2"
      >
        <Button
          px="2"
          onClick={() => setShowPreview(true)}
          icon={IconPreview}
          title="Preview challenge"
        />
        {!isBroken && (
          <RoleBasedButton
            px="2"
            onClick={() => onBrokeClick(chall)}
            icon={IconBreak}
            title="Mark challenge as broken"
            roleRequired={UserRole.Author}
          />
        )}
        {isBroken && (
          <RoleBasedButton
            px="2"
            onClick={() => onRepairClick(chall)}
            icon={IconRepair}
            title="Repair challenge"
            roleRequired={UserRole.Author}
          />
        )}
        <RoleBasedButton
          px="2"
          onClick={() => setShowFlagEdit(true)}
          icon={IconFlagEdit}
          title="Edit flag"
          roleRequired={UserRole.Author}
        />
        <RoleBasedButton
          px="2"
          onClick={() => onEditClick(chall)}
          icon={IconEdit}
          title="Edit challenge"
          roleRequired={UserRole.Author}
        />
        <RoleBasedButton
          px="2"
          onClick={() =>
            confirm(
              `Are you sure to delete Challenge:\n\n${chall.name}\n\nby "${chall.author}"?\n\nThis action is irreversible and you need to first manually delete all associated achievements.`,
            ) && onDeleteClick(chall)
          }
          icon={IconDelete}
          variant="danger"
          title="Delete challenge"
          roleRequired={UserRole.Author}
        />
      </Box>
      {showPreview && (
        <ProvidePlayer>
          <ChallDescriptionPopup
            challenge={chall}
            messages={messages}
            onClose={() => setShowPreview(false)}
            score={score}
          />
        </ProvidePlayer>
      )}

      {showFlagEdit && (
        <FlagEditForm chall={chall} onClose={() => setShowFlagEdit(false)} />
      )}
    </Box>
  )
}
