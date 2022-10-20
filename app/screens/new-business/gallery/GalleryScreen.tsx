import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-crop-picker';

import { Header, Text, Button, Icon } from '@components';
import { BaseColor, BaseStyle } from '@config';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { useAddNewImages } from '../queries/mutations';

const gallerySchema = Yup.object({
  gallery: Yup.string(),
});

export const GalleryScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const { mutate: uploadImage } = useAddNewImages();

  const [active, setActive] = useState(false);
  const navigateToNext = () => {
    navigation.navigate('Home');
  };

  const navigateToBack = () => {
    navigation.goBack();
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
    }).then((image) => {
      console.log('Single Image Selected: ', image);
      uploadImage(image.path);
    });
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
          uploadImage(images);
        }
      })
      .catch((e) => {
        console.log('IMAGE_PICKER_ERROR', e);
      });
  };
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Gallery"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
      />
      <Formik
        initialValues={{ gallery: '' }}
        validationSchema={gallerySchema}
        onSubmit={(values) => {
          navigation.navigate('Review');
        }}>
        {({ values, handleSubmit }) => {
          return (
            <>
              <FlatList
                style={styles.container}
                overScrollMode={'never'}
                scrollEventThrottle={16}
                data={[1]}
                renderItem={() => {
                  return (
                    <View style={styles.galleryContainer}>
                      <Text title1 bold>
                        Can you add Images of your business to attract users?
                      </Text>
                      <View>
                        <View style={styles.title}>
                          <Text title3 semibold style={styles.thumbnailText}>
                            Thumbnail
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.thumbnailText}>
                            Thumbnail size must be 300x300
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.thumbnailAddOverlay}
                        onPress={() => pickSingle()}>
                        <Text semibold style={styles.thumbnailAddOverlayText}>
                          Tap To Add Thumbnail
                        </Text>
                      </TouchableOpacity>

                      <View style={styles.gallerySection}>
                        <View style={styles.title}>
                          <Text title3 semibold style={styles.thumbnailText}>
                            Gallery
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.thumbnailText}>
                            Gallery Images size must be 600x400
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={[styles.galleryImageContainer]}
                            onPress={() => pickMultiple()}>
                            <View style={styles.galleryImageAddIconContainer}>
                              <Icon
                                name="plus"
                                style={styles.galleryImageAddIcon}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }}
              />

              <View style={styles.stickyFooter}>
                <Button
                  style={styles.fotterButtons}
                  onPress={() => navigateToBack()}>
                  {'Back'}
                </Button>

                <Button
                  style={[
                    styles.fotterButtons,
                    active === true
                      ? { backgroundColor: BaseColor.grayColor }
                      : null,
                  ]}
                  title="submit"
                  onPress={handleSubmit}>
                  {'Next'}
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};
