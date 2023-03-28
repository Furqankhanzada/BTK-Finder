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
import IonIcon from 'react-native-vector-icons/Ionicons';
import { useAlerts } from '@hooks';
import { BaseColor, BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CardList,
  Loading,
  Text,
} from '@components';
import { useBusinessesInfinite } from '../businesses/queries/queries';

import { getSingleBusiness } from '../../actions/business';
import { IconName } from '../../contexts/alerts-v2/models/Icon';
import { useDeleteBusiness } from '@screens/businesses/queries/mutations';

export default function MyBusinessesScreen(props: any) {
  const { navigation, route } = props;
  const scrollAnim = new Animated.Value(0);
  const dispatch = useDispatch();
  const { mutate: deleteBusiness } = useDeleteBusiness();
  const { showAlert, showNotification } = useAlerts();
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

  const stateProps = useSelector(({ businesses }) => {
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

  const onPressDelete = async (businessId: string) => {
    const buttonPressed = await showAlert({
      content: () => (
        <>
          <IonIcon
            size={70}
            name={IconName.Warning}
            color={BaseColor.redColor}
          />
          <Text textAlign="center" header>
            Business Deletion
          </Text>
          <Text textAlign="center" body1>
            This will delete your business permanently and you won't be able to
            recover it again. By proceeding with the business deletion you will
            lose your business records.
          </Text>
          <View style={styles.alertDescription}>
            <Text textAlign="center" bold accentColor>
              Note:
            </Text>
            <Text textAlign="center" body1>
              Be careful you won't be able to recover it again.
            </Text>
          </View>
        </>
      ),
      btn: {
        confirmDestructive: true,
        confirmBtnTitle: 'Delete',
        cancelBtnTitle: 'Cancel',
      },
      type: 'Custom',
    });

    if (buttonPressed === 'confirm') {
      deleteBusiness(
        { businessId },
        {
          onSuccess() {
            showNotification({
              icon: {
                size: 70,
                name: IconName.CheckMarkCircle,
                color: BaseColor.greenColor,
              },
              message:
                'Your business and all data related to it were deleted permanently.',
              dismissAfterMs: 4000,
            });
          },
        },
      );
    }
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
            keyExtractor={(item, index) => item._id}
            ListEmptyComponent={listEmptyComponent}
            renderItem={({ item, index }) => {
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
                  deleteAble={true}
                  onPressEdit={() => onEdit(item._id)}
                  onPressDelete={() => onPressDelete(item._id)}
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
  alertDescription: {
    marginTop: 24,
  },
});
