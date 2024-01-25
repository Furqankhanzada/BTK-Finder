import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { Tag as TagType } from 'models/graphql';
import { BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Button,
  TextInput,
  Text,
  Tag,
} from '@components';
import { useAlerts } from '@hooks';

import {
  useBusiness,
  useProductsByTag,
  useTags,
} from '@screens/businesses/queries/queries';
import {
  useMembershipAdd,
  useMembershipUpdate,
} from '@screens/businesses/queries/mutations';
import {
  Membership,
  MembershipStatus,
} from '@screens/settings/profile/models/UserPresentable';
import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import SuccessAlertContent from '@screens/businesses/members/add/components/SuccessAlertContent';
import ListModal, {
  Item,
} from '@screens/businesses/members/add/components/ListModal';

import { IconName } from '../../../../contexts/alerts-v2/models/Icon';
import GlobalStyle from '../../../../assets/styling/GlobalStyle';

export default function AddOrEditMember(
  props: StackScreenProps<MembersStackParamList, 'AddOrEditMember'>,
) {
  const { navigation, route } = props;
  const { businessId, membership } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { showAlert, showNotification } = useAlerts();

  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [selectedPackage, setSelectedPackage] = useState<Item | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<Item | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<Item | undefined>();
  const [packagesVisible, setPackagesVisible] = useState<boolean>(false);
  const [durationsVisible, setDurationsVisible] = useState<boolean>(false);
  const [statusVisible, setStatusVisible] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const loaded = useRef(false);

  const { data: business } = useBusiness(businessId);
  //Tags
  const { data: tags } = useTags(business?.shop?.shopId);
  // Products
  const { data: products } = useProductsByTag(
    business?.shop?.shopId,
    selectedTag?._id,
  );

  const { mutateAsync: addMember, isLoading: memberAdding } =
    useMembershipAdd(businessId);
  const { mutateAsync: updateMember, isLoading: memberUpdating } =
    useMembershipUpdate(businessId);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<Membership>();

  const packages = useMemo(() => {
    if (products) {
      return products.map((product) => {
        return {
          id: product._id,
          title: `${product.title} \n${product.pricing.map(
            (p) => p?.displayPrice,
          )}`,
        };
      });
    }
    return [];
  }, [products]);

  const durations = useMemo(() => {
    const variants: Item[] = [];
    if (!selectedPackage) {
      return variants;
    }
    const selectedProduct = products?.find(
      (product) => product._id === selectedPackage.id,
    );
    selectedProduct?.variants?.forEach((variant) => {
      if (!variant) {
        return;
      }
      variants.push({
        id: variant._id,
        title: `${variant.title} \n${variant.pricing.map(
          (p) => p?.displayPrice,
        )}`,
      });
    });
    return variants;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPackage]);

  const onSubmit = async (data: Membership) => {
    const mutate = membership ? updateMember : addMember;
    await mutate(data, {
      async onSuccess(response) {
        if ('message' in response && response.message === 'invitation-sent') {
          const buttonPressed = await showAlert({
            content: () => <SuccessAlertContent email={data.email} />,
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

          showNotification({
            icon: {
              size: 70,
              name: IconName.CheckMarkCircle,
              color: BaseColor.greenColor,
            },
            message: `The membership for ${response.email} has been ${
              membership ? 'updated' : 'added'
            }.`,
            dismissAfterMs: 4000,
          });
        }
      },
    });
  };

  const onTagPress = (tag: TagType) => {
    if (tag._id === selectedTag?._id) {
      return;
    }
    setSelectedTag(tag);
    setSelectedPackage(undefined);
    setSelectedDuration(undefined);
    setValue('package', { id: '', name: '', duration: '', amount: 0 });
  };

  const onSelectPackage = (item: Item) => {
    setSelectedPackage(item);
    const selectedProduct = products?.find(
      (product) => product._id === item.id,
    );
    if (selectedProduct) {
      const { _id: id, title } = selectedProduct;
      setValue('package', {
        id,
        name: title!,
        duration: '',
        amount: 0,
      });
    }
    setPackagesVisible(false);
  };

  const onSelectDuration = (item: Item) => {
    setSelectedDuration(item);
    const selectedProduct = products?.find(
      (product) => product._id === selectedPackage?.id,
    );
    if (selectedProduct) {
      const selectedVariant = selectedProduct.variants?.find((variant) => {
        return variant?._id === item.id;
      });
      const amount = selectedVariant?.pricing.map((p) => p?.price)[0]!;
      const displayAmount = selectedVariant?.pricing.map(
        (p) => p?.displayPrice,
      )[0]!;
      setValue('package', {
        ...getValues('package'),
        duration: `${selectedVariant?.optionTitle} ${displayAmount}`,
        amount,
        id: `${selectedTag?._id}+${selectedProduct._id}+${selectedVariant?._id}`, // So we can remember which variant user selected.
      });
    }
    setDurationsVisible(false);
  };

  const statuses = Object.values(MembershipStatus).map((key) => ({
    id: key,
    title: key,
  }));
  const onSelectStatus = (item: Item) => {
    setSelectedStatus(item);
    const selectedS = statuses?.find((status) => status.id === item?.id);
    if (selectedS) {
      setValue('status', selectedS.id);
    }
    setStatusVisible(false);
  };

  const toggleDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  useEffect(() => {
    if (membership) {
      // ID is equal to: tagId + productId + variantId
      const [tagId] = membership.package.id.split('+');

      const tag = tags?.find((t) => t._id === tagId);
      setSelectedTag(tag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags]);

  useEffect(() => {
    if (membership && !loaded.current) {
      // ID is equal to: tagId + productId + variantId
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, productId] = membership.package.id.split('+');

      const sPackage = packages?.find((p) => p.id === productId);
      setSelectedPackage(sPackage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packages]);

  useEffect(() => {
    // ID is equal to: tagId + productId + variantId
    if (membership && packages.length && !loaded.current) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [tagId, productId, variantId] = membership.package.id.split('+');

      setValue('status', membership.status);
      setValue('email', membership.email);
      setValue('startedAt', membership.startedAt);
      setValue('package', membership.package);

      const duration = durations?.find((d) => d.id === variantId);
      setSelectedDuration(duration);
      loaded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durations]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header
        title={membership ? 'Update Member' : 'Add Member'}
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
          {membership && (
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { value } }) => (
                <TouchableOpacity
                  onPress={() => setStatusVisible(true)}
                  style={[
                    GlobalStyle.datePickerContainer,
                    { backgroundColor: colors.card },
                  ]}>
                  <Text
                    style={{
                      color: value ? colors.text : BaseColor.grayColor,
                    }}>
                    {value ? value : 'Change Status'}
                  </Text>
                </TouchableOpacity>
              )}
              name="status"
            />
          )}
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
                onSubmitEditing={() => setPackagesVisible(true)}
                blurOnSubmit={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.email}
              />
            )}
            name="email"
          />
          <View style={[styles.textInput, styles.tags]}>
            {tags?.map((tag) => (
              <Tag
                key={tag._id}
                rate
                onPress={() => onTagPress(tag)}
                style={[
                  selectedTag?._id === tag._id
                    ? {
                        backgroundColor: colors.primaryDark,
                      }
                    : { backgroundColor: colors.primary },
                ]}>
                {tag.displayTitle}
              </Tag>
            ))}
          </View>
          {selectedTag && (
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { value } }) => (
                <TouchableOpacity
                  onPress={() => setPackagesVisible(true)}
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
                </TouchableOpacity>
              )}
              name="package"
            />
          )}
          {selectedPackage && (
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { value } }) => (
                <TouchableOpacity
                  onPress={() => setDurationsVisible(true)}
                  style={[
                    GlobalStyle.datePickerContainer,
                    { backgroundColor: colors.card },
                  ]}>
                  <Text
                    style={{
                      color: value?.duration
                        ? colors.text
                        : BaseColor.grayColor,
                    }}>
                    {value?.duration ? value.duration : 'Select Duration'}
                  </Text>
                </TouchableOpacity>
              )}
              name="package"
            />
          )}

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
            name="startedAt"
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            full
            loading={memberAdding || memberUpdating}
            onPress={handleSubmit(onSubmit)}>
            {membership ? 'Update Member' : 'Add Member'}
          </Button>
        </View>
      </KeyboardAvoidingView>
      <ListModal
        title="Select Package"
        visible={packagesVisible}
        items={packages}
        selectedItem={selectedPackage}
        onPress={onSelectPackage}
        onRequestClose={() => setPackagesVisible(false)}
        onClosePress={() => setPackagesVisible(false)}
      />
      <ListModal
        title="Select Duration"
        visible={durationsVisible}
        items={durations}
        selectedItem={selectedDuration}
        onPress={onSelectDuration}
        onRequestClose={() => setDurationsVisible(false)}
        onClosePress={() => setDurationsVisible(false)}
      />
      <ListModal
        title="Select Status"
        visible={statusVisible}
        items={statuses}
        selectedItem={selectedStatus}
        onPress={onSelectStatus}
        onRequestClose={() => setStatusVisible(false)}
        onClosePress={() => setStatusVisible(false)}
      />
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
    flex: 1,
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
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
  tags: { flexDirection: 'row', justifyContent: 'space-between' },
});
