import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const discriptionSchema = Yup.object({
  discription: Yup.string()
    .required('Discribe  your business atleast 10 words')
    .min(10),
});

export const DiscriptionScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const { colors } = useTheme();
  const navigateToBack = () => {
    navigation.goBack();
  };
  const navigateToNext = () => {
    navigation.navigate('Category');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Add Discription"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Formik
        initialValues={{ discription: '' }}
        validationSchema={discriptionSchema}
        onSubmit={(values) => {
          navigation.navigate('Category');
        }}>
        {({ values, handleChange, handleSubmit, errors }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={[1]}
                renderItem={() => {
                  return (
                    <View>
                      <Text title1 bold>
                        Write Discription of your Business
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Add Discription"
                        value={values.discription}
                        onChangeText={handleChange('discription')}
                      />
                      <Text style={{ color: BaseColor.redColor }}>
                        {errors.discription}
                      </Text>
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
                    values.discription.length < 10
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
