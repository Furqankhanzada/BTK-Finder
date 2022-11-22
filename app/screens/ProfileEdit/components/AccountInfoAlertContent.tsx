import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { Text } from '@components';
import { BaseColor } from '@config';

import { IconName } from '../../../contexts/alerts-v2/models/Icon';
import { DeleteUserAccountResponse } from '@screens/ProfileEdit/queries/mutations';

export default function AccountInfoAlertContent({
  ownerOfBusinessesCount,
  businessesWhereGaveReviewsCount,
  reviewsOnYourBusinessesCount,
}: DeleteUserAccountResponse) {
  return (
    <>
      <Icon size={70} name={IconName.Warning} color={BaseColor.redColor} />
      <Text textAlign="center" header style={styles.title}>
        Account Deletion
      </Text>
      <View style={styles.description}>
        <Text textAlign="center" body1 style={styles.bottomSpacing}>
          You have data associated with your account. By proceeding with the
          account deletion you will lose all mentioned records.
        </Text>
        {businessesWhereGaveReviewsCount ? (
          <Text textAlign="center" bold>
            You gave the {businessesWhereGaveReviewsCount} reviews to other
            businesses.
          </Text>
        ) : null}
        {ownerOfBusinessesCount ? (
          <Text textAlign="center" bold>
            You are the owner of {ownerOfBusinessesCount} businesses.
          </Text>
        ) : null}
        {reviewsOnYourBusinessesCount ? (
          <Text textAlign="center" bold>
            You businesses have {reviewsOnYourBusinessesCount} reviews.
          </Text>
        ) : null}
      </View>
      <View style={styles.description}>
        <Text textAlign="center" bold accentColor>
          Note:
        </Text>
        <Text textAlign="center" body1>
          Be careful you won't be able to recover it again.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 20,
  },
  description: {
    marginTop: 24,
  },
  bottomSpacing: {
    marginBottom: 24,
  },
});
