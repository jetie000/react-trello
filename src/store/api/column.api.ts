import { baseApi } from "./baseApi"
import { IError } from "@/types/error.interface"
import { IColumn, IColumnAddInfo, IColumnUpdateInfo } from "@/types/column.interface"

export const columnApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    addColumn: builder.mutation<IColumn | IError, IColumnAddInfo>({
      query: (columnInfo: IColumnAddInfo) => ({
        body: columnInfo,
        url: "/column",
        method: "POST"
      }),
      invalidatesTags: ["Board"]
    }),
    changeColumn: builder.mutation<IColumn | IError, IColumnUpdateInfo>({
      query: (columnInfo: IColumnUpdateInfo) => ({
        body: columnInfo,
        url: "/column",
        method: "PUT"
      }),
      invalidatesTags: ["Board"]
    }),
    deleteColumn: builder.mutation<IColumn | IError, number>({
      query: (columnId: number) => ({
        url: "/column/" + columnId,
        method: "DELETE"
      }),
      invalidatesTags: ["Board"]
    })
  })
})

export const { useAddColumnMutation, useChangeColumnMutation, useDeleteColumnMutation } = columnApi
