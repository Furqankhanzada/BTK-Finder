import React, { useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import IonIcon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';

import { BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button, Text } from '@components';
import { useAlerts } from '@hooks';

import {
  UpdateMembershipPayload,
  useDeleteMembership,
  useMembershipUpdate,
} from '@screens/businesses/queries/mutations';
import { MembershipStatus } from '@screens/businesses/models/BusinessPresentable';
import { IconName } from '../../../../contexts/alerts-v2/models/Icon';
import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import GlobalStyle from '../../../../assets/styling/GlobalStyle';
import useMemberStore from '../store/Store';

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
  const { selectedPackage, setSelectedPackage } = useMemberStore();

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [statusItems, setItems] = useState([
    { label: 'Active', value: MembershipStatus.ACTIVE },
    { label: 'Archieve', value: MembershipStatus.ARCHIEVE },
  ]);

  const [selectedStatus, setSelectedStatus] = useState<MembershipStatus>(
    membership.status,
  );
  const [date, setDate] = useState<Date>(membership.billingDate);

  const navigateToPackageSelect = () => {
    navigation.navigate('PackageSelect', { businessId });
  };

  useEffect(() => {
    setSelectedPackage(membership.package);
  }, [membership.package, setSelectedPackage]);

  const onSubmit = async () => {
    const data: UpdateMembershipPayload = {
      status: selectedStatus,
      package: selectedPackage,
      billingDate: date,
      email: membership.email,
    };

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
          setSelectedPackage('');
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
          <DropDownPicker
            open={openDropdown}
            value={selectedStatus}
            items={statusItems}
            setOpen={setOpenDropdown}
            setValue={setSelectedStatus}
            setItems={setItems}
            placeholder="Status"
            style={[styles.dropdown, { backgroundColor: BaseColor.fieldColor }]}
            dropDownContainerStyle={{ borderColor: colors.border }}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
          />

          <TouchableOpacity
            onPress={navigateToPackageSelect}
            style={[
              GlobalStyle.datePickerContainer,
              { backgroundColor: colors.card },
            ]}>
            <Text
              style={{
                color: selectedPackage ? colors.text : BaseColor.grayColor,
              }}>
              {selectedPackage ? selectedPackage : 'Select Package'}
            </Text>
          </TouchableOpacity>

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
                    color: date ? colors.text : BaseColor.grayColor,
                  },
                ]}>
                {date
                  ? moment(date).format('DD/MM/YYYY')
                  : 'Billing Date [DD/MM/YYYY]'}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(selectedDate) => {
                setDate(selectedDate);
                toggleDatePicker();
              }}
              onCancel={toggleDatePicker}
            />
          </>
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
          <Button full loading={isLoading} onPress={onSubmit}>
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
  dropdown: {
    borderWidth: 0,
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
