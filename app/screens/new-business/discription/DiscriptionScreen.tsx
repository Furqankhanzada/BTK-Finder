import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

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

  const description = useAddBusinessStore((state: any) => state.description);
  const setDescription = useAddBusinessStore(
    (state: any) => state.setDescription,
  );

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
        initialValues={{ discription: description }}
        validationSchema={discriptionSchema}
        onSubmit={(values) => {
          navigation.navigate('Category');
          setDescription(values.discription);
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
                        style={styles.inputDiscrip}
                        placeholder="Add Discription"
                        value={values.discription}
                        multiline={true}
                        textAlignVertical="top"
                        onChangeText={handleChange('discription')}
                      />
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
