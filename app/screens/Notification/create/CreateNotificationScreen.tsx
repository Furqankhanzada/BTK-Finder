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
// import { useTranslation } from 'react-i18next';
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
import { socket } from '@utils';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from 'navigation/models/MainStackParamList';
import { useUploadNotificationImage } from '../queries/mutations';

export default function CreateNotificationScreen(
  props: StackScreenProps<MainStackParamList, 'CreateNotification'>,
) {
  const { navigation } = props;
  const { colors } = useTheme();
  // const { t } = useTranslation();
  const { mutate: uploadImage, isLoading: uploadImageLoading } =
    useUploadNotificationImage();

  const titleRef = useRef<TextInputOriginal>(null);
  const descriptionRef = useRef<TextInputOriginal>(null);
  const linkRef = useRef<TextInputOriginal>(null);

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<any>({
    title: '',
    description: '',
    image: '',
    link: '',
    type: '',
  });

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

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

  const onSubmit = async () => {
    setLoading(true);
    socket.emit('createNotification', removeEmptyKeys(notification), () => {
      setLoading(false);
      navigation.goBack();
    });
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
              setNotification({ ...notification, image: response.Location });
            },
          },
        );
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Create Notification"
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
          <View style={styles.imageContainer}>
            <Loading loading={uploadImageLoading} style={{ borderRadius: 5 }} />
            {notification.image ? (
              <Fragment>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {}}>
                  <Icon style={styles.actionButtonIcon} name="minus" />
                </TouchableOpacity>
                <Image
                  style={styles.notificaitonImage}
                  source={{ uri: notification.image }}
                />
              </Fragment>
            ) : (
              <TouchableOpacity
                style={styles.imageAddOverlay}
                onPress={() => pickSingle()}>
                <Text semibold style={styles.imageAddOverlayText}>
                  Tap to add Notification Image
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.contentTitle}>
            <Text headline semibold>
              Title
            </Text>
          </View>
          <TextInput
            ref={titleRef}
            onChangeText={(title) =>
              setNotification({ ...notification, title })
            }
            placeholder="Notification Title"
            value={notification?.title}
            onSubmitEditing={() => descriptionRef.current?.focus()}
          />

          <View style={styles.contentTitle}>
            <Text headline semibold>
              Description
            </Text>
          </View>
          <TextInput
            ref={descriptionRef}
            onChangeText={(description) =>
              setNotification({ ...notification, description })
            }
            placeholder="Notification Description"
            value={notification?.description}
            onSubmitEditing={() => linkRef.current?.focus()}
          />

          <View style={styles.contentTitle}>
            <Text headline semibold>
              Link
            </Text>
          </View>
          <TextInput
            ref={linkRef}
            onChangeText={(link) => setNotification({ ...notification, link })}
            placeholder="Notification Link"
            value={notification?.link}
            onSubmitEditing={() => onSubmit()}
          />
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <Button loading={loading} full onPress={() => onSubmit()}>
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
    marginBottom: 20,
    backgroundColor: BaseColor.fieldColor,
    height: 200,
    width: '100%',
    position: 'relative',
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
    zIndex: 1,
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
  },
  textInput: {
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
    color: BaseColor.grayColor,
  },
  buttonsContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});
