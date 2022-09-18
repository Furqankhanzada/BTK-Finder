import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Icon, Text } from '@components';
import { AlertBtnResult, ModalOptions } from '../models/types';

type Props = ModalOptions & {
  onDismiss: (result: AlertBtnResult) => void;
};

export const ModalView: React.FC<Props> = (props: Props) => {
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
          <Text textAlign="center" style={styles.message}>
            {props.message}
          </Text>
        </>
      );
    }
  }

  return (
    <>
      {props.showCloseBtn && (
        <Icon
          onPress={onCancel}
          style={styles.closeBtn}
          size={24}
          name="times"
        />
      )}
      <View style={styles.content}>
        {renderContent()}
        {!!props.btn && (
          <View style={[styles.btnContainer, btnLayoutStyle]}>
            {!!props.btn.cancelBtnTitle && (
              <Button
                full
                onPress={onCancel}
                isEmpty={!props.btn.cancelDestructive}
                destructive={props.btn.cancelDestructive}>
                {props.btn.cancelBtnTitle}
              </Button>
            )}
            <View style={styles.space} />
            <Button full onPress={onConfirm}>
              {props.btn.confirmBtnTitle}
            </Button>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
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
