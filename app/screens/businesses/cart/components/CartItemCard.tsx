import React from 'react';
import { StyleSheet, View } from 'react-native';
import NumberFormat from 'react-number-format';

import { Icon, Text, Image, StarRating, Tag } from '@components';
import { BaseColor, useTheme, Images } from '@config';
import QuantityButton from '@screens/businesses/components/QuantityButton';

interface Props {
  image?: string;
  title: string;
  subTitle: string;
  rating?: number;
  subItem?: boolean;
  quantity?: number;
  onPressAdd?: () => void;
  onPressRemove?: () => void;
}

export default function CartItemCard(props: Props) {
  const { colors } = useTheme();

  const {
    image,
    title,
    subTitle,
    rating,
    subItem,
    quantity,
    onPressAdd,
    onPressRemove,
  } = props;

  return (
    <View
      style={[
        subItem ? styles.cartSubItem : styles.cartItem,
        {
          borderColor: colors.card,
          backgroundColor: colors.background,
        },
      ]}>
      <Image
        source={image ?? Images.imagePlaceholder}
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
          <View style={styles.ratingContainer}>
            <Tag rate>
              <NumberFormat
                value={rating ?? '0.0'}
                displayType={'text'}
                decimalScale={1}
                fixedDecimalScale={true}
                renderText={(value) => (
                  <Text caption2 whiteColor semibold>
                    {value}
                  </Text>
                )}
              />
            </Tag>
            <StarRating
              disabled={true}
              starSize={12}
              maxStars={5}
              rating={rating}
              fullStarColor={BaseColor.yellowColor}
              containerStyle={styles.starRating}
            />
          </View>
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
      ) : (
        <View style={styles.rightSection}>
          <QuantityButton
            small
            onPressAdd={() => onPressAdd ?? {}}
            onPressRemove={() => onPressRemove ?? {}}
            quantity={quantity ?? 0}
          />
        </View>
      )}
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
    width: 85,
    height: 85,
    borderRadius: 10,
    marginRight: 15,
  },
  cartContentContainer: {
    alignItems: 'flex-start',
  },
  cartItemSubHeading: {
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  starRating: {
    marginLeft: 5,
  },
  cartSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 75,
  },
});
