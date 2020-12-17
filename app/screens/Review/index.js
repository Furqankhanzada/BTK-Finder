import React, {useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import {BaseStyle, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  RateDetail,
  CommentItem,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useSelector} from "react-redux";
import moment from "moment";

export default function Review({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const stateProps = useSelector(({ businesses }) => {
    return {
      singleBusiness: businesses.singleBusiness,
      getSingleBusinessLoading: businesses.getSingleBusinessLoading,
    };
  });

  const [refreshing] = useState(false);
  const [rateDetail] = useState({
    point: stateProps.singleBusiness.averageRatings,
    maxPoint: 5,
    totalRating: 25,
    data: ['5%', '5%', '35%', '40%', '10%'],
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('reviews')}
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
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('replay')}
            </Text>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          navigation.navigate('Feedback');
        }}
      />
      {/*Users Review List */}
      {stateProps.singleBusiness.reviews.length ? (
          <FlatList
              contentContainerStyle={{padding: 20}}
              refreshControl={
                <RefreshControl
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                    refreshing={refreshing}
                    onRefresh={() => {}}
                />
              }
              data={stateProps.singleBusiness.reviews}
              keyExtractor={(item, index) => item.id}
              ListHeaderComponent={() => (
                  <RateDetail
                      point={rateDetail.point}
                      maxPoint={rateDetail.maxPoint}
                      totalRating={rateDetail.totalRating}
                      data={rateDetail.data}
                  />
              )}
              renderItem={({item}) => (
                  <CommentItem
                      style={{marginTop: 10}}
                      image={item.image}
                      name={item.owner.name}
                      rate={item.rating}
                      date={moment(item.createdAt).format("MMM Do YYYY")}
                      title={item.title}
                      comment={item.description}
                  />
              )}
          />
      ) : (
          <View style={styles.noReviewsAvailable}>
            <Text subhead>
              There are no Reviews in this business yet
            </Text>
          </View>
      )}
    </SafeAreaView>
  );
}
