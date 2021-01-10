import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BaseStyle } from '@config';
import { Header, SafeAreaView, Icon } from '@components';
import styles from './styles';
import CardList from '../../components/CardList';
import SectionList from '../Home/sectionList';
import { getMyBusinesses } from '../../actions/business';

export default function MyBusinesses(props) {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const stateProps = useSelector(({ businesses }) => {
    return {
      myBusinesses: businesses.myBusinesses,
      getMyBusinessesLoading: businesses.getMyBusinessesLoading,
    };
  });

  useEffect(() => {
    dispatch(
      getMyBusinesses({
        skip: 0,
        fields: 'name, thumbnail, category, averageRatings',
        ownerId: route?.params?.id,
      }),
    );
  }, [route.params.id, dispatch]);

  const navigateBusinessDetail = (id) => {
    navigation.replace('PlaceDetail', { id });
  };
  const navigateToReview = (id) => {
    navigation.navigate('Review', { id });
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });
  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
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
      <ScrollView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <SectionList
          title={t('my_businesses')}
          data={stateProps.myBusinesses}
          loading={stateProps.getMyBusinessesLoading}
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
              />
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
