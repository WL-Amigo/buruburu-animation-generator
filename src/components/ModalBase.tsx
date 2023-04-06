import { ParentComponent } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Transition } from 'solid-transition-group';

interface Props {
  open: boolean;
  onClickAway?: () => void;
}
export const ModalBase: ParentComponent<Props> = (props) => {
  return (
    <Portal mount={document.getElementById('dialog')!}>
      <Transition enterClass="opacity-0" enterToClass="opacity-100" exitClass="opacity-100" exitToClass="opacity-0">
        {props.open && (
          <div
            class="bg-black bg-opacity-75 fixed top-0 left-0 w-full h-full max-h-screen flex items-center justify-center transition-opacity duration-200"
            onClick={(ev) => {
              ev.stopPropagation();
              props.onClickAway?.();
            }}
          >
            {props.children}
          </div>
        )}
      </Transition>
    </Portal>
  );
};
