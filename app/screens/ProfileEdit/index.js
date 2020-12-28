import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { BaseStyle, BaseColor, useTheme } from '@config';
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
import styles from './styles';
import TextInputMask from 'react-native-text-input-mask';
import { useTranslation } from 'react-i18next';
import { editProfile, uploadProfileImage } from '../../actions/auth';
import ImagePicker from 'react-native-image-crop-picker';

export default function ProfileEdit({ navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const profileData = useSelector((state) => state.profile);
  const editProfileLoading = useSelector(
    (state) => state.auth.editProfileLoading,
  );
  const dispatch = useDispatch();

  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);
  const [phone, setPhone] = useState(profileData.phone);
  const [loading, setLoading] = useState(false);

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  const onSubmit = () => {
    dispatch(
      editProfile({ name, email, phone, _id: profileData._id }, () => {
        navigation.goBack();
      }),
    );
  };

  const [imageUri, setImageUri] = useState('');

  const uploadProfileImageCallBack = () => {};

  const nameRef = useRef(null);
  const emailRef = useRef(null);

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
        const filename = image.path.replace(/^.*[\\\/]/, '');
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
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
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
        style={{ flex: 1 }}>
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
            onSubmitEditing={() => nameRef.current.focus()}
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
            onSubmitEditing={() => emailRef.current.focus()}
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
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => onSubmit()}
            blurOnSubmit={true}
          />
        </ScrollView>
        <View style={{ paddingVertical: 15, paddingHorizontal: 20 }}>
          <Button loading={editProfileLoading} full onPress={() => onSubmit()}>
            {t('confirm')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
