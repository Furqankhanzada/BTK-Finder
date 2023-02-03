import React, { useEffect } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { getUniqueId } from 'react-native-device-info';

import * as Utils from '@utils';
import {
  Header,
  SafeAreaView,
  Icon,
  Image,
  Text,
  Button,
  Loading,
} from '@components';
import { BaseStyle, Images, useTheme } from '@config';
import { DashboardParamList } from 'navigation/models/DashboardParamList';
import { useNotification } from '../queries/queries';
import { useNotificationUserSave } from '../queries/mutations';

export default function NotificationInfoScreen(
  props: StackScreenProps<DashboardParamList, 'NotificationInfo'>,
) {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { data, isLoading } = useNotification(route?.params?.id);
  const { mutate } = useNotificationUserSave();

  // const getButtonText = (type: string) => {
  //   if (type === 'facebook') {
  //     return 'Open Facebook Link';
  //   }
  //   if (type === 'business') {
  //     return 'View Details';
  //   }
  // };

  // const getButtonColor = (type: string) => {
  //   if (type === 'facebook') {
  //     return '#3b5998';
  //   }
  //   return colors.primary;
  // };

  useEffect(() => {
    if (!route?.params?.read) {
      mutate({
        read: true,
        notificationId: route?.params?.id,
        deviceUniqueId: getUniqueId().toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate]);

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
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <View style={styles.container}>
          <Image
            source={data?.image ?? Images.imagePlaceholder}
            style={styles.image}
          />
          <Text title3>{data?.title}</Text>
          <Text body2 style={styles.content}>
            {data?.description}
          </Text>
          {data?.link ? (
            <Button
              full
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => Linking.openURL(data.link ?? '')}>
              View Details
            </Button>
          ) : null}
        </View>
      )}
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
  icon: {
    marginRight: 10,
  },
});
