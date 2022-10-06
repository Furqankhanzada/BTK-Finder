import React, { useState } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BaseStyle } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CardList,
  Loading,
  Text,
} from '@components';
import { useBusinesses } from '../businesses/queries/queries';

import { getSingleBusiness } from '../../actions/business';

export default function MyBusinesses(props: any) {
  const { navigation, route } = props;
  const scrollAnim = new Animated.Value(0);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);

  const user = useSelector((state: any) => state.profile);

  const { data: myBusinesses, isLoading } = useBusinesses(['my-business'], {
    skip: skip,
    limit: limit,
    recent: true,
    fields: 'name, thumbnail, category, averageRatings',
    ownerId: user._id,
  });

  const stateProps = useSelector(({ businesses }) => {
    return {
      getEditLoading: businesses.getSingleBusinessLoading,
    };
  });

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
    return null;
  };

  const onEdit = (id: any) => {
    dispatch(
      getSingleBusiness(id, true, () =>
        navigation.navigate('EditBusiness', { id }),
      ),
    );
  };

  const navigateBusinessDetail = (id: any) => {
    navigation.navigate('BusinessDetailTabNavigator', { id });
  };

  const navigateToReview = (id: any) => {
    navigation.navigate('Review', { id });
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
