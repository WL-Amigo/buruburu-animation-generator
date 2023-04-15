import { Menu, MenuItem } from 'solid-headless';
import { Component, ParentProps, Show, createSignal } from 'solid-js';
import { ActionButton } from '../../components/Button';
import { IconDotsVertical, IconPackage, IconPrecaution } from '../../components/icons';
import { useFloating } from 'solid-floating-ui';
import { flip, offset, shift } from '@floating-ui/dom';
import { Portal } from 'solid-js/web';

interface Props {
  onOpenPrecautions: () => void;
  onOpenLicenses: () => void;
}

export const OtherMenuButton: Component<Props> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [buttonEl, setButtonEl] = createSignal<HTMLElement | null>(null);
  const [floatingEl, setFloatingEl] = createSignal<HTMLElement | null>(null);
  const position = useFloating(buttonEl, floatingEl, {
    placement: 'top',
    middleware: [offset(4), shift({ padding: { left: 4, right: 4 } }), flip()],
  });

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <ActionButton ref={setButtonEl} class="border-l flex-shrink-0 w-12" onClick={() => setIsOpen(true)}>
        <IconDotsVertical />
      </ActionButton>
      <Portal mount={document.getElementById('dialog')!}>
        <Show when={isOpen()}>
          <div class="absolute inset-0 w-full h-full" onClick={closeMenu}>
            <Menu
              class="py-2 bg-white shadow border-1 border-gray-500 rounded w-72 flex flex-col items-stretch"
              ref={setFloatingEl}
              style={{
                position: position.strategy,
                top: `${position.y ?? 0}px`,
                left: `${position.x ?? 0}px`,
              }}
              onClick={(ev: MouseEvent) => ev.stopPropagation()}
            >
              <OtherMenuItem onClick={props.onOpenPrecautions} closeMenu={closeMenu}>
                <IconPrecaution />
                <span>利用上の注意</span>
              </OtherMenuItem>
              <OtherMenuItem onClick={props.onOpenLicenses} closeMenu={closeMenu}>
                <IconPackage />
                <span>ソフトウェアライセンス・謝辞</span>
              </OtherMenuItem>
            </Menu>
          </div>
        </Show>
      </Portal>
    </>
  );
};

const OtherMenuItem: Component<ParentProps<{ onClick: () => void; closeMenu: () => void }>> = (props) => {
  const onClickLocal = () => {
    props.closeMenu();
    props.onClick();
  };
  return (
    <MenuItem
      as="button"
      class="p-2 bg-white hover:bg-gray-100 flex flex-row gap-x-2 items-center"
      onClick={onClickLocal}
    >
      {props.children}
    </MenuItem>
  );
};
