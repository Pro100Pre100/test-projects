import { Modal } from "@mui/material";
import type { ModalProps } from "../../../interface/main";

export default function ModalUI({ open, handleClose, children }: ModalProps) {

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0, 0, 0, 0)' }}
        className="modal__container"
      >
        <>
          {children}
        </>
      </Modal>
    </>
  )
}

