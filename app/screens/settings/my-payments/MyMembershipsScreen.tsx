import React from 'react';
import { View, StyleSheet, Touchable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Tag } from '@components';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SettingsParamList } from 'navigation/models/SettingsParamList';
import { StackScreenProps } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
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
        style={[styles.tagsContainer]}
        horizontal={true}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Tag
              rate
              style={[
                styles.item,
                {
                  backgroundColor: colors.primary,
                },
              ]}>
              All
            </Tag>
            <Tag
              rate
              style={[
                styles.item,
                {
                  backgroundColor: colors.primary,
                },
              ]}>
              Active
            </Tag>
            <Tag
              rate
              style={[
                styles.item,
                {
                  backgroundColor: colors.primary,
                },
              ]}>
              Cancelled
            </Tag>
          </View>
        }
        data={profileData?.memberships}
        renderItem={({ item }) => {
          return <Text>{item.package.name}</Text>;
        }}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  tagsContainer: {
    marginBottom: 10,
    paddingLeft: 20,
  },
  productsContainer: {
    marginTop: 15,
  },
  productList: {
    marginTop: 10,
  },
  item: {
    marginRight: 5,
  },
  listEmptyText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
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
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    width: '95%',
    marginBottom: 20,
    marginTop: 5,
  },
  text: {
    fontWeight: '900',
  },
  listHeader: {
    flexDirection: 'row',
  },
});
