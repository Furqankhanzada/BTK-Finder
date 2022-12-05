import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Icon, Text, Image, StarRating } from '@components';
import { BaseColor, useTheme } from '@config';

interface Props {
  image?: string;
  title: string;
  subTitle: string;
  rating?: number;
  subItem?: boolean;
}

export default function CartItemCard(props: Props) {
  const { colors } = useTheme();

  const { image, title, subTitle, rating, subItem } = props;

  return (
    <View
      style={[
        subItem ? styles.cartSubItem : styles.cartItem,
        {
          borderColor: colors.border,
          backgroundColor: subItem ? colors.card : colors.background,
        },
      ]}>
      <Image
        source={image}
        style={subItem ? styles.cartSubItemImage : styles.cartItemImage}
      />

      <View style={styles.cartContentContainer}>
        {subItem ? (
          <Text body2 numberOfLines={1}>
            {title}
          </Text>
        ) : (
          <Text body1 numberOfLines={1}>
            {title}
          </Text>
        )}

        {subItem ? (
          <Text
            body2
            medium
            numberOfLines={1}
            style={styles.cartItemSubHeading}>
            {subTitle}
          </Text>
        ) : (
          <Text subhead numberOfLines={1} style={styles.cartItemSubHeading}>
            {subTitle}
          </Text>
        )}

        {rating ? (
          <StarRating
            disabled={true}
            starSize={10}
            maxStars={5}
            rating={rating}
            fullStarColor={BaseColor.yellowColor}
          />
        ) : null}
      </View>

      {!subItem ? (
        <View style={styles.rightSection}>
          <Icon
            name="chevron-right"
            size={20}
            color={colors.primary}
            enableRTL={true}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartContentContainer: {
    alignItems: 'flex-start',
  },
  cartItemSubHeading: {
    marginVertical: 5,
  },
  cartSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  cartSubItemImage: {
    width: 75,
    height: 75,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginRight: 15,
  },
  rightSection: {
    marginLeft: 'auto',
  },
});
