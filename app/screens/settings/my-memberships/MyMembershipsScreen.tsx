import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';

import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Tag } from '@components';
import { SettingsParamList } from 'navigation/models/SettingsParamList';

import { useProfile } from '../profile/queries/queries';

export default function MyMemberships({
  navigation,
}: StackScreenProps<SettingsParamList, 'MyMemberships'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { data: profileData, refetch } = useProfile();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('My Memberships')}
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
            title="Pull to refresh"
            titleColor={colors.text}
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        style={[styles.memberships]}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {['All', 'Active', 'Cancelled'].map((filter) => (
              <Tag
                rate
                style={[
                  styles.headerFilterItem,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}>
                {filter}
              </Tag>
            ))}
          </View>
        }
        data={profileData?.memberships}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity>
              <View
                style={[styles.card, { backgroundColor: colors.background }]}>
                <Text title3>{item.businessId}</Text>
                <Text body2 style={styles.cardTextSpacing}>
                  {item.package.name}
                </Text>
                <Text regular>
                  Next payment
                  <Text bold> Rs.{item.package.amount} </Text>
                  due by
                  <Text bold>
                    {' '}
                    {format(new Date(item.startedAt), 'MMMM d, y')}
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  memberships: {
    padding: 20,
  },
  headerFilterItem: {
    marginRight: 5,
  },
  card: {
    borderRadius: 5,
    padding: 16,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    width: '100%',
    marginTop: 15,
  },
  cardTextSpacing: {
    marginVertical: 8,
  },
  listHeader: {
    flexDirection: 'row',
  },
});
