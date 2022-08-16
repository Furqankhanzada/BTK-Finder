import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { CardList, PlaceItem } from '@components';
import CustomSectionList from '@screens/Home/CustomSectionList';
import { useBusinesses } from '@screens/businesses/queries/queries';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';

interface Props {
  onNavigate: (route: string, id?: string) => void;
  business: BusinessPresentable;
}

export default function Recommendations({ business, onNavigate }: Props) {
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.profile);
  // Recent Businesses
  const { isLoading: isRecentLoading, data: recentBusinesses } = useBusinesses(
    ['recent-businesses'],
    {
      placeDetail: true,
      recent: true,
      limit: 5,
      skip: 0,
      fields: 'name, thumbnail, category, address, averageRatings',
    },
  );
  // Related Businesses
  const { isLoading: isRelatedLoading, data: relatedBusinesses } =
    useBusinesses(
      ['related-businesses', business.category],
      {
        limit: 5,
        skip: 0,
        fields: 'name, thumbnail, category, averageRatings',
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
                  (favorite: any) => favorite.ownerId === user._id,
                )
              }
              businessId={item?._id}
              // navigation={navigation}
              lastRoute="PlaceDetail"
              routeId={business?._id}
              onPress={() => onNavigate('BusinessDetailTabNavigator', item._id)}
              style={{ marginLeft: 15, width: 175 }}
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
              rate={item?.averageRatings || '0.0'}
              style={{ marginBottom: 15 }}
              // onPress={() => navigateBusinessDetail(item._id)}
              // onPressTag={() => navigateToReview(item._id)}
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
});
