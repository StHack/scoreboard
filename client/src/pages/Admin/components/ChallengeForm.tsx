import styled from '@emotion/styled'
import { Categories, Challenge, Difficulties } from '@sthack/scoreboard-common'
import MDEditor from '@uiw/react-md-editor'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ChallDescriptionPopup } from 'components/ChallDescriptionPopup'
import { DropdownInput } from 'components/DropdownInput'
import { ImageInput } from 'components/ImageInput'
import { LabelInput } from 'components/LabelInput'
import Popup from 'components/Popup'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { useChallengeForm } from 'hooks/useChallengeForm'
import { useThemeMode } from 'hooks/useThemeMode'
import { useRef, useState } from 'react'

export type AdminProps = {
  chall?: Challenge
  onClose: () => void
}

export function ChallengeForm({ chall, onClose }: AdminProps) {
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
  const [editFlag, setEditFlag] = useState<boolean>(false)
  const { currentTheme } = useThemeMode()
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
          : `Edition of challenge "${chall?.name ?? 'new challenge'}"`
      }
      onCancel={onClose}
      onValidate={() => ref.current?.requestSubmit()}
      useBg={false}
    >
      <Form ref={ref} {...formProps}>
        <LabelInput label="Name" required>
          <TextInput type="text" {...nameProps} />
        </LabelInput>

        <LabelInput label="Author" required>
          <TextInput type="text" {...authorProps} />
        </LabelInput>

        <LabelInput label="Description (markdown format)" required>
          <MDEditor
            value={descriptionProps.value}
            onChange={(str, e) => e && descriptionProps.onChange(e)}
            preview="edit"
            data-color-mode={currentTheme}
          />
        </LabelInput>

        <LabelInput label="Flag" required={isNewChallenge}>
          {(isNewChallenge || editFlag) && (
            <TextInput type="text" {...flagsProps} />
          )}
          {!isNewChallenge && !editFlag && (
            <Button onClick={() => setEditFlag(true)}>Edit flag</Button>
          )}
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
            score={{ name: '', achievements: [], score: 100 }}
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
