import React, {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {Header, SafeAreaView, CardList} from '@components';
import {WishlistData} from '@data';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function Wishlist({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [refreshing] = useState(false);
  const [wishlist] = useState(WishlistData);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header title={t('wishlist')} />
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 15,
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={() => {}}
          />
        }
        data={wishlist}
        keyExtractor={(item, index) => item.id}
        renderItem={({item, index}) => (
          <CardList
            image={item.image}
            title={item.title}
            subtitle={item.subtitle}
            rate={item.rate}
            style={{marginBottom: 15}}
            onPress={() => navigation.navigate('PlaceDetail')}
          />
        )}
      />
    </SafeAreaView>
  );
}
