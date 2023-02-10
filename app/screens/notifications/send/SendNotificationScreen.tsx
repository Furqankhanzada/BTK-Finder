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
import { MainStackParamList } from 'navigation/models/MainStackParamList';
import { useDeleteImage } from '@hooks';
import {
  useCreateNotification,
  useUploadNotificationImage,
} from '../queries/mutations';
import { NotificationPresentable } from '../models/NotificationPresentable';

type NotificationType = Pick<
  NotificationPresentable,
  'title' | 'description' | 'link' | 'type' | 'image'
>;

export default function SendNotificationScreen(
  props: StackScreenProps<MainStackParamList, 'SendNotification'>,
) {
  const { navigation } = props;
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NotificationType>();

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

  const removeEmptyKeys = (obj: any) => {
    for (var propName in obj) {
      if (
        obj[propName] === null ||
        obj[propName] === undefined ||
        obj[propName] === ''
      ) {
        delete obj[propName];
      }
    }
    return obj;
  };

  const onSubmit = async (data: NotificationType) => {
    createNotification(removeEmptyKeys(data));
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

  const pickSingle = () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 500,
      cropping: true,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 500,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      cropperStatusBarColor: 'white',
      cropperToolbarColor: 'white',
      cropperActiveWidgetColor: 'white',
      cropperToolbarWidgetColor: '#3498DB',
    })
      .then((image) => {
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
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
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
        style={styles.KeyboardAvoidingView}>
        <Header
          title="Send Notification"
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
                  style={styles.notificaitonImage}
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
                  Tap to add Notification Image
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
                placeholder="Title*"
                onSubmitEditing={() => descriptionRef.current?.focus()}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="title"
          />
          {errors.title && <Text>Title is required.</Text>}

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
                placeholder="Description*"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="description"
          />
          {errors.description && <Text>Description is required.</Text>}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.textInput}
                ref={linkRef}
                placeholder="Link"
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
                placeholder="Type e.g: Announcement or Business"
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
            Create
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
  notificaitonImage: {
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
