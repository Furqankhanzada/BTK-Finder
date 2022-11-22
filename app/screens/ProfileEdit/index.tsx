import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput as TextInputOriginal,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TextInputMask from 'react-native-text-input-mask';
import ImagePicker from 'react-native-image-crop-picker';

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
import { AuthActions } from '@actions';
import { MainStackParamList } from 'navigation/models/MainStackParamList';

import { editProfile, uploadProfileImage } from '../../actions/auth';
import { IconName } from '../../contexts/alerts-v2/models/Icon';
import { useDeleteUserAccount } from './queries/mutations';
import AccountInfoAlertContent from './components/AccountInfoAlertContent';

export default function ProfileEdit(
  props: StackScreenProps<MainStackParamList, 'ProfileEdit'>,
) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { showAlert, showNotification } = useAlerts();
  const { mutateAsync: deleteUserAccount, isLoading } = useDeleteUserAccount();

  const profileData = useSelector((state: any) => state.profile);
  const editProfileLoading = useSelector(
    (state: any) => state.auth.editProfileLoading,
  );

  const nameRef = useRef<TextInputOriginal>(null);
  const emailRef = useRef<TextInputOriginal>(null);
  const [name, setName] = useState<string>(profileData.name);
  const [email, setEmail] = useState<string>(profileData.email);
  const [phone, setPhone] = useState<string>(profileData.phone);
  const [imageUri, setImageUri] = useState('');

  const deleteUser = async () => {
    const response = await deleteUserAccount({ confirm: true });

    if (response?.success) {
      //TODO: Will fix once we remove the redux from project.
      dispatch(AuthActions.authentication(false));

      navigation.navigate('MainBottomTabNavigator', {
        screen: 'DashboardStack',
      });

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
        const confirmDelete = await showAlert({
          content: () => (
            <AccountInfoAlertContent
              ownedBusinesses={response.ownerOfBusinessesCount}
              reviewsOnOwnedBusinesses={response.reviewsOnYourBusinessesCount}
              givenReviews={response.businessesWhereGaveReviewsCount}
            />
          ),
          btn: {
            confirmDestructive: true,
            confirmBtnTitle: 'Delete',
            cancelBtnTitle: 'Cancel',
          },
          type: 'Custom',
        });

        if (confirmDelete === 'confirm') {
          await deleteUser();
        }
      }
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const onSubmit = () => {
    dispatch(
      editProfile(
        { name, email, phone: phone.replace(/\s+/g, ''), _id: profileData._id },
        () => {
          navigation.goBack();
        },
      ),
    );
  };

  const uploadProfileImageCallBack = () => {};

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
        dispatch(
          uploadProfileImage(profileData, form, uploadProfileImageCallBack),
        );
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
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
            disabled={profileData.profileImageLoading}
            style={styles.thumbContainer}
            onPress={() => pickSingle()}>
            <Loading loading={profileData.profileImageLoading} />
            <Image
              source={{
                uri:
                  imageUri ||
                  profileData.avatar ||
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
            onChangeText={(text) => setPhone(text)}
            placeholder={'Input Phone'}
            placeholderTextColor={BaseColor.grayColor}
            keyboardType="numeric"
            value={phone}
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
            onChangeText={(text) => setName(text)}
            placeholder={t('input_name')}
            value={name}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <View style={styles.contentTitle}>
            <Text headline semibold>
              {t('email')}
            </Text>
          </View>
          <TextInput
            ref={emailRef}
            onChangeText={(text) => setEmail(text)}
            placeholder={t('input_email')}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => onSubmit()}
            blurOnSubmit={true}
          />
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <Button loading={editProfileLoading} full onPress={() => onSubmit()}>
            {t('confirm')}
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
