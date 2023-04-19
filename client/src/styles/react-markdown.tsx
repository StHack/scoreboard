import styled from '@emotion/styled'
import { Components } from 'react-markdown'
import { Code, Text, Title } from '@mantine/core'

const ListItem = styled.li<{
  checked: boolean | null
  index: number
  ordered: boolean
}>`
  padding-left: 0.4rem;
  ::before {
    content: ${p => !p.ordered && "'▪ '"};
    font-size: 2rem;
  }
  list-style-type: none;
`

const Img = styled.img`
  max-width: 100%;
  display: block;
  margin: 8rem auto;
`

const MarkCode = styled(Code)`
  padding: 0.4rem;
  background-color: ${({ theme }) => theme.colors.gray[5]};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
`
const Link = styled.a`
  color: ${({ theme }) => theme.black};
`

export const ReactMarkdownRenderers: Components = {
  h1: p => <Title order={1} my="4" size="md" ta="center" {...p} />,
  h2: p => <Title order={2} my="3" {...p} />,
  h3: p => <Title order={3} {...p} />,
  h4: p => <Title order={4} {...p} />,
  h5: p => <Title order={5} {...p} />,
  h6: p => <Title order={6} {...p} />,
  p: p => <Text ta="initial" {...p} />,
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  a: p => <Link {...p} target="_blank" rel="noopener noreferrer" />,
  li: p => {
    return <ListItem {...p} />
  },
  code: MarkCode as any,
  blockquote: p => <Text as="blockquote" color="red" {...(p as any)} />,
  // listItem: ListItem,
  img: Img as any,
}
