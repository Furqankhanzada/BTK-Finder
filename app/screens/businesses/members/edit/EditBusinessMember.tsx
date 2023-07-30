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
import Modal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { BaseColor, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Button, Text } from '@components';
import { useAlerts } from '@hooks';

import {
  UpdateMembershipPayload,
  useMembershipUpdate,
} from '@screens/businesses/queries/mutations';
import { MembershipStatus } from '@screens/settings/profile/models/UserPresentable';
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
  const { showNotification } = useAlerts();
  const { mutateAsync, isLoading } = useMembershipUpdate(businessId);
  const { selectedPackage, setSelectedPackage, resetPackage } =
    useMemberStore();

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const statusItems = [
    { label: 'Active', value: MembershipStatus.ACTIVE },
    { label: 'Archive', value: MembershipStatus.ARCHIVE },
  ];

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
          resetPackage();
        }
      },
    });
  };

  const onPressStatus = (status: MembershipStatus) => {
    setSelectedStatus(status);
    setModalVisible(false);
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
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={[
              GlobalStyle.datePickerContainer,
              { backgroundColor: colors.card },
            ]}>
            <Text
              style={[
                styles.statusText,
                {
                  color: selectedStatus ? colors.text : BaseColor.grayColor,
                },
              ]}>
              {selectedStatus ? selectedStatus : 'Status'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigateToPackageSelect}
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
          <Button full loading={isLoading} onPress={onSubmit}>
            Update
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
            {statusItems.map((item) => {
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => onPressStatus(item.value)}
                  style={[
                    styles.listItem,
                    selectedStatus === item.value && {
                      backgroundColor: colors.primaryDark,
                    },
                  ]}>
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
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
  listItem: {
    padding: 10,
    borderRadius: 10,
  },
  statusText: {
    textTransform: 'capitalize',
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
  alertDescription: {
    marginTop: 24,
  },
});
