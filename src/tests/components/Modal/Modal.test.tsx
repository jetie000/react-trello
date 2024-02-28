import * as React from "react"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import Modal from "@/components/modal/Modal"

describe("Modal", () => {
  it("should render a modal with the given id, title, size and children", () => {
    const id = "modalId"
    const title = "Modal Title"
    const size = "md"
    const children = "Modal Content"

    const component = render(
      <Modal id={id} title={title} size={size}>
        {children}
      </Modal>
    )

    expect(screen.getByTestId("modal")).toBeInTheDocument()
    expect(screen.getByText(title)).toBeInTheDocument()
    expect(screen.getByText(children)).toBeInTheDocument()
    expect(component).toMatchSnapshot()
  })
  it("should render a modal with a header containing the title and a close button", () => {
    const id = "modalId"
    const title = "Modal Title"
    const size = "md"
    const children = "Modal Content"

    render(
      <Modal id={id} title={title} size={size}>
        {children}
      </Modal>
    )

    const modalElement = screen.getByTestId("modal")
    expect(modalElement).toBeInTheDocument()
    expect(modalElement).toHaveAttribute("id", id)
    expect(modalElement).toHaveAttribute("aria-labelledby", id + "Label")

    const modalTitleElement = screen.getByText(title)
    expect(modalTitleElement).toBeInTheDocument()

    const closeButtonElement = screen.getByLabelText("Close")
    expect(closeButtonElement).toBeInTheDocument()
  })
})
