import { getHttpService, PaginationData, PaginationParams } from '@/utils/http/service'

type GenerateType<Keys extends keyof any> = {
  [Key in Keys]: {
    [Key2 in Key]: string
  } & {
    project_name: string
    user_address?: string
  }
}[Keys]

export const DomainDetailService = {
  getList: getHttpService<PaginationData<Index.GPTListItem>, PaginationParams & { tag?: number }>('/projects'),
  getV2List: getHttpService<PaginationData<Index.GPTListItem>, PaginationParams & { tag?: number }>(
    'https://nav.ordinalscan.net/api/v2/projects',
  ),
  getTagList: getHttpService<Index.TagItem[], {}>('/tags'),
  getV2TagList: getHttpService<Index.TagItem[], {}>('https://nav.ordinalscan.net/api/v2/tags'),
  getDetailFn: (params: { id: string }) => {
    return getHttpService<Index.GPTDetail, {}>(`/project/${params.id}`)
  },
}
