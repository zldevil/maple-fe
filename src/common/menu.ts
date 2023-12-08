export interface Menu {
  id: number
  pid: number
  name: string
  code: string
  type: number
  meta: string
  child: Menu
}
