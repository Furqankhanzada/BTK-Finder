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

const nameSchema = Yup.object({
  name: Yup.string().required().min(3),
});

export const NameScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const isEditBusiness = route?.params?.id;

  const { data: businessData } = useBusiness(route?.params?.id);
  const { mutate: editName } = useEditBusiness(route?.params?.id);

  const name = useAddBusinessStore((state: any) => state.name);
  const setName = useAddBusinessStore((state: any) => state.setName);

  const navigateToBack = () => {
    navigation.goBack();
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Edit Business Name' : 'Add Business'}
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
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? null : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <Formik
          initialValues={{ name: isEditBusiness ? businessData?.name : name }}
          validationSchema={nameSchema}
          onSubmit={(values) => {
            if (isEditBusiness) {
              editName({ name: values.name });
              navigation.navigate('EditBusiness', { id: businessData?._id });
            } else {
              setName(values.name);
              navigation.navigate('Description');
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
                          Please write your business name
                        </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="e.g Kababjees"
                          value={values.name}
                          onChangeText={handleChange('name')}
                        />
                        <Text style={{ color: BaseColor.redColor }}>
                          {errors?.name?.toString()}
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
                      values?.name?.length < 3
                        ? { backgroundColor: BaseColor.grayColor }
                        : null,
                    ]}
                    title="submit"
                    onPress={handleSubmit}>
                    {isEditBusiness ? 'Update Name' : 'Next'}
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
