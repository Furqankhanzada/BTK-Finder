import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CardList, PlaceItem } from '@components';
import CustomSectionList from '@screens/businesses/info/components/CustomSectionList';
import { useBusinesses } from '@screens/businesses/queries/queries';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { BusinessesQueryKeysWithFav } from '@screens/businesses/models/BusinessesQueryKeys';
import { useGetProfile } from '@screens/settings/profile/queries/queries';

interface Props {
  onPress: (id: string) => void;
  business: BusinessPresentable;
}

export default function Recommendations({ business, onPress }: Props) {
  const { t } = useTranslation();
  const { data: user } = useGetProfile();
  // Recent Businesses
  const { isLoading: isRecentLoading, data: recentBusinesses } = useBusinesses(
    [BusinessesQueryKeysWithFav.recentBusinesses],
    {
      recent: true,
      limit: 5,
      skip: 0,
      fields: [
        'name',
        'thumbnail',
        'category',
        'address',
        'averageRatings',
        'favorites',
      ].join(','),
    },
  );
  // Related Businesses
  const { isLoading: isRelatedLoading, data: relatedBusinesses } =
    useBusinesses(
      ['related-businesses', business.category],
      {
        limit: 5,
        skip: 0,
        fields: [
          'name',
          'thumbnail',
          'category',
          'averageRatings',
          'favorites',
        ].join(','),
        category: business.category,
      },
      { enabled: !!business.category },
    );

  return (
    <View style={styles.container}>
      <CustomSectionList
        title="Recently Added"
        data={recentBusinesses}
        horizontal={true}
        loading={isRecentLoading}
        renderItem={({ item }: any) => {
          return (
            <PlaceItem
              grid
              image={item?.thumbnail}
              title={item.name}
              subtitle={item.category}
              location={item?.address}
              rate={item?.averageRatings || '0.0'}
              isFavorite={
                !!item?.favorites?.find(
                  (favorite: any) => favorite.ownerId === user?._id,
                )
              }
              businessId={item?._id}
              onPress={() => onPress(item._id)}
              style={styles.placeItemText}
            />
          );
        }}
      />
      <CustomSectionList
        title={t('related')}
        data={relatedBusinesses}
        loading={isRelatedLoading}
        renderItem={({ item, index }: any) => {
          return (
            <CardList
              key={index}
              image={item?.thumbnail}
              title={item.name}
              subtitle={item.category}
              rate={item?.averageRatings || 0.0}
              style={styles.cardList}
              onPress={() => onPress(item._id)}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  cardList: {
    marginBottom: 15,
    marginLeft: 20,
  },
  placeItemText: {
    marginLeft: 15,
    width: 175,
  },
});
