import { ReactElement } from 'react';

export enum IconName {
  Bell = 'bell',

  // Ionic Icons
  ConstructOutline = 'construct',
}

export type IconContent = { [key in IconName]: ReactElement };

export type IconType = {
  name: IconName;
  size: number;
  color?: string;
};
