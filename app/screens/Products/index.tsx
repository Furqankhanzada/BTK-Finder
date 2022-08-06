import React, { useState } from 'react';
import { SectionList, FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { useQuery } from '@apollo/client';

import { Header, SafeAreaView, Icon, Text, Image } from '@components';
import { BaseStyle, useTheme, Images } from '@config';

import Product from './components/Product';
import styles from './styles';
import { GET_PRODUCTS } from '../../requests/shop/menu';
import {
  CatalogItemConnection,
  Maybe,
  QueryCatalogItemsArgs,
} from '../../models/graphql';

export default function Menu(props: any) {
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  const { data, loading, error } = useQuery<
    Maybe<CatalogItemConnection>,
    QueryCatalogItemsArgs
  >(GET_PRODUCTS, {
    variables: {
      shopIds: ['cmVhY3Rpb24vc2hvcDpGN2ZrM3plR3o4anpXaWZzQQ=='],
      first: 20,
    },
  });

  console.log('Data ###', data?.edges);
  console.log('loading ###', loading);
  console.log('error ###', error);

  const menuItems = [
    {
      category: 'Burgers',
      data: [
        {
          name: 'Chicken Burger',
          description:
            'Big special Chicken Burger. Order once and you will come back again and again. The most delicious burger ever.',
          price: 'Rs. 200',
          image:
            'https://www.saltandlavender.com/wp-content/uploads/2016/05/ground-chicken-burgers-1-500x500.jpg',
          extraItems: [
            { name: 'Extra Cheese', price: 'Rs. 50' },
            { name: 'Extra Beens', price: 'Rs. 20' },
            { name: 'Extra Crisp', price: 'Rs. 50' },
            { name: 'Extra Burger', price: 'Rs. 180' },
          ],
        },
        {
          name: 'Chicken Zinger Burger',
          description: 'Cheesy and Crispy Zinger Burger',
          price: 'Rs. 220',
          image:
            'https://recipefairy.com/wp-content/uploads/2020/08/kfc-zinger-burger-500x500.jpg',
        },
        {
          name: 'Chicken Burger',
          description: 'Big special Chicken Burger',
          price: 'Rs. 200',
          image:
            'https://www.saltandlavender.com/wp-content/uploads/2016/05/ground-chicken-burgers-1-500x500.jpg',
        },
        {
          name: 'Chicken Zinger Burger',
          description: 'Cheesy and Crispy Zinger Burger',
          price: 'Rs. 220',
          image:
            'https://recipefairy.com/wp-content/uploads/2020/08/kfc-zinger-burger-500x500.jpg',
        },
        {
          name: 'Beef Burger',
          description: '',
          price: 'Rs. 250',
          image:
            'https://www.pizzeria-calzone.com/image/cache/catalog/products/Burgers/701-500x500.JPG',
        },
      ],
    },
    {
      category: 'Pizza',
      data: [
        {
          name: 'BBQ Tikka',
          description: 'Large',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/6RRFmJh/54b761655ff35ea4996ad9a232dd1761.png',
          extraItems: [
            { name: 'Extra cheese on top', price: 'Rs. 100' },
            { name: 'Cheese borders', price: 'Rs. 150' },
            { name: 'Extra Chicken', price: 'Rs. 200' },
            { name: 'Bread Crumbs', price: 'Rs. 250' },
          ],
        },
        {
          name: 'Afghani Tikka',
          description: 'Medium',
          price: 'Rs. 600-1400',
          image: 'https://i.ibb.co/rMhygBQ/afghani-tikka.png',
        },
        {
          name: 'Chicken Fajita',
          description: 'Small',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/4dBVhSm/3bc223c5e7add3397f8e40a2747d8c49.png',
        },
        {
          name: 'BBQ Tikka',
          description: 'Large',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/6RRFmJh/54b761655ff35ea4996ad9a232dd1761.png',
        },
        {
          name: 'Afghani Tikka',
          description: 'Medium',
          price: 'Rs. 600-1400',
          image: 'https://i.ibb.co/rMhygBQ/afghani-tikka.png',
        },
        {
          name: 'Chicken Malai Boti',
          description: 'Large',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/4N5F4Cj/be40fe795ebc207fefb8245e996acfc5.png',
        },
        {
          name: 'Chicken Fajita',
          description: 'Small',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/4dBVhSm/3bc223c5e7add3397f8e40a2747d8c49.png',
        },
      ],
    },
    {
      category: 'Soft Drinks',
      data: [
        {
          name: 'Pepsi',
          description: 'Original Pepsi Cold Drink',
          price: 'Rs. 40-140',
          image:
            'https://cdn.shopify.com/s/files/1/0522/2357/4165/products/1029826-1_grande.jpg?v=1614157765',
        },
        {
          name: 'Coke',
          description: 'Original Coke Cold Drink',
          price: 'Rs. 40-140',
          image:
            'https://dailyease.pk/wp-content/uploads/2020/03/Coca-Cola-Bottle-2250-ml-online-grocery-600x600.jpg',
        },
        {
          name: '7up',
          description: 'Original 7up Cold Drink',
          price: 'Rs. 40-140',
          image:
            'https://dailyease.pk/wp-content/uploads/2020/03/7Up-Bottle-1000-ml-online-grocery.jpg',
        },
        {
          name: 'Sprite',
          description: 'Original Sprite Cold Drink',
          price: 'Rs. 40-140',
          image:
            'https://grozar.pk/wp-content/uploads/2020/07/Grozar-Sprite-Soft-Drink-2.25Ltr.jpg',
        },
        {
          name: 'Fanta',
          description: 'Original Fanta Cold Drink',
          price: 'Rs. 40-140',
          image:
            'https://izmafood.com/wp-content/uploads/2020/07/Fanta-Bottle-1-Litre.jpg',
        },
      ],
    },
    {
      category: 'Burgers',
      data: [
        {
          name: 'Chicken Burger',
          description:
            'Big special Chicken Burger. Order once and you will come back again and again. The most delicious burger ever.',
          price: 'Rs. 200',
          image:
            'https://www.saltandlavender.com/wp-content/uploads/2016/05/ground-chicken-burgers-1-500x500.jpg',
          extraItems: [
            { name: 'Extra Cheese', price: 'Rs. 50' },
            { name: 'Extra Beens', price: 'Rs. 20' },
            { name: 'Extra Crisp', price: 'Rs. 50' },
            { name: 'Extra Burger', price: 'Rs. 180' },
          ],
        },
        {
          name: 'Chicken Zinger Burger',
          description: 'Cheesy and Crispy Zinger Burger',
          price: 'Rs. 220',
          image:
            'https://recipefairy.com/wp-content/uploads/2020/08/kfc-zinger-burger-500x500.jpg',
        },
        {
          name: 'Chicken Burger',
          description: 'Big special Chicken Burger',
          price: 'Rs. 200',
          image:
            'https://www.saltandlavender.com/wp-content/uploads/2016/05/ground-chicken-burgers-1-500x500.jpg',
        },
        {
          name: 'Chicken Zinger Burger',
          description: 'Cheesy and Crispy Zinger Burger',
          price: 'Rs. 220',
          image:
            'https://recipefairy.com/wp-content/uploads/2020/08/kfc-zinger-burger-500x500.jpg',
        },
        {
          name: 'Beef Burger',
          description: '',
          price: 'Rs. 250',
          image:
            'https://www.pizzeria-calzone.com/image/cache/catalog/products/Burgers/701-500x500.JPG',
        },
      ],
    },
    {
      category: 'Pizza',
      data: [
        {
          name: 'BBQ Tikka',
          description: 'Large',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/6RRFmJh/54b761655ff35ea4996ad9a232dd1761.png',
          extraItems: [
            { name: 'Extra cheese on top', price: 'Rs. 100' },
            { name: 'Cheese borders', price: 'Rs. 150' },
            { name: 'Extra Chicken', price: 'Rs. 200' },
            { name: 'Bread Crumbs', price: 'Rs. 250' },
          ],
        },
        {
          name: 'Afghani Tikka',
          description: 'Medium',
          price: 'Rs. 600-1400',
          image: 'https://i.ibb.co/rMhygBQ/afghani-tikka.png',
        },
        {
          name: 'Chicken Fajita',
          description: 'Small',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/4dBVhSm/3bc223c5e7add3397f8e40a2747d8c49.png',
        },
        {
          name: 'BBQ Tikka',
          description: 'Large',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/6RRFmJh/54b761655ff35ea4996ad9a232dd1761.png',
        },
        {
          name: 'Afghani Tikka',
          description: 'Medium',
          price: 'Rs. 600-1400',
          image: 'https://i.ibb.co/rMhygBQ/afghani-tikka.png',
        },
        {
          name: 'Chicken Malai Boti',
          description: 'Large',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/4N5F4Cj/be40fe795ebc207fefb8245e996acfc5.png',
        },
        {
          name: 'Chicken Fajita',
          description: 'Small',
          price: 'Rs. 600-1400',
          image:
            'https://i.ibb.co/4dBVhSm/3bc223c5e7add3397f8e40a2747d8c49.png',
        },
      ],
    },
  ];

  const onItemClick = (item: any) => {
    setModalVisible(true);
    setSelectedItem(item);
  };

  const Item = ({ item, index }: any) => {
    return (
      <Product
        style={{ borderLeftWidth: index === 0 ? 1 : 0 }}
        name={item.name}
        description={item.description}
        price={item.price}
        image={item.image}
        onPress={() => onItemClick(item)}
      />
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('menu')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <SectionList
        style={styles.menuContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        sections={menuItems}
        keyExtractor={(item: any) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={{ paddingBottom: 10 }}>
            <Text
              style={{
                color: colors.text,
                paddingBottom: 10,
                paddingLeft: 20,
              }}>
              {section.category}
            </Text>
            <FlatList
              style={{ paddingLeft: 20 }}
              horizontal
              data={section.data}
              renderItem={({ item, index }) => (
                <Item item={item} index={index} />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        renderItem={({ item, section }: any) => {
          return null;
          // return <ListItem item={item} />;
        }}
      />
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          // setSortOption(props.sortOption);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[
            styles.contentFilterBottom,
            { backgroundColor: colors.card },
          ]}>
          <Image
            source={selectedItem.image ?? Images.imagePlaceholder}
            style={[styles.modalImage, { backgroundColor: colors.card }]}
          />
          <View style={[styles.contentSwipeDown]}>
            <View style={styles.lineSwipeDown} />
          </View>
          <View style={styles.contentPadding}>
            <Text semibold title1 style={styles.modalTitle}>
              {selectedItem.name}
            </Text>
            {selectedItem?.description ? (
              <Text body2 style={styles.modalDescription}>
                {selectedItem.description}
              </Text>
            ) : null}
            <Text callout bold primaryColor style={{ paddingBottom: 10 }}>
              {selectedItem.price}
            </Text>
            <View style={styles.extraItemsSection}>
              {selectedItem?.extraItems &&
                selectedItem.extraItems.map((item: any) => {
                  return (
                    <View
                      style={[
                        styles.extraItems,
                        { borderColor: colors.border },
                      ]}>
                      <Text body2>{item.name}</Text>
                      <Text body2>{item.price}</Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
