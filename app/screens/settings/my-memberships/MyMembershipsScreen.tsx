import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
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
  const { data: profileData } = useProfile();

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
              <View style={styles.card}>
                <Text style={styles.heading}>{item.package.name}</Text>
                <Text style={styles.subHeading}>{item.package.name}</Text>

                <Text>
                  Next payment
                  <Text style={styles.text}> {item.package.amount} </Text>
                  due by
                  <Text style={styles.text}>
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 5,
  },
  card: {
    backgroundColor: 'white',
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
    marginBottom: 20,
    marginTop: 15,
  },
  text: {
    fontWeight: '900',
  },
  listHeader: {
    flexDirection: 'row',
  },
});
