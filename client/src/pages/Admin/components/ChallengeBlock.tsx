import {
  Attempt,
  Challenge,
  ChallengeScore,
  Message,
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
  attempts,
  onBrokeClick,
  onDeleteClick,
  onEditClick,
  onRepairClick,
}: ChallengeBlockProps) {
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
        {!isBroken && (
          <Button
            px="2"
            onClick={() => onBrokeClick(chall)}
            icon={IconBreak}
            title="Mark challenge as broken"
          />
        )}
        {isBroken && (
          <Button
            px="2"
            onClick={() => onRepairClick(chall)}
            icon={IconRepair}
            title="Repair challenge"
          />
        )}
        <Button
          px="2"
          onClick={() => onEditClick(chall)}
          icon={IconEdit}
          title="Edit challenge"
        />
        <Button
          px="2"
          onClick={() => setShowFlagEdit(true)}
          icon={IconFlagEdit}
          title="Edit flag"
        />
        <Button
          px="2"
          onClick={() => setShowPreview(true)}
          icon={IconPreview}
          title="Preview challenge"
        />
        <Button
          px="2"
          onClick={() => {
            if (
              confirm(
                `Are you sure to delete Challenge:\n\n${chall.name}\n\nby "${chall.author}"?\n\nThis action is irreversible and you need to first manually delete all associated achievements.`,
              )
            ) {
              onDeleteClick(chall)
            }
          }}
          icon={IconDelete}
          variant="danger"
          title="Delete challenge"
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
