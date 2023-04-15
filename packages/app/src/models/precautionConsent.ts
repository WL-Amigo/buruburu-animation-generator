import { createStorage } from 'unstorage';
import localStorageDriver from 'unstorage/drivers/localstorage';

const consentStatusKey = 'consentForPrecaution';
const storage = createStorage({
  driver: localStorageDriver({ base: 'app:' }),
});
export const getConsentStatus = async (): Promise<boolean> => {
  const value = await storage.getItem(consentStatusKey);
  return typeof value === 'boolean' ? value : false;
};
export const setConsentStatus = async (next: boolean) => {
  await storage.setItem(consentStatusKey, next);
};
