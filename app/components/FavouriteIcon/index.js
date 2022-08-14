import React, { useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { BaseColor } from '@config';
import { Icon, Text } from '@components';
import PropTypes from 'prop-types';
import styles from './styles';
import {
  addFavoriteBusiness,
  removeFavoriteBusiness,
} from '../../actions/favorites';
import { trackEvent, EVENTS } from '../../userTracking';

export default function FavouriteIcon(props) {
  const {
    style,
    name,
    isFavorite,
    favoriteId,
    navigation,
    lastRoute,
    routeId,
    showText,
  } = props;
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const [loading, setLoading] = useState(false);

  const stateProps = useSelector(({ favorites }) => {
    return {
      favoriteBusinesses: favorites.getFavoriteBusinesses,
    };
  });

  const afterResponse = () => {
    setLoading(false);
  };

  const navigateToWalktrhough = (lastRoute, id) => {
    navigation.navigate('Walkthrough', { lastRoute, id });
  };

  const onPressFavorite = (id) => {
    if (isLogin) {
      setLoading(true);
      const allFavoriteBusinesses = stateProps.favoriteBusinesses;
      const isFavoriteExist = allFavoriteBusinesses.some(
        (obj) => obj._id === id,
      );
      if (isFavoriteExist) {
        dispatch(removeFavoriteBusiness(id, afterResponse));
        trackEvent(EVENTS.UNFAVORITE_BUTTON_CLICKED, { id, name });
      } else {
        dispatch(addFavoriteBusiness(id, afterResponse));
        trackEvent(EVENTS.FAVORITE_BUTTON_CLICKED, { id, name });
      }
    } else {
      Alert.alert(
        'Login Required',
        'You must login in order to add favorites.',
        [
          {
            text: 'Login',
            onPress: () => navigateToWalktrhough(lastRoute, routeId),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <TouchableOpacity style={style} onPress={() => onPressFavorite(favoriteId)}>
      {loading ? (
        <View style={styles.container}>
          <ActivityIndicator size="small" color={BaseColor.orangeColor} />
          {showText ? <Text style={styles.bottomText}>Loading...</Text> : null}
        </View>
      ) : isFavorite ? (
        <View style={styles.container}>
          <Icon2
            onPress={() => onPressFavorite(favoriteId)}
            name={'heart'}
            color={BaseColor.orangeColor}
            size={20}
          />
          {showText ? (
            <Text style={styles.bottomText}>Remove Favorite</Text>
          ) : null}
        </View>
      ) : (
        <View style={styles.container}>
          <Icon
            onPress={() => onPressFavorite(favoriteId)}
            name={'heart'}
            color={BaseColor.orangeColor}
            size={20}
          />
          {showText ? (
            <Text style={styles.bottomText}>Add Favorite</Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
}

FavouriteIcon.defaultProps = {
  style: {},
  isFavorite: false,
  favoriteId: '',
  showText: false,
};
