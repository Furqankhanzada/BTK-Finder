import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon, Button } from '@components';
import { BaseStyle, useTheme } from '@config';

import { EVENTS, trackEvent } from '../../userTracking';
import { GlobalParamList } from '../../navigation/models/GlobalParamList';

export default function DashboardScreen({
  navigation,
}: StackScreenProps<GlobalParamList, 'Dashboard'>) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const onPressHelpLine = () => {
    navigation.navigate('HelpLine');
    trackEvent(EVENTS.HELPLINE_SCREEN_VISITED);
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={'Explore BTK'}
        renderRight={() => {
          return (
            <Button
              styleText={styles.helplineButtonText}
              style={styles.helplineButton}
              icon={<Icon name={'phone'} size={10} color={'white'} solid />}
              full
              round
              onPress={onPressHelpLine}>
              {t('help_line')}
            </Button>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  helplineButton: {
    width: 80,
    paddingHorizontal: 10,
    height: 25,
  },
  helplineButtonText: {
    marginLeft: 5,
    fontSize: 10,
  },
});
