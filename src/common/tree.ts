export interface Tree {
  id: number
  codePath: string
  name: string
  children?: Tree[]
}
