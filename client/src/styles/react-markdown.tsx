import styled from '@emotion/styled'
import { Components } from 'react-markdown'
import {
  color,
  ColorProps,
  fontSize,
  FontSizeProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
} from 'styled-system'
import { cleanStyledSystem } from 'styles'

const ListItem = styled.li<{
  checked: boolean | null
  index: number
  ordered: boolean
}>`
  margin-left: ${p => p.theme.space[2]};

  ::before {
    content: ${p => !p.ordered && "'▪ '"};
    font-size: ${p => p.theme.fontSizes[2]};
  }
`

const Img = styled.img`
  max-width: 100%;
  display: block;
  margin: ${p => p.theme.space[2]} auto;
`

const Text = styled('p', cleanStyledSystem)<
  SpaceProps & FontSizeProps & TextAlignProps & ColorProps
>`
  ${textAlign}
  ${fontSize}
  ${space}
  ${color}
`
Text.defaultProps = {
  my: '2',
  fontSize: '2',
}

const Code = styled.code`
  padding: ${p => p.theme.space[1]};
  background-color: ${p => p.theme.colors.greys[0]};
  border: 1px solid ${p => p.theme.colors.greys[2]};
`

export const ReactMarkdownRenderers: Components = {
  h1: p => <Text as="h1" my="4" fontSize="3" textAlign="center" {...p} />,
  h2: p => <Text as="h2" my="3" {...p} />,
  h3: p => <Text as="h3" {...p} />,
  h4: p => <Text as="h4" {...p} />,
  h5: p => <Text as="h5" {...p} />,
  h6: p => <Text as="h6" {...p} />,
  p: p => <Text fontSize="0" textAlign="initial" {...p} />,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  a: p => <a {...p} target="_blank" rel="noopener noreferrer" />,
  li: p => {
    return <ListItem {...p} />
  },
  code: Code as any,
  blockquote: p => <Text as="blockquote" color="red" {...(p as any)} />,
  // listItem: ListItem,
  img: Img as any,
}
