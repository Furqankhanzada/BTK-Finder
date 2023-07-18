import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon, CardList, Button } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useBusiness, useMembers } from '@screens/businesses/queries/queries';
import { useProfile } from '@screens/settings/profile/queries/queries';

import { MembersStackParamList } from '../../../../navigation/models/BusinessDetailBottomTabParamList';

type Props = StackScreenProps<MembersStackParamList, 'Members'>;

export default function BusinessMembersScreen(props: Props) {
  const { navigation, route } = props;
  const { data, isRefetching, refetch } = useMembers(route.params.businessId);
  const { data: business } = useBusiness(route.params.businessId);
  const { data: user } = useProfile();

  const { colors } = useTheme();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Members"
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
          data={data}
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
              imageStyle={styles.avatar}
              image={item.avatar}
              title={item.name}
              subtitle={item.email}
              style={styles.membersList}
              onPress={() => {}}
              options={[item.membership.package]}
              editAble={business?.ownerId === user?._id}
              onPressEdit={() =>
                navigation.navigate('EditMember', {
                  businessId: route.params.businessId,
                  membership: item.membership,
                })
              }
              deleteAble={business?.ownerId === user?._id}
            />
          )}
          ListFooterComponentStyle={styles.footer}
          ListFooterComponent={
            <Button
              full
              onPress={() =>
                navigation.navigate('AddMember', {
                  businessId: route.params.businessId,
                })
              }>
              Add member
            </Button>
          }
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  footer: {
    marginVertical: 20,
  },
});
