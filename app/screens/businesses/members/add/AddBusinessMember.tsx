import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';
import { useQueryClient } from '@tanstack/react-query';
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';

import { BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Button,
  TextInput,
  Text,
} from '@components';
import { useAlerts } from '@hooks';

import { CatalogProduct } from 'models/graphql';
import Products from '@screens/businesses/components/Products';
import { useBusiness } from '@screens/businesses/queries/queries';
import { useAddMembership } from '@screens/businesses/queries/mutations';
import { Membership } from '@screens/settings/profile/models/UserPresentable';
import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import { IconName } from '../../../../contexts/alerts-v2/models/Icon';
import GlobalStyle from '../../../../assets/styling/GlobalStyle';
import useMemberStore from '../store/Store';

export default function AddBusinessMember(
  props: StackScreenProps<MembersStackParamList, 'AddMember'>,
) {
  const { navigation, route } = props;
  const { businessId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { showAlert, showNotification } = useAlerts();
  const { data: business } = useBusiness(businessId);
  const { mutateAsync, isLoading } = useAddMembership(businessId);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Membership>();
  const { selectedPackage, setSelectedPackage, resetPackage } =
    useMemberStore();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    resetPackage();
  }, [resetPackage]);

  const onSubmit = async (data: Membership) => {
    mutateAsync(
      { ...data, package: selectedPackage },
      {
        async onSuccess(response) {
          if ('message' in response && response.message === 'invitation-sent') {
            const buttonPressed = await showAlert({
              content: () => (
                <>
                  <IonIcon
                    size={70}
                    name={IconName.CheckMarkCircle}
                    color={BaseColor.greenColor}
                  />
                  <Text textAlign="center" header>
                    Invitation Sent
                  </Text>
                  <Text textAlign="center" body1>
                    We have sent an invitation email to {data.email}
                  </Text>
                  <Text
                    textAlign="center"
                    body1
                    bold
                    style={[{ color: BaseColor.redColor }, styles.noteText]}>
                    NOTE:
                  </Text>
                  <Text textAlign="center" body2>
                    Since no account is registered with this email: {data.email}
                  </Text>
                  <Text textAlign="center" body2>
                    We have sent an email to {data.email} for account
                    registration.
                  </Text>
                  <Text textAlign="center" body2>
                    Once the user registers with this email in our app, He will
                    be automatically added as the member of your business
                  </Text>
                </>
              ),
              btn: {
                confirmBtnTitle: 'Okay',
              },
              type: 'Custom',
            });

            if (buttonPressed === 'confirm') {
              navigation.goBack();
            }
          } else if ('email' in response) {
            await queryClient.invalidateQueries({
              queryKey: ['members', businessId],
            });

            navigation.goBack();
            resetPackage();

            showNotification({
              icon: {
                size: 70,
                name: IconName.CheckMarkCircle,
                color: BaseColor.greenColor,
              },
              message: `The membership for ${response.email} has been added.`,
              dismissAfterMs: 4000,
            });
          }
        },
      },
    );
  };

  const onSelectPackage = (item: CatalogProduct) => {
    if (item?.title) {
      setModalVisible(false);
      setSelectedPackage({
        name: item?.title,
        id: item?._id,
        duration: '',
      });
    }
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header
        title="Add Member"
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
        onPressLeft={() => {
          navigation.goBack();
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onSubmitEditing={() => setModalVisible(true)}
                blurOnSubmit={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.email}
              />
            )}
            name="email"
          />

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              GlobalStyle.datePickerContainer,
              { backgroundColor: colors.card },
            ]}>
            <Text
              style={{
                color: selectedPackage.name ? colors.text : BaseColor.grayColor,
              }}>
              {selectedPackage.name ? selectedPackage.name : 'Select Package'}
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  onPress={() => toggleDatePicker()}
                  style={[
                    GlobalStyle.datePickerContainer,
                    { backgroundColor: colors.card },
                  ]}>
                  <Text
                    style={[
                      GlobalStyle.datePickerContainerText,
                      {
                        color: value ? colors.text : BaseColor.grayColor,
                      },
                    ]}>
                    {value
                      ? moment(value).format('DD/MM/YYYY')
                      : 'Billing Date [DD/MM/YYYY]'}
                  </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={(date) => {
                    onChange(date);
                    toggleDatePicker();
                  }}
                  onCancel={toggleDatePicker}
                />
              </>
            )}
            name="billingDate"
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button full loading={isLoading} onPress={handleSubmit(onSubmit)}>
            Add
          </Button>
        </View>
      </KeyboardAvoidingView>

      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[
            styles.contentFilterBottom,
            { backgroundColor: colors.card },
          ]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>

          <View style={styles.listItemsContainer}>
            <Products
              containerStyle={styles.productsList}
              onProductPress={(item) => onSelectPackage(item)}
              business={business}
              selectionMode={true}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 20,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
  },
  listItemsContainer: {
    paddingVertical: 20,
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  productsList: {
    flex: 0,
    paddingHorizontal: 0,
  },
  textInput: {
    marginTop: 10,
  },
  scrollViewContentContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  buttonContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  noteText: {
    marginTop: 10,
  },
});
