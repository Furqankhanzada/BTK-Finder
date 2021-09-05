import React from 'react';
import { useTranslation } from 'react-i18next';
import { Header, SafeAreaView, Icon,Text } from '@components';
import { BaseStyle, useTheme } from '@config';

export default function Menu(props) {
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('menu')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <Text>Menu Items Will Appear Here</Text>
    </SafeAreaView>
  );
}
