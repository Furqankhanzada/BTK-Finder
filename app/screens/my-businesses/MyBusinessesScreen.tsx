import React, { useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { GlobalParamList } from 'navigation/models/GlobalParamList';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CardList,
  Loading,
  Text,
} from '@components';

import { useBusinessesInfinite } from '../businesses/queries/queries';

export default function MyBusinessesScreen(
  props: StackScreenProps<GlobalParamList, 'MyBusinesses'>,
) {
  const { navigation } = props;
  const scrollAnim = new Animated.Value(0);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const user = useSelector((state: any) => state.profile);

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useBusinessesInfinite(['my-business'], {
    limit: 10,
    skip: 0,
    recent: true,
    fields: 'name, thumbnail, category, averageRatings',
    ownerId: user._id,
  });

  const myBusinesses = data?.pages.map((businesses) => businesses).flat();

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.sectionEmpty}>
        <Text semibold style={styles.sectionEmptyText}>
          No Businesses Found
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return null;
  };

  const onEdit = (id: string) => {
    navigation.navigate('EditBusiness', { id });
  };

  const navigateBusinessDetail = (id: string) => {
    navigation.navigate('BusinessDetailTabNavigator', { businessId: id });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('my_businesses')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.navigate('Welcome');
        }}
      />
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <View style={styles.container}>
          <Animated.FlatList
            contentContainerStyle={[
              styles.animatedFlatlist,
              // eslint-disable-next-line react-native/no-inline-styles
              { flex: myBusinesses?.length ? 0 : 1 },
            ]}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                tintColor={colors.primary}
                refreshing={isRefreshing}
                progressViewOffset={80}
                onRefresh={() => onRefresh()}
              />
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.3}
            scrollEventThrottle={1}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      y: scrollAnim,
                    },
                  },
                },
              ],
              { useNativeDriver: true },
            )}
            data={myBusinesses}
            key={'block'}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={listEmptyComponent}
            renderItem={({ item }) => {
              return (
                <CardList
                  key={item._id}
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  rate={item?.averageRatings || 0.0}
                  style={styles.cardList}
                  onPress={() => navigateBusinessDetail(item._id)}
                  editAble={true}
                  onPressEdit={() => onEdit(item._id)}
                />
              );
            }}
            ListFooterComponent={renderFooter}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sectionEmptyText: {
    textAlign: 'center',
  },
  listFooter: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  animatedFlatlist: {
    padding: 20,
  },
  cardList: {
    marginBottom: 15,
  },
});
