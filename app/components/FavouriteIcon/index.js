import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { BaseColor } from '@config';
import { Icon } from '@components';
import PropTypes from 'prop-types';
import {
  addFavoriteBusiness,
  removeFavoriteBusiness,
} from '../../actions/favorites';

export default function FavouriteIcon(props) {
  const {
    style,
    isFavorite,
    favoriteId,
    navigation,
    lastRoute,
    routeId,
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
      } else {
        dispatch(addFavoriteBusiness(id, afterResponse));
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
    <View style={style}>
      {loading ? (
        <ActivityIndicator size="small" color={BaseColor.orangeColor} />
      ) : isFavorite ? (
        <Icon2
          onPress={() => onPressFavorite(favoriteId)}
          name={'heart'}
          color={BaseColor.orangeColor}
          size={20}
        />
      ) : (
        <Icon
          onPress={() => onPressFavorite(favoriteId)}
          name={'heart'}
          color={BaseColor.orangeColor}
          size={20}
        />
      )}
    </View>
  );
}

FavouriteIcon.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isFavorite: PropTypes.bool,
  favoriteId: PropTypes.string,
};

FavouriteIcon.defaultProps = {
  style: {},
  isFavorite: false,
  favoriteId: '',
};
