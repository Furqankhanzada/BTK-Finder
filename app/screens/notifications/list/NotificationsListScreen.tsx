import React, { useState } from 'react';
import { RefreshControl, FlatList, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import moment from 'moment';
import { getUniqueId } from 'react-native-device-info';

import {
  Header,
  SafeAreaView,
  Icon,
  ListThumbCircle,
  Text,
  Loading,
} from '@components';
import { BaseStyle, useTheme } from '@config';
import { NotificationParamList } from 'navigation/models/NotificationParamList';

import { useNotifications } from '../queries/queries';
import { NotificationType } from '../models/NotificationPresentable';

export default function NotificationsListScreen({
  navigation,
}: StackScreenProps<NotificationParamList, 'Notification'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data, isLoading, refetch } = useNotifications(['notifications'], {
    deviceUniqueId: getUniqueId(),
    recent: true,
  });
  const { refetch: refecthCount } = useNotifications(['notifications-count'], {
    deviceUniqueId: getUniqueId(),
    unreadCount: true,
  });

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch().then(refecthCount);
    setIsRefreshing(false);
  };

  const getIconName = (type?: NotificationType) => {
    switch (type) {
      case 'Announcement':
        return 'bullhorn';
      case 'Business':
        return 'building';
      case 'User':
        return 'bell';
      case 'Review':
        return 'star';
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Loading loading={isLoading} />
      <Header
        title={t('notifications')}
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
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        data={Array.isArray(data) ? data : []}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item }) => (
          <ListThumbCircle
            style={[
              styles.item,
              !item.read ? { backgroundColor: colors.card } : {},
            ]}
            thumbStyle={styles.thumb}
            txtContentStyle={{ color: colors.text }}
            image={item?.image}
            thumbIconName={getIconName(item?.type)}
            txtLeftTitle={item.title}
            txtContent={item.description}
            txtSubContent={moment(item.createdAt).fromNow()}
            showPoint={!item.read}
            onPress={() =>
              navigation.navigate('NotificationDetail', {
                id: item?._id,
                read: item?.read ?? false,
              })
            }
          />
        )}
        ListEmptyComponent={() => (
          <View>
            <Text body2 textAlign="center">
              No Notifications Found!
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
