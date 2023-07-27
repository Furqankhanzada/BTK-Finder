import React from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, View } from 'react-native';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

import useAuthStore from '@screens/auth/store/Store';
import { BaseColor } from '@config';
import { Icon, Text } from '@components';
import {
  FavoriteType,
  useToggleFavorite,
} from '@screens/businesses/queries/mutations';

import styles from './styles';
import { trackEvent, EVENTS } from '../../userTracking';

export default function FavouriteIcon(props) {
  const { style, name, isFavorite, favoriteId, showText } = props;
  const navigation = useNavigation();
  const { mutate, isLoading } = useToggleFavorite();
  const isLogin = useAuthStore((state) => state.isLogin);

  const navigateToLogin = () => {
    navigation.navigate('AuthStackNavigator', {
      screen: 'WelcomeAuth',
      params: { shouldGoBack: true },
    });
  };

  const onPressFavorite = (id) => {
    if (isLogin) {
      if (!isFavorite) {
        mutate({ businessId: id, type: FavoriteType.favorite });
        trackEvent(EVENTS.UNFAVORITE_BUTTON_CLICKED, { id, name });
      } else {
        mutate({ businessId: id, type: FavoriteType.unFavorite });
        trackEvent(EVENTS.FAVORITE_BUTTON_CLICKED, { id, name });
      }
    } else {
      Alert.alert(
        'Login Required',
        'You must login in order to add favorites.',
        [
          {
            text: 'Login',
            onPress: () => navigateToLogin(),
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
      {isLoading ? (
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
