import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery
} from "@reduxjs/toolkit/query/react"
import { AuthResponse } from "@/types/authResponse.interface"
import { store } from "../store"
import { userSlice } from "../slices/user.slice"
import { config } from "@/config/config"
import { localStorageConfig } from "@/config/localStorage"

const baseQuery = fetchBaseQuery({
  baseUrl: config.API_URL,
  credentials: "include",
  prepareHeaders: headers => {
    if (localStorage.getItem(localStorageConfig.TOKEN_LOCALSTORAGE))
      headers.set(
        "Authorization",
        `Bearer ${localStorage.getItem(localStorageConfig.TOKEN_LOCALSTORAGE)}`
      )
    return headers
  }
})

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions)

    if (refreshResult.data) {
      localStorage.setItem(
        localStorageConfig.TOKEN_LOCALSTORAGE,
        (refreshResult.data as AuthResponse).accessToken
      )
      result = await baseQuery(args, api, extraOptions)
    } else {
      store.dispatch(userSlice.actions.logout())
    }
  }
  return result
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Users", "Board", "Boards"],
  endpoints: () => ({})
})
