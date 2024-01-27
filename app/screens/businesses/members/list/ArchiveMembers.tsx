import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { SafeAreaView, CardList } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useBusiness, useMembers } from '@screens/businesses/queries/queries';
import { useProfile } from '@screens/settings/profile/queries/queries';
import { MembershipStatus } from '@screens/settings/profile/models/UserPresentable';

import { MembersStackParamList } from '../../../../navigation/models/BusinessDetailBottomTabParamList';

type Props = StackScreenProps<MembersStackParamList, 'Members'>;

export default function ArchiveMembers(props: Props) {
  const { navigation, route } = props;
  const { data, isRefetching, refetch } = useMembers(route.params.businessId);
  const { data: business } = useBusiness(route.params.businessId);
  const { data: user } = useProfile();

  const { colors } = useTheme();

  const archiveMembers = data?.filter(
    (item) => item.membership.status === MembershipStatus.ARCHIVE,
  );

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <View style={styles.container}>
        <FlatList
          listKey="members"
          refreshControl={
            <RefreshControl
              title="Pull to refresh"
              colors={[colors.primary]}
              tintColor={colors.primary}
              titleColor={colors.text}
              refreshing={isRefetching}
              onRefresh={refetch}
            />
          }
          style={[styles.membersContainer]}
          data={archiveMembers}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <View>
              <Text style={[styles.listEmptyText, { color: colors.text }]}>
                No members found
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CardList
              key={item._id}
              image={item.avatar}
              title={item.name}
              subtitle={item.email}
              style={styles.membersList}
              onPress={() => {}}
              options={[item.membership.package.name]}
              editAble={business?.ownerId === user?._id}
              onPressEdit={() =>
                navigation.navigate('AddOrEditMember', {
                  businessId: route.params.businessId,
                  membership: item.membership,
                })
              }
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addButton: {
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 15,
    marginLeft: 5,
  },
  membersContainer: {
    marginTop: 15,
  },
  membersList: {
    marginTop: 10,
  },
  listEmptyText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
});
