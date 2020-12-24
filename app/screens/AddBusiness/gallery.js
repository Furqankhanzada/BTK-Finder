import React, { Fragment } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  CustomStepIndicator,
  Image,
  Loading,
} from '@components';
import styles from './styles';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from 'react-native-action-button';
import { useDispatch, useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import {
  updateImagesIntoRedux,
  uploadImages,
  uploadGalleryImages,
  setBusinessFormData,
} from '../../actions/business';

export default function Gallery({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const stateProps = useSelector(({ businesses, profile }) => {
    return {
      userId: profile._id,
      thumbnail: businesses.thumbnail || '',
      thumbnailLoading: businesses.thumbnailLoading,
      gallery: businesses.gallery,
      galleryLoading: businesses.galleryLoading,
    };
  });

  const onNext = () => {
    dispatch(setBusinessFormData({ gallery: stateProps.gallery }));
    navigation.navigate('FinalReview');
  };

  //for thumbnail function
  const removeThumbnail = () => {
    dispatch(updateImagesIntoRedux('thumbnail', ''));
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
      multiple: false,
    })
      .then((image) => {
        if (image) {
          dispatch(uploadImages(image));
        }
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
  };

  //for gallery function
  const removeSingleGalleryImage = (item) => {
    let data = stateProps.gallery.filter((el) => el.image !== item.image);
    dispatch(updateImagesIntoRedux('gallery', data));
  };
  const onChangeCover = (item) => {
    let data = [...stateProps.gallery];
    data.map((el) => (el.cover = el.image === item.image));
    dispatch(updateImagesIntoRedux('gallery', data));
  };
  const renderGalleryImages = (data) => {
    if (data.length) {
      return data.map((el, i) => (
        <View key={i} style={styles.galleryImageContainer}>
          <TouchableOpacity
            style={styles.galleryActionButton}
            onPress={() => removeSingleGalleryImage(el)}>
            <Icon style={styles.galleryActionButtonIcon} name="minus" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.galleryImageButton}
            onPress={() => onChangeCover(el)}>
            {el?.cover ? (
              <Text semibold style={styles.galleryImageBadge}>
                Cover
              </Text>
            ) : null}
            <Image style={styles.galleryImage} source={{ uri: el.image }} />
          </TouchableOpacity>
        </View>
      ));
    }
    return null;
  };
  const pickMultiple = () => {
    ImagePicker.openPicker({
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,
      multiple: true,
    })
      .then((images) => {
        if (images.length) {
          dispatch(uploadGalleryImages(images));
        }
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={'Add Your Business'}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <CustomStepIndicator position={4} />
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <View style={styles.thumbnailSection}>
          <View style={styles.title}>
            <Text title3 semibold style={{ textAlign: 'center' }}>
              Thumbnail
            </Text>
          </View>
          <View style={styles.thumbnailContainer}>
            <Loading
              loading={stateProps.thumbnailLoading}
              style={{ borderRadius: 5 }}
            />
            {stateProps.thumbnail ? (
              <Fragment>
                <TouchableOpacity
                  style={styles.galleryActionButton}
                  onPress={() => removeThumbnail()}>
                  <Icon style={styles.galleryActionButtonIcon} name="minus" />
                </TouchableOpacity>
                <Image
                  style={styles.thumbnailContainerImage}
                  source={{ uri: stateProps.thumbnail }}
                />
              </Fragment>
            ) : (
              <TouchableOpacity
                style={styles.thumbnailAddOverlay}
                onPress={() => pickSingle()}>
                <Text semibold style={styles.thumbnailAddOverlayText}>
                  Tap To Add Thumbnail
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.gallerySection}>
          <View style={styles.title}>
            <Text title3 semibold style={{ textAlign: 'center' }}>
              Gallery
            </Text>
          </View>
          <View style={styles.gallerySectionImagesContainer}>
            <Loading
              loading={stateProps.galleryLoading}
              style={{ borderRadius: 5 }}
            />
            {renderGalleryImages(stateProps.gallery)}
            <TouchableOpacity
              style={[
                styles.galleryImageContainer,
                !stateProps.gallery?.length && { flex: 1 },
              ]}
              onPress={() => pickMultiple()}>
              <View style={styles.galleryImageAddIconContainer}>
                <Icon name="plus" style={styles.galleryImageAddIcon} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <ActionButton
        buttonColor={colors.primary}
        nativeFeedbackRippleColor="transparent"
        onPress={() => onNext()}
        offsetX={20}
        offsetY={10}
        icon={
          <Icon name="arrow-right" size={20} color="white" enableRTL={true} />
        }
      />
    </SafeAreaView>
  );
}
