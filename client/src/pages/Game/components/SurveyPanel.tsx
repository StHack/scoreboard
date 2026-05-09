import { Achievement } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  Button,
  IconAI,
  IconSatisfaction,
  LabelInput,
  Logo,
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

  if (achievement.survey) {
    // already filled
    return undefined
  }

  return (
    <BoxPanel
      title={
        <>
          {`Congratz solving ${achievement.challenge.name}`}
          <Logo size="2" />
        </>
      }
      titleIcon={Logo}
      titleProps={{
        justifySelf: 'center',
        fontSize: '4',
      }}
    >
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
            labels={['Boring', 'Not very fun', 'Okay', 'Fun', 'Awesome']}
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
            labels={['too easy', 'easy', 'medium', 'hard', 'too hard']}
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
            labels={[
              "I'm the ultimate LLM ! (no-usage at all)",
              "I'm outta credits bro... (you use the AI to get some hints or explanation)",
              'Me and my AI therapist has collaborated closely (Copilot wrote much code than you)',
              "Let's vibe baby !! (you use the AI intensively to solve it)",
              "I'm here to put an end to that CTF ! (the AI solved it entirely for you)",
            ]}
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
  )
}
