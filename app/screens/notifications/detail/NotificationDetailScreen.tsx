import React, { useEffect, useState } from 'react';
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
import { BaseStyle, useTheme } from '@config';
import { DashboardParamList } from 'navigation/models/DashboardParamList';
import { useNotification } from '../queries/queries';
import { useNotificationUserSave } from '../queries/mutations';

export default function NotificationDetailScreen(
  props: StackScreenProps<DashboardParamList, 'NotificationDetail'>,
) {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { data, isLoading } = useNotification(route?.params?.id);
  const { mutate } = useNotificationUserSave();

  const [isImageLoading, setImageLoading] = useState(true);

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
          {data?.image ? (
            <View style={styles.imageContainer}>
              <Image
                source={data?.image}
                style={styles.image}
                onLoadEnd={() => setImageLoading(false)}
              />
              <Loading loading={isImageLoading} />
            </View>
          ) : null}
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
  imageContainer: {
    width: '100%',
    height: Utils.scaleWithPixel(200),
    marginTop: 5,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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
