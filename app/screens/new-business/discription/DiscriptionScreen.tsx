import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { StackScreenProps } from '@react-navigation/stack';
import { useBusiness } from '@screens/businesses/queries/queries';
import { BaseColor, BaseStyle, useTheme } from '@config';

import useAddBusinessStore from '../store/Store';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';

const discriptionSchema = Yup.object({
  discription: Yup.string()
    .required('Discribe  your business atleast 10 words')
    .min(10),
});

export const DiscriptionScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const { colors } = useTheme();
  const navigateToBack = () => {
    navigation.goBack();
  };
  const { data: businessData } = useBusiness(route?.params?.id);
  const description = useAddBusinessStore((state: any) => state.description);
  const setDescription = useAddBusinessStore(
    (state: any) => state.setDescription,
  );
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

  console.log('What is Navigation Data', route.params);

  const navigateToNext = () => {
    navigation.navigate('Category');
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Discription' : 'Add Discription'}
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
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Formik
        initialValues={{
          discription: isEditBusiness ? businessData?.description : description,
        }}
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
                    values?.discription?.length < 10
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {isEditBusiness ? 'Update Description' : 'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
