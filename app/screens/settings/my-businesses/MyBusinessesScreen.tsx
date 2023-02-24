import React, { useState } from 'react';
import {
  Animated,
  View,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CardList,
  Loading,
  Text,
} from '@components';

import { useBusinessesInfinite } from '../../businesses/queries/queries';
import { getSingleBusiness } from '../../../actions/business';
import { SettingsParamList } from '../../../navigation/models/SettingsParamList';

export default function MyBusinessesScreen(
  props: StackScreenProps<SettingsParamList, 'MyBusinesses'>,
) {
  const { navigation } = props;
  const scrollAnim = new Animated.Value(0);
  const dispatch = useDispatch();
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

  const stateProps = useSelector(({ businesses }: any) => {
    return {
      getEditLoading: businesses.getSingleBusinessLoading,
    };
  });

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
    dispatch(
      getSingleBusiness(id, true, () =>
        navigation.navigate('EditBusiness', { id }),
      ),
    );
  };

  const navigateBusinessDetail = (id: string) => {
    navigation.navigate('BusinessDetailTabNavigator', { businessId: id });
  };

  const navigateToReview = (id: string) => {
    navigation.navigate('BusinessDetailTabNavigator', {
      screen: 'ReviewStack',
      params: { businessId: id },
    });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Loading loading={stateProps.getEditLoading} />
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
          navigation.goBack();
        }}
      />
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <View style={{ flex: 1 }}>
          <Animated.FlatList
            contentContainerStyle={{
              padding: 20,
              flex: myBusinesses?.length ? 0 : 1,
            }}
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
                  style={{ marginBottom: 15 }}
                  onPress={() => navigateBusinessDetail(item._id)}
                  onPressTag={() => navigateToReview(item._id)}
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
});
