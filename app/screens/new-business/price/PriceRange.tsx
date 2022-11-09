import React, { useState } from 'react';
import { Formik } from 'formik';
import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { FlatList, SafeAreaView, View } from 'react-native';

import { BaseColor, BaseStyle, useTheme } from '@config';
import { Button, Header, Text, RangeSlider } from '@components';
import useAddBusinessStore from '../store/Store';

import { styles } from '../styles/styles';

export const PriceRange = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [from, setFrom] = useState<string>(String(0));
  const [to, setTo] = useState<string>(String(100));

  const priceRange = useAddBusinessStore((state: any) => state.priceRange);
  const setPriceRange = useAddBusinessStore(
    (state: any) => state.setPriceRange,
  );

  const { colors } = useTheme();

  const navigateToBack = () => {
    navigation.goBack();
  };
  const navigateToNext = () => {
    navigation.navigate('Gallery');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Price Range"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Formik
        initialValues={{ price: priceRange }}
        onSubmit={(values) => {
          navigation.navigate('Gallery');
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

              <View style={styles.stickyFooter}>
                <Button
                  style={styles.footerButtons}
                  onPress={() => navigateToBack()}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.footerButtons,
                    from <= 200
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
