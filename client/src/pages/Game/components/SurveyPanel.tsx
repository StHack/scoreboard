import {
  Achievement,
  ratingAIUsage,
  ratingPerceivedDifficulty,
  ratingSatisfaction,
} from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  Button,
  IconAchievement,
  IconAI,
  IconSatisfaction,
  IconSurvey,
  LabelInput,
  MotionBox,
  RatingInput,
  TextArea,
} from '@sthack/scoreboard-ui/components'
import { useAuth } from 'hooks/useAuthentication'
import { useSurveyForm } from 'hooks/useSurveyForm'

type SurveyPanelProps = {
  achievement: Achievement
}
export function SurveyPanel({ achievement }: SurveyPanelProps) {
  const { user } = useAuth()
  const {
    satisfactionProps,
    perceivedDifficultyProps,
    aiUsageProps,
    feedbackProps,
    formProps,
    error,
    isLoading,
  } = useSurveyForm({ achievement })

  if (achievement.username !== user?.username) {
    // only the solver can fill it
    return undefined
  }

  return (
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
      <BoxPanel title="Survey" titleIcon={IconSurvey} gap="3">
        <Box
          fontSize="3"
          justifySelf="center"
          display="flex"
          alignItems="center"
          gap="2"
        >
          <IconAchievement size="2" />
          Congratz solving this challenge
          <IconAchievement size="2" />
        </Box>
        <Box textAlign="center" fontSize="1">
          In order to help us improve the future editions, please share with us
          your feedback concerning this challenge.
        </Box>
        <Box
          as="form"
          {...formProps}
          display="flex"
          flexDirection="column"
          placeItems="center"
          textAlign="center"
          gap="2"
        >
          <LabelInput
            required={satisfactionProps.required}
            label="How much did you enjoy this challenge?"
            fontSize="2"
            gap="3"
          >
            <RatingInput
              {...satisfactionProps}
              icon={IconSatisfaction}
              label="Satisfaction level"
              labels={ratingSatisfaction}
            />
          </LabelInput>

          <LabelInput
            required={perceivedDifficultyProps.required}
            label="How hard was this challenge for you?"
            fontSize="2"
            gap="3"
          >
            <RatingInput
              {...perceivedDifficultyProps}
              label="Perceived Difficulty level"
              labels={ratingPerceivedDifficulty}
            />
          </LabelInput>

          <LabelInput
            required={aiUsageProps.required}
            label="How much do you use the AI to assist you on this challenge?"
            fontSize="2"
            gap="3"
          >
            <RatingInput
              {...aiUsageProps}
              icon={IconAI}
              label="AI Usage"
              labels={ratingAIUsage}
            />
          </LabelInput>

          <LabelInput
            required={feedbackProps.required}
            label="Any additional remarks/feedbacks? (Facultative)"
            fontSize="2"
            gap="3"
            alignSelf="stretch"
          >
            <TextArea {...feedbackProps} rows={5} maxLength={2000} />
          </LabelInput>

          {error && (
            <Box backgroundColor="red" color="white" role="alert">
              {error}
            </Box>
          )}

          <Button type="submit" disabled={isLoading}>
            Send your feedback
          </Button>
        </Box>
      </BoxPanel>
    </MotionBox>
  )
}
