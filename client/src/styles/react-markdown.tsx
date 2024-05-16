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

const ListItem = styled.li`
  margin-left: ${p => p.theme.space[2]};

  ::before {
    font-size: ${p => p.theme.fontSizes[2]};
  }
`

const List = styled.ul<SpaceProps>`
  ${space}
  & > li::before {
    content: '▪ ';
  }
`

const Img = styled.img`
  max-width: 100%;
  display: block;
  margin: ${p => p.theme.space[2]} auto;
`

const Text = styled('p', cleanStyledSystem)<
  SpaceProps & FontSizeProps & TextAlignProps & ColorProps
>(textAlign, fontSize, space, color)

const Code = styled.code`
  padding: ${p => p.theme.space[1]};
  background-color: ${p => p.theme.colors.greys[0]};
  white-space: pre-wrap;
  line-height: 2em;
  overflow-x: auto;
`

export const ReactMarkdownRenderers: Components = {
  h1: p => <Text as="h1" my="4" fontSize="3" textAlign="center" {...p} />,
  h2: p => <Text as="h2" my="3" fontSize="2" {...p} />,
  h3: p => <Text as="h3" my="2" fontSize="2" {...p} />,
  h4: p => <Text as="h4" my="2" fontSize="2" {...p} />,
  h5: p => <Text as="h5" my="2" fontSize="2" {...p} />,
  h6: p => <Text as="h6" my="2" fontSize="2" {...p} />,
  p: p => <Text fontSize="0" textAlign="initial" py="1" {...p} />,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  a: p => <a {...p} target="_blank" rel="noopener noreferrer" />,
  li: p => <ListItem {...p} />,
  ul: p => <List as="ul" py="1" {...p} />,
  ol: p => <List as="ol" py="1" {...p} />,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  code: Code as any,
  blockquote: p => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Text as="blockquote" my="2" fontSize="2" color="red" {...(p as any)} />
  ),
  // listItem: ListItem,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  img: Img as any,
  pre: p => <Code as="pre" {...p} />,
}
