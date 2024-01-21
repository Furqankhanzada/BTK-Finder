import React, { useMemo, useState } from 'react';
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
import { useAddMembership } from '@screens/businesses/queries/mutations';
import { Membership } from '@screens/settings/profile/models/UserPresentable';
import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import ListModal, {
  Item,
} from '@screens/businesses/members/add/components/ListModal';

import { IconName } from '../../../../contexts/alerts-v2/models/Icon';
import GlobalStyle from '../../../../assets/styling/GlobalStyle';
import SuccessAlertContent from '@screens/businesses/members/add/components/SuccessAlertContent';

export default function AddBusinessMember(
  props: StackScreenProps<MembersStackParamList, 'AddMember'>,
) {
  const { navigation, route } = props;
  const { businessId } = route.params;
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { showAlert, showNotification } = useAlerts();

  const [selectedTag, setSelectedTag] = useState<TagType>();
  const [selectedPackage, setSelectedPackage] = useState<Item | undefined>();
  const [selectedDuration, setSelectedDuration] = useState<Item | undefined>();
  const [packagesVisible, setPackagesVisible] = useState<boolean>(false);
  const [durationsVisible, setDurationsVisible] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const { data: business } = useBusiness(businessId);
  //Tags
  const { data: tags } = useTags(business?.shop?.shopId);
  // Products
  const { data: products } = useProductsByTag(
    business?.shop?.shopId,
    selectedTag?._id,
  );

  const { mutateAsync, isLoading } = useAddMembership(businessId);
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
    mutateAsync(data, {
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
            message: `The membership for ${response.email} has been added.`,
            dismissAfterMs: 4000,
          });
        }
      },
    });
  };

  const onTagPress = (tag: TagType) => {
    setSelectedTag(tag);
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
      });
    }
    setDurationsVisible(false);
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
          <View
            style={[
              styles.textInput,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}>
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
            name="billingDate"
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button full loading={isLoading} onPress={handleSubmit(onSubmit)}>
            Add
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
});
