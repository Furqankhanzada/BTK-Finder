import React, { useEffect } from 'react';
import { FlatList, Platform, View } from 'react-native';
import { BaseStyle } from '@config';
import { Header, SafeAreaView, Text, Loading, CardList } from '@components';
import styles from '../Place/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getFavoriteBusinesses } from '../../actions/favorites';
import { ScrollView } from 'react-native-gesture-handler';

export default function Favourite({ navigation }) {
  const dispatch = useDispatch();

  const stateProps = useSelector(({ favorites }) => {
    return {
      favoriteBusinesses: favorites.getFavoriteBusinesses,
      loading: favorites.getFavoriteBusinessesLoading,
    };
  });

  const navigateBusinessDetail = (id) => {
    navigation.navigate('BusinessDetailTabNavigator', { id });
  };

  useEffect(() => {
    dispatch(
      getFavoriteBusinesses({
        favorite: true,
        skip: 0,
        fields: 'name, thumbnail, category, averageRatings',
      }),
    );
  }, [dispatch]);

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Loading loading={stateProps?.loading} />
      <Header title="Favorite Businesses" />
      {stateProps?.favoriteBusinesses?.length ? (
        <ScrollView
          behavior={Platform.OS === 'android' ? 'height' : 'padding'}
          keyboardVerticalOffset={offsetKeyboard}
          style={{ flex: 1 }}>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 15,
              flex: stateProps?.data?.length ? 0 : 1,
            }}
            data={stateProps.favoriteBusinesses}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item, index }) => {
              return (
                <CardList
                  image={item?.thumbnail}
                  title={item?.name}
                  subtitle={item?.category}
                  rate={item?.averageRatings}
                  style={{ marginBottom: 15 }}
                  onPress={() => navigateBusinessDetail(item._id)}
                />
              );
            }}
          />
        </ScrollView>
      ) : (
        <View style={styles.sectionEmpty}>
          <Text semibold style={styles.sectionEmptyText}>
            No Favorite Businesses Available
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
