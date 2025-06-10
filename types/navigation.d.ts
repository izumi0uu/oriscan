declare namespace Index {
  interface GPTListItem {
    id: number
    name: string
    content: string
    content_zh: string
    icon: string
    gpt_store_link: string
  }
  interface TagItem {
    id: number
    name: string
    description: string
    name_zh: string
  }
  interface GPTDetail {
    id: number
    name: string
    content: string
    icon: string
    detail: string
    gpt_store_link: string
  }
}
