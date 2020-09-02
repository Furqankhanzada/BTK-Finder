import React from 'react';
import { View } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, HelpLineItem } from '@components';
import { useTranslation } from 'react-i18next';

const HelpLine = React.memo(({
  navigation
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('HelpLine')}
        renderLeft={() => <Icon name="arrow-left" size={20} color={colors.primary} />}
        onPressLeft={() => navigation.goBack()}
      />
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <HelpLineItem
          onPress={() => alert('hello')}
          image={'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTLuvvU_1HFTBWTfjHNPFpkX0_a5x2xuk6hbw&usqp=CAU'}
          txtLeftTitle={'Complain Department'}
          txtContent={'Dial Extension 700'}
          txtRight={'Date'}
        />
        <HelpLineItem
          image={'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTLuvvU_1HFTBWTfjHNPFpkX0_a5x2xuk6hbw&usqp=CAU'}
          txtLeftTitle={'Passation Department'}
          txtContent={'Dial Extension 618'}
          txtRight={'Date'}
        />
        <HelpLineItem
          image={'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTLuvvU_1HFTBWTfjHNPFpkX0_a5x2xuk6hbw&usqp=CAU'}
          txtLeftTitle={'Security Department'}
          txtContent={'Dial Extension 624'}
          txtRight={'Date'}
        />
        <HelpLineItem
          image={'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTLuvvU_1HFTBWTfjHNPFpkX0_a5x2xuk6hbw&usqp=CAU'}
          txtLeftTitle={'Billing Department'}
          txtContent={'Dial Extension 1031'}
          txtRight={'Date'}
        />
      </View>
    </SafeAreaView>
  );
})

export default HelpLine;