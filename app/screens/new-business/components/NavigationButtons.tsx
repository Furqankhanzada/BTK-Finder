import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@components';
import { BaseColor } from '@config';
import { useNavigation } from '@react-navigation/native';

type Props = {
  isEdit: boolean;
  disabled?: boolean;
  onSubmit: () => void;
};

export const NavigationButtons = ({ isEdit, disabled, onSubmit }: Props) => {
  const navigation = useNavigation();

  return (
    <View style={isEdit ? styles.footerEdit : styles.footer}>
      {isEdit ? null : (
        <Button style={styles.button} onPress={() => navigation.goBack()}>
          Back
        </Button>
      )}

      <Button
        style={[
          styles.button,
          disabled ? { backgroundColor: BaseColor.grayColor } : null,
        ]}
        disabled={disabled}
        onPress={onSubmit}>
        {isEdit ? 'Update' : 'Next'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  footerEdit: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  button: {
    height: 40,
  },
});
