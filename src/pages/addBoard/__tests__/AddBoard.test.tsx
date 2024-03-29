import * as reduxHooks from "react-redux"
import * as actions from "@/hooks/useActions"
import * as boardApi from "@/store/api/board.api"
import * as userApi from "@/store/api/user.api"
import AddBoard from "@/pages/addBoard/AddBoard"
import { fireEvent, render, screen } from "@testing-library/react"
import { IUserResponse } from "@/types/user.interface"
import { skipToken } from "@reduxjs/toolkit/query"
import { languages } from "@/config/languages"
import { mockReturnUsers, mockUsers } from "@/config/mockValues"

jest.mock("@/store/store")
jest.mock("react-redux")
jest.mock("@/hooks/useActions")
jest.mock("@/store/api/board.api")
jest.mock("@/store/api/user.api")
const mockUseSelector = jest.spyOn(reduxHooks, "useSelector")
const mockUseActions = jest.spyOn(actions, "useActions")
const mockAddBoard = jest.spyOn(boardApi, "useAddBoardMutation")
const mockGetByIds = jest.spyOn(userApi, "useGetByIdsQuery")
const mockSearchUsers = jest.spyOn(userApi, "useSearchUsersQuery")

const mockReturnSelectorValue = {
  language: 1,
  id: 1,
  token: "token"
}
const mockReturnAdd = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  refetch: jest.fn(),
  data: undefined,
  reset: jest.fn()
}

const mockReturnActionsValue = { showToast: jest.fn() }

describe("AddBoard", () => {
  beforeAll(() => {
    mockUseSelector.mockReturnValue(mockReturnSelectorValue)
    mockUseActions.mockReturnValue(mockReturnActionsValue as any)
    mockAddBoard.mockReturnValue([jest.fn(), mockReturnAdd])
    mockGetByIds.mockImplementation((ids: number[] | typeof skipToken) => {
      if (typeof ids !== "symbol")
        return mockReturnUsers(mockUsers.filter(u => ids.some(id => id === u.id))) as any
    })
    mockSearchUsers.mockReturnValue(mockReturnUsers(mockUsers))
  })
  beforeEach(() => {
    jest.restoreAllMocks()
  })
  it("should render the input fields for name and description", () => {
    const component = render(<AddBoard />)

    expect(
      screen.getByLabelText(languages[mockReturnSelectorValue.language].NAME)
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(languages[mockReturnSelectorValue.language].DESCRIPTION)
    ).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should add and remove users", () => {
    const component = render(<AddBoard />)

    fireEvent.focus(screen.getByTestId("search-users-input"))
    expect(screen.queryByTestId("searchList")).toBeInTheDocument()
    fireEvent.focus(screen.getByTestId("search-users-input"))
    fireEvent.change(screen.getByTestId("search-users-input"), { target: { value: "AA" } })
    fireEvent.click(screen.getByTestId("add-user-1"))
    fireEvent.focus(screen.getByTestId("search-users-input"))
    fireEvent.click(screen.getByTestId("add-user-2"))
    expect(screen.getByTestId("users-list").childNodes.length).toEqual(2)
    fireEvent.click(screen.getByTestId("remove-user-2"))
    expect(screen.getByTestId("users-list").childNodes.length).toEqual(1)
    expect(component).toMatchSnapshot()
  })
  it("should not show results with empty input", () => {
    render(<AddBoard />)

    fireEvent.focus(screen.getByTestId("search-users-input"))
    expect(screen.queryByTestId("searchList")).toBeInTheDocument()
    fireEvent.focus(screen.getByTestId("search-users-input"))
    expect(screen.queryByTestId("searchList")?.children.length).toEqual(0)
  })
})
