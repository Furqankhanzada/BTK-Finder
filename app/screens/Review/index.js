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
  Loading,
} from '@components';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {getSingleBusiness} from "../../actions/business";

export default function Review({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
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

  const isLogin = useSelector((state) => state.auth.isLogin);
  const navigateToFeedback = (id) => {
    navigation.navigate('Feedback', {id})
  };

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
              <View style={{
                backgroundColor: colors.primary,
                padding: 5,
                borderRadius: 5,
                display: 'flex',
                flexDirection: 'row',
              }}>
                <Icon
                    name="plus"
                    size={12}
                    color='white'
                    enableRTL={true}
                />
                <Text numberOfLines={1} style={{color: 'white', fontSize: 12, marginLeft: 5}}>
                  Add
                </Text>
              </View>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {isLogin ? navigateToFeedback(stateProps.singleBusiness._id) : alert('You must login in order to add a review.', ' OK')} }
      />
      {stateProps.getSingleBusinessLoading ?
          <Loading loading={true} />
          : (
              stateProps.singleBusiness.reviews?.length ? (
                    <FlatList
                        contentContainerStyle={{padding: 20}}
                        refreshControl={
                          <RefreshControl
                              colors={[colors.primary]}
                              tintColor={colors.primary}
                              refreshing={refreshing}
                              onRefresh={() => {dispatch(getSingleBusiness(stateProps?.singleBusiness?._id));}}
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
                )
          )}
      {/*Users Review List */}
    </SafeAreaView>
  );
}
