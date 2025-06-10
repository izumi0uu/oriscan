import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import Sortable, { Sort } from './Sortable'
import md5 from 'md5'
import clsx from 'clsx'

export type TableAlign = 'left' | 'center' | 'right'

export interface TableColumn<T extends object> {
  name: ReactNode
  headStyle?: CSSProperties
  itemStyle?: CSSProperties
  key?: keyof T
  render?: (data: T, index: number, key?: keyof T) => JSX.Element | string
  flex?: number
  width?: string
  align?: TableAlign
  sortable?: boolean
  sort?: Sort
}

const offset = function (el: HTMLElement) {
  let x = 0
  let y = 0

  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    x += el.offsetLeft - (el.tagName !== 'BODY' ? el.scrollLeft : 0)
    y += el.offsetTop - (el.tagName !== 'BODY' ? el.scrollTop : 0)
    el = el.offsetParent as HTMLElement
  }

  return { y, x }
}

export default function Table<T extends object>(props: {
  data: T[]
  columns: TableColumn<T>[]
  gap?: string
  keyName?: keyof T
  loading?: boolean
  className?: string
  style?: CSSProperties
  updateColumns?: (columns: TableColumn<T>[]) => void
  onRowClick?: (data: T, index: number) => void
  tableHeaderStyle?: CSSProperties
  tableBodyStyle?: CSSProperties
  sticky?: boolean
  rollingScroll?: boolean
  target?: Document
  onRolling?(): void
  expandable?: {
    expandedRowRender: (data: T) => JSX.Element
    rowExpandable: (data: T) => boolean
    expandedRowKeys?: string[]
    hidden?: boolean
  }
}) {
  const [expandedRows, setExpandedRows] = useState<string[]>(props.expandable?.expandedRowKeys || [])
  useEffect(() => {
    if (props.expandable?.expandedRowKeys) {
      setExpandedRows(props.expandable?.expandedRowKeys)
    }
  }, [props.expandable?.expandedRowKeys])

  const scrollRef = useRef<HTMLDivElement>(null)
  const [scroll, setScroll] = useState(false)

  const onScroll = () => {
    setScroll(!!scrollRef.current?.scrollLeft)
  }

  const scrollOff = useRef(false)

  useEffect(() => {
    if (!props.loading) scrollOff.current = false
  }, [props.loading])

  useEffect(() => {
    if (props.rollingScroll && props.target) {
      const onScrollChange = () => {
        if (scrollOff.current) return
        if (props.target) {
          try {
            let scrollTop = props.target.documentElement.scrollTop,
              clientHeight = props.target.documentElement.clientHeight,
              y = offset(scrollRef.current!).y
            if (clientHeight + scrollTop >= y + scrollRef.current!.offsetHeight) {
              scrollOff.current = true
              props.onRolling?.()
            }
          } catch {}
        }
      }

      props.target.addEventListener('scroll', onScrollChange)
      return () => {
        props.target?.removeEventListener('scroll', onScrollChange)
      }
    }
  }, [props])

  useEffect(() => {
    let el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', onScroll)
      return () => (el ? el.removeEventListener('scroll', onScroll) : void 0)
    }
  }, [])

  const getColumns = () => {
    const columns = props.columns.map((column, index) => (
      <Th
        key={index}
        className={clsx(
          'px-[10px]',
          scroll ? 'table-cell-shadow-right' : void 0,
          index < 2 ? 'max-md:bg-[#fff] z-[100] left-0' : '',
        )}
        style={column.headStyle}
        width={column.width}
        flex={column.flex || 1}
        clickable={column.sortable}
        align={column.align || 'center'}
        sticky={props.sticky}
      >
        {column.name}{' '}
        {column.sortable && (
          <Sortable
            value={column.sort || Sort.DEFAULT}
            onChange={(sort: Sort) => {
              const clonedColumns: typeof props.columns = JSON.parse(JSON.stringify(props.columns))
              const target = clonedColumns.find((x) => x.name === column.name)
              if (target) {
                target.sort = sort
                props.updateColumns && props.updateColumns(clonedColumns)
              }
            }}
          />
        )}
      </Th>
    ))
    const expandColumn = <Th key={props.columns.length + 2} className={'table-th'} width={'39px'} flex={1} />
    if (props.expandable) {
      return [expandColumn, columns]
    }
    return columns
  }

  const getTd = (data: T, index: number) => {
    const tds = props.columns.map((column, index1) => {
      let renderResult = column.render
        ? column.render(data, index, column.key)
        : column.key
          ? (data[column.key] as any as string)
          : column.key
      // @ts-ignore
      if ([undefined, '', null].includes(renderResult)) {
        renderResult = '-'
      }
      return (
        <Td
          key={index1}
          style={column.itemStyle}
          flex={column.flex || 1}
          width={column.width}
          align={column.align || 'center'}
          className={clsx(
            scroll ? 'table-cell-shadow-right' : void 0,
            index1 < 2 ? 'max-md:bg-[#fff] z-[100] left-0' : '',
          )}
          sticky={props.sticky}
        >
          {/*@ts-ignore*/}
          {renderResult}
        </Td>
      )
    })
    const key = md5(`${JSON.stringify(data)}+${index}`)
    const expandTd = (
      <Td
        key={key}
        flex={1}
        width={'39px'}
        style={{ height: 20, cursor: 'pointer' }}
        align={'center'}
        sticky={props.sticky}
        onClick={(e) => {
          e.stopPropagation()
          let data: string[] = []
          if (expandedRows.includes(key)) {
            data = expandedRows.filter((item) => item !== key)
          } else {
            data = [...expandedRows, key]
          }
          setExpandedRows(data)
        }}
      >
        <ExpandIcon isShow={!!props.expandable?.rowExpandable(data)}>
          {!!props.expandable?.hidden ? (
            ''
          ) : expandedRows.includes(key) ? (
            <div style={{ width: 12, height: 2, background: '#737373' }} />
          ) : (
            '+'
          )}
          {/*{expandedRows.includes(key) ? <div style={{ width: 12, height: 2, background: '#737373' }} /> : '+'}*/}
        </ExpandIcon>
      </Td>
    )
    if (props.expandable) return [expandTd, ...tds]
    return tds
  }

  const getRows = () => {
    return props.data?.map((data, index) => {
      const key = md5(`${JSON.stringify(data)}+${index}`)
      const Row = (
        <TableRow
          onClick={() => props.onRowClick && props.onRowClick(data, index)}
          key={props.keyName ? (data[props.keyName] as any as string) : index}
          gap={props.gap}
          clickable={!!props.onRowClick}
          className="md:hover:bg-[#f2f2f2]"
        >
          {getTd(data, index)}
        </TableRow>
      )
      if (props.expandable?.rowExpandable(data)) {
        const ExpandedRow = (
          <ExpandTableRow
            key={key}
            className={'table-row expand-table-row'}
            gap={props.gap}
            clickable={!!props.onRowClick}
            isExpand={expandedRows.includes(key)}
          >
            <Td key={JSON.stringify(data)} className={'table-td'} flex={1} align={'left'}>
              {props.expandable.expandedRowRender(data)}
            </Td>
          </ExpandTableRow>
        )
        return [Row, ExpandedRow]
      }
      return Row
    })
  }

  return (
    <div ref={scrollRef} className={clsx('overflow-x-auto overflow-y-hidden relative', props.className)}>
      <div className="w-full">
        <TableWrapper style={props.style} className="overflow-x-auto">
          <colgroup>
            {props.columns.map((c, index) => (
              <col
                key={index}
                style={c.width ? { width: c.width, minWidth: 'auto', maxWidth: 'fit-content' } : void 0}
              />
            ))}
          </colgroup>
          <TableHeader gap={props.gap} style={{ ...(props.tableHeaderStyle || {}) }}>
            <tr>{getColumns()}</tr>
          </TableHeader>
          <TableBody className={'table-body'} style={{ ...(props.tableBodyStyle || {}) }}>
            {getRows()}
          </TableBody>
        </TableWrapper>
        {props.rollingScroll && props.loading ? (
          <div>
            <div className={clsx('flex items-center justify-center', props.data.length ? 'mt-4' : 'mt-16')}>
              <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
            </div>
          </div>
        ) : (
          props.loading && (
            <div className="absolute z-10 inset-0 flex items-center justify-center" style={{}}>
              <div className="w-6 h-6 max-w-full max-h-full rounded-full border-2 border-primary animate-spinnerBulqg"></div>
            </div>
          )
        )}
      </div>
    </div>
  )
}

