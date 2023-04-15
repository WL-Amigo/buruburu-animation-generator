import { Component, createSignal } from 'solid-js';
import { OtherMenuButton } from './menuButton';
import { LicensesDialog } from '../LicensesDialog';
import { PrecautionDialog } from '../PrecautionDialog';

export const OtherMenus: Component = () => {
  const [isOpenPrecaution, setIsOpenPrecaution] = createSignal(false);
  const [isOpenLicenses, setIsOpenLicenses] = createSignal(false);

  return (
    <>
      <OtherMenuButton
        onOpenPrecautions={() => setIsOpenPrecaution(true)}
        onOpenLicenses={() => setIsOpenLicenses(true)}
      />
      <PrecautionDialog
        open={isOpenPrecaution()}
        onClose={() => setIsOpenPrecaution(false)}
        showConsentButton={false}
      />
      <LicensesDialog open={isOpenLicenses()} onClose={() => setIsOpenLicenses(false)} />
    </>
  );
};
