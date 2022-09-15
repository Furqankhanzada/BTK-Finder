import React, { useState } from 'react';
import { Formik } from 'formik';
import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { FlatList, SafeAreaView, View } from 'react-native';

import { BaseColor, BaseStyle, useTheme } from '@config';
import { Button, Header, Text, RangeSlider } from '@components';

import { styles } from '../styles/styles';
import { useTranslation } from 'react-i18next';

export const PriceRange = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [priceBegin, setPriceBegin] = useState(0);
  const [priceEnd, setPriceEnd] = useState(100);

  const { t } = useTranslation();
  const { colors } = useTheme();
  const cardColor = colors.card;

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
        initialValues={{ price: '' }}
        onSubmit={(values) => {
          navigation.navigate('Gallery');
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
                          setPriceBegin(low);
                          setPriceEnd(high);
                        }}
                      />
                      <View style={styles.contentResultRange}>
                        <Text style={styles.fontSize}>
                          min - Rs.{priceBegin}{' '}
                        </Text>
                        <Text style={styles.fontSize}>max - Rs.{priceEnd}</Text>
                      </View>
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button
                  style={styles.fotterButtons}
                  onPress={() => navigateToBack()}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.fotterButtons,
                    priceBegin <= 200
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