const ExpandIcon = styled.div<{ isShow: boolean }>`
  font-size: 20px;
  display: ${(props) => (props.isShow ? 'block' : 'none')};
  user-select: none;
  .fold {
    width: 12px;
    height: 2px;
    background: #737373;
  }
`
const TableWrapper = styled.table`
  width: 100%;
  position: relative;
  isolation: isolate;
`
const TableHeader = styled.thead<{ gap?: string }>`
  height: 70px;
  position: relative;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  padding: 0 10px;
`

const Th = styled.th<{ width?: string; flex?: number; clickable?: boolean; align?: TableAlign; sticky?: boolean }>`
  user-select: none;
  height: 100%;
  flex-shrink: 0;
  white-space: nowrap;
  ${({ width }) =>
    width
      ? css`
          width: ${width};
        `
      : ''};
  ${({ flex, width }) =>
    !width && flex
      ? css`
          flex: ${flex};
        `
      : ''};
  font-size: 14px;
  color: #9f9f9f;
  ${({ align }) =>
    align
      ? css`
          text-align: ${align};
        `
      : ''}
  cursor: ${(props) => (props.clickable ? 'pointer' : 'inherit')};
  ${({ sticky }) =>
    sticky
      ? css`
          &:nth-child(1),
          &:nth-child(2) {
            position: sticky;
          }
          &:nth-child(2) {
            left: 30px;
            &.table-cell-shadow-right {
              &::before {
                content: '';
              }
            }
            &::before {
              box-shadow: inset 10px 0 8px -8px #00000026;
              position: absolute;
              top: 0;
              right: 0;
              bottom: -1px;
              width: 30px;
              transform: translate(100%);
              transition: box-shadow 0.3s;
              pointer-events: none;
            }
          }
        `
      : ''}
`
const TableBody = styled.tbody`
  width: 100%;
  position: relative;
`

