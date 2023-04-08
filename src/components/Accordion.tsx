import { Component, ParentProps, Show, createSignal } from 'solid-js';
import { IconChevronDown, IconChevronUp } from './icons';
import { Disclosure, DisclosureButton, DisclosurePanel } from 'solid-headless';
import clsx from 'clsx';
import { windi } from '../windi';

interface Props {
  label: string;
}
export const Accordion: Component<ParentProps<Props>> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Disclosure isOpen={isOpen()} onChange={(v) => setIsOpen(v)}>
      {(disclosureProps) => (
        <div class="border border-gray-400 rounded">
          <DisclosureButton
            class={clsx(
              windi`w-full flex flex-row p-2 justify-between hover:bg-gray-50`,
              disclosureProps.isOpen() && windi`border-b border-gray-400`
            )}
          >
            <span>{props.label}</span>
            <Show when={disclosureProps.isOpen()} fallback={<IconChevronDown />}>
              <IconChevronUp />
            </Show>
          </DisclosureButton>
          <DisclosurePanel>{props.children}</DisclosurePanel>
        </div>
      )}
    </Disclosure>
  );
};
