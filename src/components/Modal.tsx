import { FormEvent } from 'react';

import "../styles/Modal.css";

interface ModalProperties {
  id: string;
  title: string;
  text: string;
  btnOK?: string;
  btnClose?: string;
  isOpen: boolean;
  onProsess?: (e: FormEvent) => void;
  onClose: (e: FormEvent) => void;
}

function Modal(props: ModalProperties) {
  return (
    <section>
    { props.isOpen && <div className="overlay" id={props.id}>
      <div className="modal">
        <h3 className="modal-title">{props.title}</h3>
        <p className="modal-content">{props.text}</p>
        <button className="closeButton" onClick={props.onClose}>X</button>
        <div className="modal-button">
          {props.btnOK && <button className="okModal" onClick={props.onProsess}>{props.btnOK}</button>}
          {props.btnClose && <button className="closeModal" onClick={props.onClose}>{props.btnClose}</button>}
        </div>
      </div>
    </div> }
    </section>
  );
}

export default Modal;