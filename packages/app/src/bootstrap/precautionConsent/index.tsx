import { Accessor, ParentComponent, Show, createSignal, onMount } from 'solid-js';
import { getConsentStatus } from '../../models/precautionConsent';
import { Loading } from '../../components/Loading';
import { PrecautionDialog } from '../../views/PrecautionDialog';

const useConsentStatus = (): [Accessor<boolean | null>, () => void] => {
  const [isUserConsentPrecaution, setConsentStatus] = createSignal<boolean | null>(null);
  onMount(() => {
    getConsentStatus().then((v) => setConsentStatus(v));
  });

  return [isUserConsentPrecaution, () => setConsentStatus(true)];
};
export const ConsentPrecautionStatusGuard: ParentComponent = (props) => {
  const [isUserConsentPrecaution, consentAndCloseDialog] = useConsentStatus();

  return (
    <Show
      when={isUserConsentPrecaution() !== null}
      fallback={<Loading class="w-full h-full justify-center" isLoading />}
    >
      <PrecautionDialog showConsentButton open={!isUserConsentPrecaution() ?? true} onClose={consentAndCloseDialog} />
      <Show when={isUserConsentPrecaution()}>{props.children}</Show>
    </Show>
  );
};
