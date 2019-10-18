import { h, JSX } from 'preact';
export interface ModalProps {
  close: ()=>void;
  children?: JSX.Element[];
}

export default function Modal({close, children}: ModalProps) {

  const closeModal = (event: MouseEvent) => {
    if((event.target as Element).matches('.modal-inner')) {
      close();
    }
  }

  return (
    <div class="modal">
      <div class='modal-inner' onClick={closeModal}>
        <div class='modal-content'>
          {children}
        </div>
      </div>
    </div>
  );
}