import React, { useState, useEffect } from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';

import { useTheme } from '@config';

type Video = {
  isVisible: boolean;
  video: string | null;
};

type Props = {
  isVisible: boolean;
  video: string | null;
  toggleModal: ({ isVisible, video }: Video) => void;
};

type Screen = {
  fullScreen?: boolean;
  potraitMode?: boolean;
  Width_Layout?: number;
  Height_Layout?: number;
};

export const VideoModel = (props: Props) => {
  const { colors } = useTheme();
  const [screenState, setScreenState] = useState<Screen>({
    fullScreen: true,
    Width_Layout: 0,
    Height_Layout: 0,
    potraitMode: true,
  });

  useEffect(() => {
    Orientation.unlockAllOrientations();
    return () => {
      Orientation.lockToPortrait();
    };
  }, []);

  useEffect(() => {
    detectOrientation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenState.Width_Layout]);

  useEffect(() => {
    let { fullScreen, potraitMode } = screenState;
    !fullScreen && !potraitMode ? Orientation.lockToPortrait() : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenState.fullScreen]);

  const changeState = (values: Screen) => {
    setScreenState((prevState) => {
      return {
        ...prevState,
        ...values,
      };
    });
  };

  const detectOrientation = () => {
    if (
      screenState?.Width_Layout &&
      screenState?.Height_Layout &&
      screenState?.Width_Layout > screenState?.Height_Layout
    ) {
      // Write code here, which you want to execute on Landscape Mode.
      changeState({ fullScreen: true, potraitMode: false });
    } else {
      // Write code here, which you want to execute on Portrait Mode.
      changeState({ fullScreen: true, potraitMode: true });
    }
  };

  const modalScreenView = () => {
    return (
      <TouchableOpacity
        style={styles.ModalOutsideContainer}
        onPress={() =>
          props.toggleModal({
            isVisible: false,
            video: null,
          })
        }>
        <View style={styles.ModalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.ModalBox}>
              <View style={styles.VideoPlayerContainer}>
                {videoPlayerView()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableOpacity>
    );
  };

  const videoPlayerView = () => {
    let { fullScreen } = screenState;
    return (
      <VideoPlayer
        disableVolume
        disableFullscreen
        source={{
          uri: props?.video ?? '',
        }}
        onBack={() =>
          props.toggleModal({
            isVisible: false,
            video: null,
          })
        }
        resizeMode="contain"
        toggleResizeModeOnFullscreen={false}
        onEnterFullscreen={() => {
          changeState({ fullScreen: !fullScreen });
        }}
        seekColor={colors.primary}
      />
    );
  };

  return (
    <Modal
      animationType={'fade'}
      supportedOrientations={['portrait', 'landscape']}
      transparent={true}
      visible={props.isVisible}>
      <View
        style={styles.ModalWrapper}
        onLayout={(event) => {
          const { layout } = event.nativeEvent;
          changeState({
            Width_Layout: layout.width,
            Height_Layout: layout.height,
          });
        }}>
        {screenState.fullScreen ? videoPlayerView() : modalScreenView()}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  ModalOutsideContainer: {
    flex: 1,
  },
  ModalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ModalWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  ModalBox: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 4,
    opacity: 1,
  },
  VideoPlayerContainer: {
    width: '100%',
    height: 190,
  },
});
