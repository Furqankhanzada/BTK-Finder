import React, { useState } from 'react';
import { RefreshControl, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon, ListThumbCircle } from '@components';
import { BaseStyle, useTheme } from '@config';
import { GlobalParamList } from 'navigation/models/GlobalParamList';

import { NotificationData } from '../../../data/notification';

export default function NotificationsListScreen({
  navigation,
}: StackScreenProps<GlobalParamList>) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [refreshing] = useState<boolean>(false);
  const [notification] = useState<any>(NotificationData);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
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
        data={notification}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <ListThumbCircle
            image={item.image}
            txtLeftTitle={item.title}
            txtContent={item.description}
            txtSubContent={item.date}
            style={[
              styles.item,
              !item.isRead && { backgroundColor: colors.card },
            ]}
            txtContentStyle={{ color: colors.text }}
            onPress={() =>
              navigation.navigate('NotificationInfo', { data: item })
            }
          />
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
