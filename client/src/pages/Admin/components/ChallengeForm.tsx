import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ChallDescriptionPopup } from 'components/ChallDescriptionPopup'
import { DropdownInput } from 'components/DropdownInput'
import { ImageInput } from 'components/ImageInput'
import { LabelInput } from 'components/LabelInput'
import Popup from 'components/Popup'
import { SelectInput } from 'components/SelectInput'
import { TextArea, TextInput } from 'components/TextInput'
import { useChallengeForm } from 'hooks/useChallengeForm'
import { Categories } from 'models/Category'
import { Challenge } from 'models/Challenge'
import { Difficulties } from 'models/Difficulty'
import { useRef, useState } from 'react'

export type AdminProps = {
  chall?: Challenge
  onClose: () => void
}

export function ChallengeForm ({ chall, onClose }: AdminProps) {
  const {
    formProps,
    nameProps,
    authorProps,
    categoryProps,
    descriptionProps,
    difficultyProps,
    imgProps,
    flagsProps,
    error,
    isNewChallenge,
    preview,
  } = useChallengeForm(chall, onClose)
  const ref = useRef<HTMLFormElement>(null)
  const [showPreview, setShowPreview] = useState<boolean>(false)

  return (
    <Popup
      customAction={
        <Button onClick={() => setShowPreview(v => !v)}>
          {showPreview ? 'Hide' : 'Show'} Preview
        </Button>
      }
      title={
        isNewChallenge
          ? 'Create a new challenge'
          : `Edition of challenge "${chall?.name}""`
      }
      onCancel={onClose}
      onValidate={() => ref.current?.requestSubmit() && onClose()}
    >
      <Form ref={ref} {...formProps}>
        <LabelInput label="Name" required>
          <TextInput type="text" {...nameProps} />
        </LabelInput>

        <LabelInput label="Author" required>
          <TextInput type="text" {...authorProps} />
        </LabelInput>

        <LabelInput label="Description (markdown format)" required>
          <TextArea rows={6} {...descriptionProps} />
        </LabelInput>

        <LabelInput label="Flag" required={isNewChallenge}>
          <TextInput type="text" {...flagsProps} />
        </LabelInput>

        <LabelInput label="Category" required>
          <DropdownInput {...categoryProps} predefinedValues={Categories} />
        </LabelInput>

        <LabelInput label="Difficulty" required>
          <SelectInput predefinedValues={Difficulties} {...difficultyProps} />
        </LabelInput>

        <LabelInput label="Image">
          <ImageInput {...imgProps} />
        </LabelInput>

        {error && (
          <Box backgroundColor="red" color="white">
            {error}
          </Box>
        )}

        {showPreview && (
          <ChallDescriptionPopup
            challenge={preview}
            messages={[]}
            onClose={() => setShowPreview(false)}
            score={{ achievements: [], score: 100 }}
            readonly
          />
        )}
      </Form>
    </Popup>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
`
