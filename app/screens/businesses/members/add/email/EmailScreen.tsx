import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';
import { BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Button,
  TextInput,
  Text,
} from '@components';
import { Membership } from '@screens/settings/profile/models/UserPresentable';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';

export default function EmailScreen(
  props: StackScreenProps<AddMembersParamList, 'Email'>,
) {
  const { navigation } = props;
  const businessId = '6401d1445d381e3bcd4b47e7';
  // console.log(businessId);

  const { colors } = useTheme();
  // const queryClient = useQueryClient();
  // const { showAlert, showNotification } = useAlerts();
  // const { data: business } = useBusiness(businessId);
  // const { mutateAsync, isLoading } = useAddMembership(businessId);
  const {
    control,
    formState: { errors },
  } = useForm<Membership>();
  // const { package: packageValue } = getValues();
  // const { setSelectedPackage, selectedPackage, resetPackage } =
  //   useMemberStore();

  // const [modalVisible, setModalVisible] = useState<boolean>(false);
  // const [isDatePickerVisible, setDatePickerVisibility] =
  //   useState<boolean>(false);

  // useEffect(() => {
  //   if (selectedPackage) {
  //     const unsubscribe = navigation.addListener('beforeRemove', () => {
  //       // Delay the reset to avoid flickering
  //       setTimeout(() => {
  //         resetPackage();
  //       }, 300);
  //     });

  //     return () => {
  //       unsubscribe();
  //     };
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [navigation]);

  // const onSubmit = async (data: Membership) => {
  //   mutateAsync(data, {
  //     async onSuccess(response) {
  //       if ('message' in response && response.message === 'invitation-sent') {
  //         const buttonPressed = await showAlert({
  //           content: () => (
  //             <>
  //               <IonIcon
  //                 size={70}
  //                 name={IconName.CheckMarkCircle}
  //                 color={BaseColor.greenColor}
  //               />
  //               <Text textAlign="center" header>
  //                 Invitation Sent
  //               </Text>
  //               <Text textAlign="center" body1>
  //                 We have sent an invitation email to {data.email}
  //               </Text>
  //               <Text
  //                 textAlign="center"
  //                 body1
  //                 bold
  //                 style={[{ color: BaseColor.redColor }, styles.noteText]}>
  //                 NOTE:
  //               </Text>
  //               <Text textAlign="center" body2>
  //                 Since no account is registered with this email: {data.email}
  //               </Text>
  //               <Text textAlign="center" body2>
  //                 We have sent an email to {data.email} for account
  //                 registration.
  //               </Text>
  //               <Text textAlign="center" body2>
  //                 Once the user registers with this email in our app, He will be
  //                 automatically added as the member of your business
  //               </Text>
  //             </>
  //           ),
  //           btn: {
  //             confirmBtnTitle: 'Okay',
  //           },
  //           type: 'Custom',
  //         });

  //         if (buttonPressed === 'confirm') {
  //           navigation.goBack();
  //         }
  //       } else if ('email' in response) {
  //         await queryClient.invalidateQueries({
  //           queryKey: ['members', businessId],
  //         });

  //         navigation.goBack();

  //         showNotification({
  //           icon: {
  //             size: 70,
  //             name: IconName.CheckMarkCircle,
  //             color: BaseColor.greenColor,
  //           },
  //           message: `The membership for ${response.email} has been added.`,
  //           dismissAfterMs: 4000,
  //         });
  //       }
  //     },
  //   });
  // };

  // const onSelectPackage = (item: CatalogProduct) => {
  //   if (item?.title) {
  //     const payload = {
  //       name: item?.title,
  //       id: item?._id,
  //       duration: '',
  //     };
  //     setSelectedPackage(payload);
  //     setValue('package', payload);
  //   }
  // };

  // const onSelectTag = (duration: string, item: CatalogProduct) => {
  //   if (item?.title) {
  //     const payload = {
  //       name: item?.title,
  //       id: item?._id,
  //       duration: duration,
  //     };
  //     setModalVisible(false);
  //     setSelectedPackage(payload);
  //     setValue('package', payload);
  //   }
  // };

  // const toggleDatePicker = () => {
  //   setDatePickerVisibility(!isDatePickerVisible);
  // };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header
        title="Email Address"
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
              <View>
                <Text title1 bold>
                  What is the valid Email address of your Membership ?{' '}
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  // onSubmitEditing={() => setModalVisible(true)}
                  blurOnSubmit={true}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  success={!errors.email}
                />
              </View>
            )}
            name="email"
          />

          {/* <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { value } }) => (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={[
                  GlobalStyle.datePickerContainer,
                  { backgroundColor: colors.card },
                ]}>
                <Text
                  style={{
                    color: value?.name ? colors.text : BaseColor.grayColor,
                  }}>
                  {value?.name ? value.name : 'Select Package'}
                </Text>
                {value?.duration ? (
                  <Text caption1 style={{ color: colors.text }}>
                    ({value?.duration})
                  </Text>
                ) : null}
              </TouchableOpacity>
            )}
            name="package"
          />
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
          /> */}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            // onPress={()=> navigation.navigate('Pakages')}
            onPress={() =>
              navigation.navigate('Pakages', {
                businessId: businessId,
              })
            }>
            Next
          </Button>
        </View>
      </KeyboardAvoidingView>

      {/* <Modal
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
            {!packageValue?.name ? (
              <Text caption1 style={{ color: BaseColor.redColor }}>
                Please select a package
              </Text>
            ) : null}
            {packageValue?.name && !packageValue?.duration ? (
              <Text caption1 style={{ color: BaseColor.redColor }}>
                Please select duration
              </Text>
            ) : null}
            <Products
              containerStyle={styles.productsList}
              onProductPress={(item) => onSelectPackage(item)}
              onPressTag={(option, item) => onSelectTag(option, item)}
              business={business}
              selectionMode={true}
            />
          </View>
        </View>
      </Modal> */}
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
