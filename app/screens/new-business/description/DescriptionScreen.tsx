import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { styles } from '../styles/styles';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { useEditBusiness } from '../queries/mutations';
import useAddBusinessStore from '../store/Store';

const descriptionSchema = Yup.object({
  description: Yup.string().min(10),
});

export const DescriptionScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.id;

  const { data: businessData } = useBusiness(route?.params?.id);
  const { mutate: editDescription } = useEditBusiness(route?.params?.id);

  const description = useAddBusinessStore((state: any) => state.description);
  const setDescription = useAddBusinessStore(
    (state: any) => state.setDescription,
  );

  const navigateToBack = () => {
    navigation.goBack();
  };

  const navigateToNext = () => {
    navigation.navigate('Category');
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Description' : 'Add Description'}
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
        onPressLeft={navigateToBack}
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <Formik
          initialValues={{
            description: isEditBusiness
              ? businessData?.description
              : description,
          }}
          validationSchema={descriptionSchema}
          onSubmit={(values) => {
            if (isEditBusiness) {
              editDescription({ description: values.description });
              navigation.navigate('EditBusiness', { id: businessData?._id });
            } else {
              setDescription(values.description);
              navigation.navigate('Category');
            }
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
                          Write Description of your Business{' '}
                          <Text body1>(optional)</Text>
                        </Text>
                        <TextInput
                          style={styles.inputDescription}
                          placeholder="Add Description"
                          value={values.description}
                          multiline={true}
                          textAlignVertical="top"
                          onChangeText={handleChange('description')}
                        />
                        <Text style={{ color: BaseColor.redColor }}>
                          {errors?.description?.toString()}
                        </Text>
                      </View>
                    );
                  }}
                />

                <View
                  style={
                    isEditBusiness
                      ? styles.stickyFooterEdit
                      : styles.stickyFooter
                  }>
                  {isEditBusiness ? null : (
                    <Button
                      style={styles.footerButtons}
                      onPress={navigateToBack}>
                      {'Back'}
                    </Button>
                  )}

                  <Button
                    style={[
                      styles.footerButtons,
                      errors?.description
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
