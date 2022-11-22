import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

import { Text } from '@components';
import { BaseColor } from '@config';

import { IconName } from '../../../contexts/alerts-v2/models/Icon';

interface Props {
  ownedBusinesses?: number;
  givenReviews?: number;
  reviewsOnOwnedBusinesses?: number;
}

export default function AccountInfoAlertContent({
  ownedBusinesses,
  givenReviews,
  reviewsOnOwnedBusinesses,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Icon size={70} name={IconName.Warning} color={BaseColor.redColor} />
      <Text textAlign="center" title2 style={styles.title}>
        Account Deletion
      </Text>
      <Text body1 style={styles.description} numberOfLines={20}>
        {`You have data associated with your account.\nBy proceeding with the account deletion you will lose all mentioned records.\n${
          ownedBusinesses === 0
            ? ''
            : `\n${t('ownerOfBusinessesCount', {
                count: ownedBusinesses,
              })}`
        }${
          reviewsOnOwnedBusinesses === 0
            ? ''
            : `\n${t('reviewsOnYourBusinessesCount', {
                count: reviewsOnOwnedBusinesses,
              })}`
        }${
          givenReviews === 0
            ? ''
            : `\n${t('businessesWhereGaveReviewsCount', {
                count: givenReviews,
              })}`
        }\n\nNote: Be careful you won't be able to recover it again.`}
      </Text>
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
});
