import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import * as Utils from '@utils';
import { Header, SafeAreaView, Icon, Image, Text, Button } from '@components';
import { BaseStyle, Images, useTheme } from '@config';
import { GlobalParamList } from 'navigation/models/GlobalParamList';

export default function NotificationInfoScreen(
  props: StackScreenProps<GlobalParamList>,
) {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();

  const data = route?.params?.data ?? {};

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('notification_info')}
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
      <View style={styles.container}>
        <Image
          source={data?.image ?? Images.imagePlaceholder}
          style={styles.image}
        />
        <Text title3>{data?.title}</Text>
        <Text body2 style={styles.content}>
          {data?.description}
        </Text>
        {data?.link && (
          <Button
            full
            style={styles.button}
            onPress={() => Linking.openURL(data.link)}>
            Go to Link
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  image: {
    width: '100%',
    height: Utils.scaleWithPixel(300),
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  content: {
    marginTop: 10,
  },
  button: {
    marginTop: 'auto',
  },
});
