import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput as TextInputOriginal,
  Keyboard,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import TextInputMask from 'react-native-text-input-mask';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';

import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  TextInput,
  Loading,
} from '@components';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { useAlerts } from '@hooks';
import { StackScreenProps } from '@react-navigation/stack';
import useAuthStore from '@screens/auth/store/Store';

import { IconName } from '../../../../contexts/alerts-v2/models/Icon';
import {
  EditProfilePayload,
  useDeleteUserAccount,
  useEditProfile,
  useUploadProfileImage,
} from '../queries/mutations';
import { GlobalParamList } from 'navigation/models/GlobalParamList';
import AccountInfoAlertContent from './components/AccountInfoAlertContent';

export default function EditProfileScreen(
  props: StackScreenProps<GlobalParamList, 'EditProfile'>,
) {
  const queryClient = useQueryClient();
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { showAlert, showNotification } = useAlerts();

  const { user: oldUser, setIsLogin } = useAuthStore();

  const nameRef = useRef<TextInputOriginal>(null);
  const emailRef = useRef<TextInputOriginal>(null);
  const [user, setUser] = useState<EditProfilePayload | undefined>(oldUser);
  const [imageUri, setImageUri] = useState('');

  const { mutateAsync: deleteUserAccount, isLoading } = useDeleteUserAccount();
  const { mutateAsync: editProfile, isLoading: isEditProfileLoading } =
    useEditProfile();
  const { mutate: uploadProfileImage, isLoading: isUploadProfileLoading } =
    useUploadProfileImage();

  const deleteUser = async () => {
    const response = await deleteUserAccount({ confirm: true });

    if (response?.success) {
      setIsLogin(false);
      AsyncStorage.removeItem('access_token');
      navigation.navigate('Dashboard');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Settings' }],
      });
      queryClient.invalidateQueries();

      showNotification({
        icon: {
          size: 70,
          name: IconName.CheckMarkCircle,
          color: BaseColor.greenColor,
        },
        message: `Your account and all data related to it were deleted permanently. 
 
 You can still use the application and benefit from it`,
        dismissAfterMs: 4000,
      });
    }
  };

  const onPressDelete = async () => {
    Keyboard.dismiss();
    const buttonPressed = await showAlert({
      icon: {
        size: 70,
        name: IconName.Warning,
        color: BaseColor.redColor,
      },
      title: 'Are you sure?',
      message:
        "This will delete your account permanently and you won't be able to recover it again.",
      btn: {
        confirmDestructive: true,
        confirmBtnTitle: 'Delete',
        cancelBtnTitle: 'Cancel',
      },
      type: 'Standard',
    });

    if (buttonPressed === 'confirm') {
      const response = await deleteUserAccount({ confirm: false });
      if (
        response.ownerOfBusinessesCount === 0 &&
        response.reviewsOnYourBusinessesCount === 0 &&
        response.businessesWhereGaveReviewsCount === 0
      ) {
        await deleteUser();
      } else {
        const alertButtonPressed = await showAlert({
          content: () => (
            <AccountInfoAlertContent
              businessesWhereGaveReviewsCount={
                response.businessesWhereGaveReviewsCount
              }
              ownerOfBusinessesCount={response.ownerOfBusinessesCount}
              reviewsOnYourBusinessesCount={
                response.reviewsOnYourBusinessesCount
              }
            />
          ),
          btn: {
            confirmDestructive: true,
            confirmBtnTitle: 'Delete',
            cancelBtnTitle: 'Cancel',
          },
          type: 'Custom',
        });

        if (alertButtonPressed === 'confirm') {
          await deleteUser();
        }
      }
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const onSubmit = async () => {
    if (!user) {
      return;
    }
    const payload = {
      ...user,
      phone: user.phone.replace(/\s+/g, ''),
    };

    delete payload.avatar;

    const editUserProfile = await editProfile(payload);

    if (editUserProfile !== undefined) {
      navigation.goBack();
    }
  };

  const pickSingle = () => {
    ImagePicker.openPicker({
      width: 250,
      height: 250,
      cropping: true,
      cropperCircleOverlay: true,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then((image) => {
        setImageUri(image.path);
        const filename = image.path.replace(/^.*[\\/]/, '');
        let file = {
          uri:
            Platform.OS === 'android'
              ? image.path
              : image.path.replace('file://', ''),
          type: 'multipart/form-data',
          name: filename,
        };
        const form = new FormData();
        form.append('file', file);

        if (user) {
          const userPayload = {
            ...user,
            phone: user.phone.replace(/\s+/g, ''),
          };
          uploadProfileImage({ user: userPayload, form: form });
        }
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
  };

  const onUserUpdate = (value: Partial<EditProfilePayload>) => {
    if (user) {
      setUser({ ...user, ...value });
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('edit_profile')}
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
        onPressRight={() => {}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.KeyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.contain}>
          <TouchableOpacity
            disabled={isUploadProfileLoading}
            style={styles.thumbContainer}
            onPress={() => pickSingle()}>
            <Loading loading={isUploadProfileLoading} />
            <Image
              source={{
                uri:
                  imageUri ||
                  user?.avatar ||
                  'https://i.ibb.co/RD6rVBy/default-avatar.png',
              }}
              style={[styles.thumb, { borderColor: colors.text }]}
            />
          </TouchableOpacity>
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {'Phone'}
            </Text>
          </View>
          <TextInputMask
            style={[
              styles.textInput,
              { backgroundColor: colors.card, color: colors.text },
            ]}
            onChangeText={(phone) => onUserUpdate({ phone })}
            placeholder={'Input Phone'}
            placeholderTextColor={BaseColor.grayColor}
            keyboardType="numeric"
            value={user?.phone}
            autoCapitalize="none"
            mask={'+92 [000] [0000] [000]'}
            returnKeyType="next"
            onSubmitEditing={() => nameRef.current?.focus()}
            blurOnSubmit={false}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('name')}
            </Text>
          </View>
          <TextInput
            ref={nameRef}
            onChangeText={(name) => onUserUpdate({ name })}
            placeholder={t('input_name')}
            value={user?.name}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('email')}
            </Text>
          </View>
          <TextInput
            ref={emailRef}
            onChangeText={(email) => onUserUpdate({ email })}
            placeholder={t('input_email')}
            value={user?.email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => onSubmit()}
            blurOnSubmit={true}
          />
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <Button
            loading={isEditProfileLoading}
            full
            onPress={() => onSubmit()}>
            {t('update')}
          </Button>
          <Button
            loading={isLoading}
            full
            destructive
            onPress={() => onPressDelete()}
            style={styles.deleteButton}>
            {t('delete')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  KeyboardAvoidingView: {
    flex: 1,
  },
  contentTitle: {
    alignItems: 'flex-start',
    width: '100%',
    height: 32,
    justifyContent: 'center',
  },
  contain: {
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: BaseColor.grayColor,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbContainer: {
    flexDirection: 'row',
    position: 'relative',
    borderRadius: 50,
    borderWidth: 1,
    overflow: 'hidden',
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  buttonsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  deleteButton: {
    marginTop: 15,
  },
});
