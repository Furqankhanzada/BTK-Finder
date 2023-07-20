import React, { useRef, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput as TextInputOriginal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { StackScreenProps } from '@react-navigation/stack';
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

import { Membership } from '@screens/businesses/models/BusinessPresentable';
import {
  useDeleteMembership,
  useMembershipUpdate,
} from '@screens/businesses/queries/mutations';
import { IconName } from '../../../../contexts/alerts-v2/models/Icon';
import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import GlobalStyle from '../../../../assets/styling/GlobalStyle';

export default function EditBusinessMember(
  props: StackScreenProps<MembersStackParamList, 'EditMember'>,
) {
  const { navigation, route } = props;
  const { businessId, membership } = route.params;
  const { colors } = useTheme();
  const { showAlert, showNotification } = useAlerts();
  const { mutateAsync, isLoading } = useMembershipUpdate(businessId);
  const { mutateAsync: removeMember, isLoading: isRemoveLoading } =
    useDeleteMembership();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Membership>({
    defaultValues: { ...membership },
  });

  const packageRef = useRef<TextInputOriginal>(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const onSubmit = async (data: Membership) => {
    mutateAsync(data, {
      onSuccess(response) {
        if (response.email) {
          showNotification({
            icon: {
              size: 70,
              name: IconName.CheckMarkCircle,
              color: BaseColor.greenColor,
            },
            message: `The membership for ${response.email} has been updated.`,
            dismissAfterMs: 4000,
          });
          navigation.goBack();
        }
      },
    });
  };

  const onPressDelete = async () => {
    const buttonPressed = await showAlert({
      content: () => (
        <>
          <IonIcon
            size={70}
            name={IconName.Warning}
            color={BaseColor.redColor}
          />
          <Text textAlign="center" header>
            Member Removal
          </Text>
          <Text textAlign="center" body1>
            Are you sure you want to remove this member from your business?
          </Text>
          <Text textAlign="center" body1>
            The membership will be deleted.
          </Text>
        </>
      ),
      btn: {
        confirmDestructive: true,
        confirmBtnTitle: 'Delete',
        cancelBtnTitle: 'Cancel',
      },
      type: 'Custom',
    });

    if (buttonPressed === 'confirm') {
      removeMember(
        { id: businessId, email: membership.email },
        {
          onSuccess(response) {
            if (response.message === 'success') {
              showNotification({
                icon: {
                  size: 70,
                  name: IconName.CheckMarkCircle,
                  color: BaseColor.greenColor,
                },
                message:
                  'Member has been removed successfully from your business.',
                dismissAfterMs: 4000,
              });
              navigation.goBack();
            }
          },
        },
      );
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
        title="Edit Member"
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
                placeholder="Active or Archieve"
                onSubmitEditing={() => packageRef.current?.focus()}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.status}
              />
            )}
            name="status"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                ref={packageRef}
                placeholder="Package name"
                onSubmitEditing={toggleDatePicker}
                blurOnSubmit={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.package}
              />
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
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.deleteButton}
            destructive
            full
            loading={isRemoveLoading}
            onPress={onPressDelete}>
            Delete
          </Button>
          <Button full loading={isLoading} onPress={handleSubmit(onSubmit)}>
            Update
          </Button>
        </View>
      </KeyboardAvoidingView>
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
  deleteButton: {
    marginBottom: 20,
  },
  alertDescription: {
    marginTop: 24,
  },
});
