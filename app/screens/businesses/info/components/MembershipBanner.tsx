import React from 'react';
import { View, StyleSheet } from 'react-native';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { Text } from '@components';
import useAuthStore from '@screens/auth/store/Store';
import { BaseColor } from '@config';

interface Props {
  business: BusinessPresentable;
}

export default function MembershipBanner({ business }: Props) {
  const { user } = useAuthStore();
  const membership = user?.memberships.find(
    (ms) => ms.businessId === business._id,
  );
  if (!membership) {
    return null;
  }
  return (
    <View style={[styles.container, {}]}>
      <Text bold>You have the membership in {business.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: BaseColor.dividerColor,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 10,
  },
});
