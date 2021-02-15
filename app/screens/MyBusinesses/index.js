import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Animated, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CardList,
  Loading,
  Text,
} from '@components';
import styles from './styles';
import { getMyBusinesses, getSingleBusiness } from '../../actions/business';

export default function MyBusinesses(props) {
  const { navigation, route } = props;
  const scrollAnim = new Animated.Value(0);
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);

  const stateProps = useSelector(({ businesses }) => {
    return {
      myBusinesses: businesses.myBusinesses,
      getMyBusinessesLoading: businesses.getMyBusinessesLoading,
      getLoadMoreLoading: businesses.getMyBusinessesLoadMoreLoading,
      getEditLoading: businesses.getSingleBusinessLoading,
    };
  });

  useEffect(() => {
    let payload = {
      skip: skip,
      limit: limit,
      fields: 'name, thumbnail, category, averageRatings',
      ownerId: route?.params?.id,
    };
    dispatch(getMyBusinesses(payload));
  }, [skip]);

  const onScrollHandler = () => {
    if (stateProps.getMyBusinessesLoading || stateProps.getLoadMoreLoading) {
      return;
    }
    setSkip(stateProps.myBusinesses.length);
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
    if (stateProps.myBusinesses.length && stateProps.getLoadMoreLoading) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
    return null;
  };

  const onEdit = (id) => {
    dispatch(
      getSingleBusiness(id, true, () =>
        navigation.navigate('EditBusiness', { id }),
      ),
    );
  };

  const navigateBusinessDetail = (id) => {
    navigation.navigate('PlaceDetail', { id });
  };
  const navigateToReview = (id) => {
    navigation.navigate('Review', { id });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
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
      {stateProps.getMyBusinessesLoading ? (
        <Loading loading={stateProps.getMyBusinessesLoading} />
      ) : (
        <View style={{ flex: 1 }}>
          <Animated.FlatList
            contentContainerStyle={{
              padding: 20,
              flex: stateProps?.myBusinesses?.length ? 0 : 1,
            }}
            onEndReached={onScrollHandler}
            onEndThreshold={0.1}
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
            data={stateProps.myBusinesses}
            key={'block'}
            keyExtractor={(item, index) => item._id}
            ListEmptyComponent={listEmptyComponent}
            renderItem={({ item, index }) => {
              return (
                <CardList
                  key={index}
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  rate={item?.averageRatings || '0.0'}
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
