import styled from '@emotion/styled'
import React, { useState } from 'react'
import { FlexProps, LayoutProps, SpaceProps } from 'styled-system'
import { Box } from './Box'

type SortDirection = 'desc' | 'asc'

export type ColumnDefinition<T> = {
  header: string
  rowValue: (row: T) => string
  defaultSort?: SortDirection
}

export type TableProps<T> = {
  data: T[]
  columns: ColumnDefinition<T>[]
  rowKey: (row: T) => string
  actions?: React.FunctionComponent<{ row: T }>
}

export function Table<T>({
  data,
  columns,
  rowKey,
  actions: Actions,
  ...props
}: TableProps<T> & SpaceProps & LayoutProps & FlexProps) {
  const [sortedColumn, setSortedColumn] = useState<
    ColumnDefinition<T> | undefined
  >(columns.find(c => c.defaultSort))

  const [sort, setSort] = useState<SortDirection>(
    columns.find(c => c.defaultSort)?.defaultSort ?? 'asc',
  )

  const sorted = sortedColumn
    ? sort === 'asc'
      ? [...data].sort((d1, d2) =>
          sortedColumn.rowValue(d1).localeCompare(sortedColumn.rowValue(d2)),
        )
      : [...data].sort((d1, d2) =>
          sortedColumn.rowValue(d2).localeCompare(sortedColumn.rowValue(d1)),
        )
    : data

  return (
    <Box overflowX="hidden" overflowY="auto" borderRadius="medium" {...props}>
      <StyledTable>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.header}
                scope="col"
                onClick={() => {
                  if (sortedColumn === column) {
                    setSort(s => (s === 'desc' ? 'asc' : 'desc'))
                  } else {
                    setSortedColumn(column)
                    setSort('asc')
                  }
                }}
              >
                {column.header}
                {sortedColumn === column && (
                  <Box as="span" ml="2">
                    {sort === 'desc' ? '⬇' : '⬆'}
                  </Box>
                )}
              </th>
            ))}
            {Actions && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={rowKey(row)}>
              {columns.map(({ header, rowValue }) => (
                <td key={header}>{rowValue(row)}</td>
              ))}

              {Actions && (
                <Box
                  as="td"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Actions row={row} />
                </Box>
              )}
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  )
}

export const StyledTable = styled.table`
  background-color: ${p => p.theme.colors.background};
  table-layout: fixed;
  width: 100%;
  text-align: center;
  vertical-align: middle;

  border-spacing: 1;
  border-collapse: collapse;
  position: relative;

  thead {
    font-size: ${p => p.theme.fontSizes[2]};
  }

  td,
  th {
    padding: ${p => p.theme.space[2]};
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    padding: ${p => p.theme.space[2]};
    background-color: ${p => p.theme.colors.primary};
    cursor: pointer;
    position: sticky;
    top: 0;
  }

  tr:nth-of-type(even) {
    background-color: #00000033;
  }
`
