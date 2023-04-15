import { Component, createSignal } from 'solid-js';
import { LicensesDialog } from './LicensesDialog';

export const InitialPlaceholder: Component = () => {
  const [isLicensesOpen, setIsLicensesOpen] = createSignal(false);

  return (
    <div class="flex flex-col gap-y-4 p-2 items-center">
      <div class="flex flex-col items-center">
        <div>presented by WhiteLuckBringers</div>
        <button
          class="block text-left text-primary-800 hover:text-primary-600 underline"
          onClick={() => setIsLicensesOpen(true)}
        >
          original algorithm by wwwshwww, software licenses
        </button>
      </div>
      <LicensesDialog open={isLicensesOpen()} onClose={() => setIsLicensesOpen(false)} />
    </div>
  );
};
