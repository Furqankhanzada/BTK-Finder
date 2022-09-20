import {
  AlertBtnResult,
  AlertButtons,
  AlertOptions,
  ModalOptions,
  NotificationOptions,
} from './types';

export interface AlertsV2ContextType {
  showError: (message: string) => Promise<void>;
  showAlert: ShowAPI<AlertOptions>;
  showModal: ShowAPI<ModalOptions>;
  showNotification: (options: NotificationOptions) => void;
}

// If you pass `btn`, you get back `Promise<AlertBtnResult>`
// If `btn` is not passed, you get back `Promise<any>`
type ShowAPI<OptionsType extends AlertOptions> = <Options extends OptionsType>(
  opt: Options,
) => Promise<Options['btn'] extends AlertButtons ? AlertBtnResult : any>;
