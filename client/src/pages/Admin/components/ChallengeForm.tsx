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
import { useAdmin } from 'hooks/useAdmin'
import { useChallengeForm } from 'hooks/useChallengeForm'
import { useThemeMode } from 'hooks/useThemeMode'
import { ChangeEvent, SyntheticEvent, useRef, useState } from 'react'

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
    isDirty,
  } = useChallengeForm(chall, onClose)
  const { uploadFile } = useAdmin()
  const ref = useRef<HTMLFormElement>(null)
  const [showPreview, setShowPreview] = useState<boolean>(false)
  const [editFlag, setEditFlag] = useState<boolean>(false)
  const { currentTheme } = useThemeMode()

  const fileHandler = async (
    files: FileList,
    event: SyntheticEvent<HTMLDivElement>,
  ) => {
    if (!files.length) {
      return
    }

    event.preventDefault()
    const target = event.nativeEvent.target as HTMLTextAreaElement
    for (const file of files) {
      if (file.size > 15e6) {
        alert(`File ${file.name} is too large (max 15MB)`)
        continue
      }
      const uploadedPath = await uploadFile(file)
      const mdLink = file.type.startsWith('image/')
        ? `![${file.name}](${uploadedPath})`
        : `[${file.name}](${uploadedPath})`

      descriptionProps.onChange({
        target: {
          value:
            descriptionProps.value.substring(0, target.selectionStart) +
            mdLink +
            descriptionProps.value.substring(target.selectionEnd),
        },
      } as ChangeEvent<HTMLInputElement>)
    }
  }

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
      useClickOutside={!isDirty}
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
            textareaProps={{
              placeholder:
                "Write your description in markdown format\n\nTips: you can copy-paste or drag'n drop images/files to upload them and get a link (max: 15MB)",
            }}
            onPaste={e => fileHandler(e.clipboardData.files, e)}
            onDrop={e => fileHandler(e.dataTransfer.files, e)}
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
            score={{ challenge: {} as Challenge, achievements: [], score: 100 }}
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
