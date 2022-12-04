import { IconType } from './Icon';

//#region Public API options
interface StandardLayout {
  type: 'Standard';
  icon?: IconType;
  title: string;
  message: string;
  btn: AlertButtons;
}

interface CustomLayoutContentProps {
  onDismiss: (arg?: any) => void;
}

interface CustomLayout {
  type: 'Custom';
  content: (props: CustomLayoutContentProps) => JSX.Element;
  btn?: AlertButtons;
}

export type AlertOptions = StandardLayout | CustomLayout;

export type ModalOptions = AlertOptions & {
  showCloseBtn?: boolean;
};

export interface NotificationOptions {
  icon: IconType;
  message: string;
  dismissAfterMs?: number;
}

export interface AlertButtons {
  confirmBtnTitle: string;
  cancelBtnTitle?: string;
  confirmDestructive?: boolean;
  cancelDestructive?: boolean;
  layout?: 'row' | 'column';
}

export type AlertBtnResult = 'confirm' | 'cancel';
//#endregion Public API options

//#region Alert Entry
interface AlertBaseEntry {
  type: 'ShowAlert' | 'ShowModal' | 'ShowError';
  content: React.FC;
}

interface ShowAlertEntry extends AlertBaseEntry {
  type: 'ShowAlert';
  promiseResolver: (arg?: any) => void;
}

interface ShowModalEntry extends AlertBaseEntry {
  type: 'ShowModal';
  promiseResolver: (arg?: any) => void;
}

interface ShowErrorEntry extends AlertBaseEntry {
  type: 'ShowError';
  promiseResolver: () => void;
}

export type AlertEntry = ShowAlertEntry | ShowModalEntry | ShowErrorEntry;
//#endregion Alert Entry
