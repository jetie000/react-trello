import { IColumn } from "./column.interface"
import { IUser } from "./user.interface"

export interface IBoard {
  id: number
  name: string
  description?: string
  creatorId: number
  columns?: IColumn[]
  users?: IUser[]
}

export interface IBoardAddInfo {
  name: string
  description?: string
  creatorId: number
  userIds: number[]
}

export interface IBoardUpdateInfo {
  id: number
  name: string
  description?: string
  userIds: number[]
}
