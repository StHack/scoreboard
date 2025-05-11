import { Categories, Challenge, Difficulties } from '@sthack/scoreboard-common'
import MDEditor from '@uiw/react-md-editor'
import { Box } from 'components/Box'
import { BoxPanel } from 'components/BoxPanel'
import { Button } from 'components/Button'
import { categoryToImg } from 'components/CategoryImg'
import { ChallDescriptionPopup } from 'components/ChallDescriptionPopup'
import { DropdownInput } from 'components/DropdownInput'
import { ImageInput } from 'components/ImageInput'
import { LabelInput } from 'components/LabelInput'
import { Loader } from 'components/Loader'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { AdminContextLoadingState, useAdmin } from 'hooks/useAdmin'
import { useChallengeForm } from 'hooks/useChallengeForm'
import { useThemeMode } from 'hooks/useThemeMode'
import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useRef,
  useState,
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function ChallengeFormLayout() {
  const { isLoaded, challenges } = useAdmin()
  const { challengeId } = useParams()

  if (!isLoaded(AdminContextLoadingState.challenges)) {
    return <Loader size="10" placeSelf="center" />
  }

  return <ChallengeForm chall={challenges.find(c => c._id === challengeId)} />
}

export function ChallengeForm({ chall }: { chall?: Challenge }) {
  const navigate = useNavigate()
  const onClose = useCallback(async () => {
    await navigate('/admin/challenges')
  }, [navigate])

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
    reset,
    isDirty,
  } = useChallengeForm(chall, onClose)
  const { uploadFile } = useAdmin()
  const ref = useRef<HTMLFormElement>(null)
  const [showPreview, setShowPreview] = useState<boolean>(false)
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

  const title = isNewChallenge
    ? 'Create a new challenge'
    : `Edition of challenge "${chall?.name ?? 'new challenge'}"`

  return (
    <BoxPanel
      title={
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          width="100%"
          gap="2"
        >
          <title>{title}</title>
          {title}
          {isDirty && (
            <Box as="span" fontStyle="italic" color="red">
              (Unsaved changes)
            </Box>
          )}
        </Box>
      }
      flexDirection="column"
      onSubmitCapture={formProps.onSubmitCapture}
    >
      <Box
        display={['flex', 'grid']}
        gridTemplateAreas={`
          "name name"
          "auth ${isNewChallenge ? 'flag' : 'desc'}"
          "cat  desc"
          "dif  desc"
          "img  desc"
          ".    desc"
          "err  err "
          "act  act "
        `}
        gridTemplateColumns="auto 1fr"
        gridTemplateRows="auto auto auto auto auto 1fr auto auto"
        flexDirection="column"
        maxWidth="maximalCentered"
        px="2"
        gap="3"
        margin="0 auto"
        width="100%"
      >
        <LabelInput label="Name" gridArea="name" required>
          <TextInput type="text" {...nameProps} />
        </LabelInput>

        <LabelInput label="Author" gridArea="auth" required>
          <TextInput type="text" {...authorProps} />
        </LabelInput>

        {isNewChallenge && (
          <LabelInput label="Flag" gridArea="flag" required={isNewChallenge}>
            <TextInput type="text" {...flagsProps} />
          </LabelInput>
        )}

        <LabelInput label="Category" gridArea="cat" required>
          <DropdownInput {...categoryProps} predefinedValues={Categories} />
        </LabelInput>

        <LabelInput label="Difficulty" gridArea="dif" required>
          <SelectInput predefinedValues={Difficulties} {...difficultyProps} />
        </LabelInput>

        <LabelInput
          label="Description (markdown format)"
          gridArea="desc"
          required
        >
          <MDEditor
            value={descriptionProps.value}
            onChange={(str, e) => e && descriptionProps.onChange(e)}
            preview="edit"
            height="100%"
            visibleDragbar={false}
            data-color-mode={currentTheme}
            textareaProps={{
              placeholder:
                "Write your description in markdown format\n\nTips: you can copy-paste or drag'n drop images/files to upload them and get a link (max: 15MB)",
            }}
            onPaste={e => fileHandler(e.clipboardData.files, e)}
            onDrop={e => fileHandler(e.dataTransfer.files, e)}
          />
        </LabelInput>

        <LabelInput label="Image" gridArea="img">
          <ImageInput
            {...imgProps}
            value={imgProps.value}
            fallbackImage={categoryToImg(categoryProps.value)}
            alt="Icon of your challenge"
          />
        </LabelInput>

        {error && (
          <Box gridArea="err" backgroundColor="red" color="white" role="alert">
            {error}
          </Box>
        )}

        {showPreview && (
          <ChallDescriptionPopup
            challenge={preview}
            messages={[]}
            onClose={() => setShowPreview(false)}
            score={{
              challenge: {} as Challenge,
              achievements: [],
              score: 100,
            }}
            readonly
          />
        )}

        <Box
          gridArea="act"
          display="grid"
          gridAutoFlow="column"
          justifyContent="space-evenly"
        >
          <Button
            variant="secondary"
            onClick={async () => {
              reset()
              await onClose()
            }}
            title="Discard changes"
            type="button"
          >
            Discard
          </Button>

          <Button
            // variant="secondary"
            onClick={reset}
            title="Reset form"
            type="button"
            disabled={!isDirty}
          >
            Reset
          </Button>

          <Button onClick={() => setShowPreview(true)} type="button">
            Preview
          </Button>

          <Button
            variant="primary"
            disabled={!isDirty}
            title={isNewChallenge ? 'Create' : 'Update'}
            type="submit"
          >
            {isNewChallenge ? 'Create' : 'Update'}
          </Button>
        </Box>
      </Box>
    </BoxPanel>
  )
}
