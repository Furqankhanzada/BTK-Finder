import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { FlatList, SafeAreaView, View } from 'react-native';

import { BaseColor, BaseStyle, useTheme } from '@config';
import { Button, Header, Text, RangeSlider, Icon } from '@components';
import useAddBusinessStore from '../store/Store';

import { styles } from '../styles/styles';
import { useBusiness } from '@screens/businesses/queries/queries';
import { useEditBusiness } from '../queries/mutations';

export const PriceRange = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const { colors } = useTheme();

  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(1000);

  const priceRange = useAddBusinessStore((state: any) => state.priceRange);
  const setPriceRange = useAddBusinessStore(
    (state: any) => state.setPriceRange,
  );
  const { mutate: EditPrice } = useEditBusiness(route?.params?.id);
  const { data: businessData } = useBusiness(route?.params?.id);

  const isEditBusiness = route?.params?.id;

  const navigateToBack = () => {
    navigation.goBack();
  };
  const navigateToNext = () => {
    navigation.navigate('Gallery');
  };

  useEffect(() => {
    if (isEditBusiness && businessData?.priceRange) {
      setFrom(Number(businessData?.priceRange?.from));
      setTo(Number(businessData?.priceRange?.to));
    }
  }, [
    businessData?.priceRange?.from,
    businessData?.priceRange?.to,
    isEditBusiness,
  ]);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Price Range' : 'Price Range'}
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
        renderLeft={() => {
          return isEditBusiness ? (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          ) : null;
        }}
        onPressLeft={() => {
          navigation.navigate('EditBusiness', { id: businessData?._id });
        }}
      />
      <Formik
        initialValues={{ price: priceRange }}
        onSubmit={(values) => {
          isEditBusiness
            ? navigation.navigate('EditBusiness', { id: businessData?._id })
            : navigation.navigate('Gallery');
          EditPrice({
            priceRange: { from: from.toString(), to: to.toString() },
          });
          setPriceRange({ from, to });
        }}>
        {({ values, handleSubmit }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={[1]}
                renderItem={() => {
                  return (
                    <View style={styles.contain}>
                      <View style={styles.title}>
                        <Text title1 bold style={{ paddingBottom: 30 }}>
                          What is Price Range of your Business
                        </Text>
                      </View>
                      <RangeSlider
                        low={from}
                        high={to}
                        color={colors.border}
                        style={styles.rangeSlider}
                        selectionColor={colors.primary}
                        onValueChanged={(low, high) => {
                          setFrom(low);
                          setTo(high);
                        }}
                      />
                      <View style={styles.contentResultRange}>
                        <Text style={styles.fontSize}>min - Rs. {from}</Text>
                        <Text style={styles.fontSize}>max - Rs.{to}</Text>
                      </View>
                    </View>
                  );
                }}
              />

              <View
                style={
                  isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter
                }>
                {isEditBusiness ? null : (
                  <Button style={styles.footerButtons} onPress={navigateToBack}>
                    {'Back'}
                  </Button>
                )}

                <Button
                  style={[
                    styles.footerButtons,
                    from <= 200
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {isEditBusiness ? 'Update Price' : 'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
