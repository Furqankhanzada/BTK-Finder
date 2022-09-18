import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text } from '@components';
import { NotificationOptions } from '../models/types';

interface Props extends NotificationOptions {
  onDismiss: () => void;
}

export const NotificationView: React.FC<Props> = ({
  icon,
  message,
  dismissAfterMs,
  onDismiss,
}) => {
  React.useEffect(() => {
    setTimeout(onDismiss, dismissAfterMs ?? 2500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.content}>
      {icon ? <Icon {...icon} /> : null}
      <Text title3 style={[styles.message]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    // ...FONT().black().bold().m().build(),
    textAlign: 'center',
    marginTop: 24,
  },
});