const TableRow = styled.tr<{ gap?: string; clickable?: boolean }>`
  position: relative;
  cursor: ${(props) => {
    return !!props.clickable ? 'pointer' : 'inherit'
  }};
  border-radius: 0px;
  transition: all 0.15s linear;
  border-bottom: solid 1px #e2e2e2;
`
const ExpandTableRow = styled(TableRow)<{ isExpand: boolean }>`
  cursor: auto;
  display: grid;
  grid-template-rows: ${({ isExpand }) => (isExpand ? '1fr' : '0fr')};
  opacity: ${({ isExpand }) => (isExpand ? 1 : 0)};
  padding: ${({ isExpand }) => (isExpand ? '14px 0' : 0)};
  border-bottom: none;
  box-shadow: 0 4px 10px rgba(114, 175, 120, 0.2);
  background: rgba(0, 0, 0, 0.02);
  overflow: hidden;
  min-height: 0;
`

const Td = styled.td<{ width?: string; flex?: number; align?: TableAlign; sticky?: boolean }>`
  height: 100%;
  color: #737373;
  ${({ align }) =>
    align
      ? css`
          text-align: ${align};
        `
      : ''}
  ${({ width }) =>
    width
      ? css`
          width: ${width};
        `
      : ''};
  padding: 20px 10px;
  font-size: 14px;
  white-space: nowrap;
  ${({ sticky }) =>
    sticky
      ? css`
          position: sticky;
          &.table-cell-shadow-right {
            &::before {
              content: '';
            }
          }
          &:nth-child(2) {
            left: 30px;
            &::before {
              box-shadow: inset 10px 0 8px -8px #00000026;
              position: absolute;
              top: 0;
              right: 0;
              bottom: -1px;
              width: 30px;
              transform: translate(100%);
              transition: box-shadow 0.3s;
              pointer-events: none;
            }
          }
        `
      : ''}
`
