import { useContext } from 'react';

import { AlertsV2Context } from '../contexts/alerts-v2/AlertsV2Context';
import { AlertsV2ContextType } from '../contexts/alerts-v2/models/AlertsV2ContextType';

export function useAlerts(): AlertsV2ContextType;

export function useAlerts() {
  return useContext(AlertsV2Context);
}
