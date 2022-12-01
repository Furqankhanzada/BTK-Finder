import React from 'react';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { useBusiness } from '@screens/businesses/queries/queries';

const webRejex =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

const webSchema = Yup.object({
  website: Yup.string()
    .matches(webRejex, 'Please enter url ex: https://abc.com')
    .required('ex: https://abc.com'),
});

export const WebsiteScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const { colors } = useTheme();

  const { data: businessData } = useBusiness(route?.params?.id);
  const website = useAddBusinessStore((state: any) => state.website);
  const setWebsite = useAddBusinessStore((state: any) => state.setWebsite);
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

  const navigateToNext = () => {
    navigation.navigate('Established');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Update Website' : 'Business Website '}
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
          navigation.goBack();
        }}
      />
      <Formik
        initialValues={{
          website: isEditBusiness ? businessData?.website : website,
        }}
        validationSchema={webSchema}
        onSubmit={(values) => {
          navigation.navigate('Established');
          setWebsite(values.website);
        }}>
        {({ values, handleChange, handleSubmit }) => {
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
                        What is the official website of your Business ?
                      </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Website"
                        value={String(values.website)}
                        onChangeText={handleChange('website')}
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
                    values.website.length < 8
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {isEditBusiness ? 'Update Website' : 'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
