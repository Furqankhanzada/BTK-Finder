import React, { Fragment, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  TextInput as TextInputOriginal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

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
import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from 'navigation/models/GlobalParamList';

import {
  NotificationPayload,
  useCreateNotification,
  useUploadNotificationImage,
} from '../queries/mutations';
import { NotificationPresentable } from '../models/NotificationPresentable';
import { useDeleteImage } from '../../../apis/mutations';

export default function SendNotificationScreen(
  props: StackScreenProps<GlobalParamList, 'SendNotification'>,
) {
  const { t } = useTranslation();
  const { navigation } = props;
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NotificationPresentable>();

  const { mutate: uploadImage, isLoading: uploadImageLoading } =
    useUploadNotificationImage();
  const { mutate: deleteImage, isLoading: deleteImageLoading } =
    useDeleteImage();
  const { mutate: createNotification, isLoading: notificationLoading } =
    useCreateNotification();

  const titleRef = useRef<TextInputOriginal>(null);
  const descriptionRef = useRef<TextInputOriginal>(null);
  const linkRef = useRef<TextInputOriginal>(null);
  const typeRef = useRef<TextInputOriginal>(null);

  const [imageKey, setImageKey] = useState<string>('');
  const [notificationImage, setNotificationImage] = useState<string>('');

  const onSubmit = async (data: NotificationPresentable) => {
    const payload = _.pickBy(
      { ...data, image: notificationImage },
      _.identity,
    ) as NotificationPayload;
    createNotification(payload, {
      onSuccess() {
        navigation.goBack();
      },
    });
  };

  const onRemoveImage = () => {
    deleteImage(
      { pathname: imageKey },
      {
        onSuccess() {
          setNotificationImage('');
        },
      },
    );
  };

  const pickSingle = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1000,
        height: 500,
        mediaType: 'photo',
        cropperStatusBarColor: colors.primary,
        cropperToolbarColor: colors.primary,
        cropperToolbarWidgetColor: BaseColor.whiteColor,
        cropperActiveWidgetColor: colors.primary,
      });

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

      uploadImage(
        { form: form },
        {
          onSuccess(response) {
            setNotificationImage(response.Location);
            setImageKey(response.key);
          },
        },
      );
    } catch (error) {
      console.log('IMAGE_PICKER_ERROR', error);
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidingView}>
        <Header
          title={t('notification.send.title')}
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

        <ScrollView contentContainerStyle={styles.contain}>
          <View style={styles.imageContainer}>
            <Loading
              loading={uploadImageLoading || deleteImageLoading}
              style={styles.uploadImageLoading}
            />
            {notificationImage ? (
              <Fragment>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {}}>
                  <Icon
                    style={styles.actionButtonIcon}
                    name="minus"
                    onPress={onRemoveImage}
                  />
                </TouchableOpacity>
                <Image
                  style={styles.notificationImage}
                  source={{ uri: notificationImage }}
                />
              </Fragment>
            ) : (
              <TouchableOpacity
                style={[
                  styles.imageAddOverlay,
                  { backgroundColor: colors.card },
                ]}
                onPress={() => pickSingle()}>
                <Text semibold style={styles.imageAddOverlayText}>
                  {t('notification.send.image')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                ref={titleRef}
                placeholder={t('notification.send.placeholder.title')}
                onSubmitEditing={() => descriptionRef.current?.focus()}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.title}
              />
            )}
            name="title"
          />

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textArea}
                ref={descriptionRef}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                placeholder={t('notification.send.placeholder.description')}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                success={!errors.description}
              />
            )}
            name="description"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                ref={linkRef}
                placeholder={t('notification.send.placeholder.link')}
                onSubmitEditing={() => typeRef.current?.focus()}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="link"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                ref={typeRef}
                placeholder={t('notification.send.placeholder.type')}
                onSubmitEditing={handleSubmit(onSubmit)}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="type"
          />
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <Button
            loading={notificationLoading}
            full
            onPress={handleSubmit(onSubmit)}>
            {t('notification.send.button')}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 10,
    backgroundColor: BaseColor.fieldColor,
    height: 200,
    width: '100%',
    position: 'relative',
    borderRadius: 6,
  },
  uploadImageLoading: {
    borderRadius: 5,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: BaseColor.redColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 2,
    right: -10,
    top: -10,
  },
  actionButtonIcon: {
    color: BaseColor.whiteColor,
  },
  notificationImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  imageAddOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  imageAddOverlayText: {
    fontSize: 20,
    color: BaseColor.grayColor,
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
    paddingBottom: 50,
    flexGrow: 1,
  },
  textArea: {
    height: 'auto',
    minHeight: 100,
    marginTop: 10,
  },
  textInput: {
    marginTop: 10,
  },
  buttonsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
