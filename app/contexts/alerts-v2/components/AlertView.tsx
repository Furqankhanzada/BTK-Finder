import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Button, Text } from '@components';
import { AlertBtnResult, AlertOptions } from '../models/types';

type Props = AlertOptions & {
  onDismiss: (result: AlertBtnResult) => void;
};

export const AlertView: React.FC<Props> = (props: Props) => {
  const btnLayoutStyle =
    props.btn?.layout === 'row' ? styles.btnRowStyle : styles.btnColumnStyle;

  const onConfirm = () => props.onDismiss('confirm');
  const onCancel = () => props.onDismiss('cancel');

  function renderContent() {
    if (props.type === 'Custom') {
      const Component = props.content;
      return <Component onDismiss={props.onDismiss} />;
    } else {
      return (
        <>
          {props.icon ? <Icon {...props.icon} /> : null}
          <Text
            textAlign="center"
            title2
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                marginTop: props.icon ? 20 : 0,
              },
            ]}>
            {props.title}
          </Text>
          <Text
            body1
            style={styles.message}
            numberOfLines={20}
            textAlign="center">
            {props.message}
          </Text>
        </>
      );
    }
  }

  return (
    <>
      {renderContent()}
      {props.btn && (
        <View style={[styles.btnContainer, btnLayoutStyle]}>
          {props.btn.cancelBtnTitle ? (
            <Button
              full
              onPress={onCancel}
              isEmpty={!props.btn.cancelDestructive}
              destructive={props.btn.cancelDestructive}>
              {props.btn.cancelBtnTitle}
            </Button>
          ) : null}
          <View style={styles.space} />
          <Button
            full
            onPress={onConfirm}
            destructive={props.btn.confirmDestructive}>
            {props.btn.confirmBtnTitle}
          </Button>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  message: {
    marginTop: 24,
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  space: {
    height: 8,
    width: 8,
  },
  btnColumnStyle: {
    flexDirection: 'column',
    width: '100%',
  },
  btnRowStyle: {
    flexDirection: 'row',
    width: '50%',
  },
});
