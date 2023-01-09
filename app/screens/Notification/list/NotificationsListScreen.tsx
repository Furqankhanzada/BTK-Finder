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
import { BaseStyle, Images, useTheme } from '@config';
import { GlobalParamList } from 'navigation/models/GlobalParamList';

import { useGetNotifications } from '../queries/queries';

export default function NotificationsListScreen({
  navigation,
}: StackScreenProps<GlobalParamList>) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [refreshing] = useState<boolean>(false);

  const { data, isLoading } = useGetNotifications({
    deviceUniqueId: getUniqueId(),
  });

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
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={data}
        keyExtractor={(item, index) => item._id + index}
        renderItem={({ item }) => (
          <ListThumbCircle
            image={item?.image ?? Images.imagePlaceholder}
            txtLeftTitle={item.title}
            txtContent={item.description}
            txtSubContent={moment(item.createdAt).fromNow()}
            style={[
              styles.item,
              !item.read && { backgroundColor: colors.primaryHighlight },
            ]}
            txtContentStyle={{ color: colors.text }}
            onPress={() =>
              navigation.navigate('NotificationInfo', {
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
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  item: {
    borderBottomWidth: 0,
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10,
  },
});
