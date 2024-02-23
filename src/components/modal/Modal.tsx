import React from "react"
import { ReactElement } from "react"

interface ModalProps {
  id: string
  title: string
  children: ReactElement | ReactElement[] | string
  size: "sm" | "md" | "lg"
}

function Modal({ id, title, size, children }: ModalProps) {
  return (
    <div
      className="modal  fade"
      id={id}
      tabIndex={-1}
      role="dialog"
      aria-hidden="true"
      aria-labelledby={id + "Label"}
    >
      <div className={"modal-dialog modal-dialog-centered modal-" + size} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={id + "Label"}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default Modal
