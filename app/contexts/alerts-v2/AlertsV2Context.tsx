import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { BackdropPressBehavior } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { AlertView } from './components/AlertView';
import { ModalView } from './components/ModalView';
import { NotificationView } from './components/NotificationView';
import {
  AlertEntry,
  AlertBtnResult,
  AlertOptions,
  NotificationOptions,
} from './models/types';
import { AlertsV2ContextType } from './models/AlertsV2ContextType';
import { BaseColor, useTheme } from '@config';

export const AlertsV2Context = React.createContext<AlertsV2ContextType | null>(
  null,
);

const INITIAL_SNAP_POINTS = ['CONTENT_HEIGHT'];

export const AlertsV2Provider: React.FC = (props) => {
  //#region Variables
  const { bottom } = useSafeAreaInsets();
  const bottomInset = bottom + 16;
  const { colors } = useTheme();

  const [currentContent, setCurrentContent] =
    React.useState<React.ReactNode>(null);

  const detached = useSharedValue(true);
  const backdropPressBehavior = useSharedValue<BackdropPressBehavior>('none');
  const floatBottomDistance = useSharedValue<number>(bottomInset);
  const sheetStyle = useAnimatedStyle(() => {
    if (detached.value) {
      return {
        marginHorizontal: 16,
      };
    } else {
      return {
        marginHorizontal: 0,
      };
    }
  });

  const sheet = React.useRef<BottomSheetModal>(null);
  const entryList = React.useRef<Array<AlertEntry>>([]);
  const prevEntryLength = React.useRef<number>(0);
  const handleDismissResult = React.useRef<any>();

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(INITIAL_SNAP_POINTS);
  //#endregion Variables

  //#region Internal methods
  function onDismiss() {
    const currentEntry = entryList.current.shift();
    if (entryList.current.length === 0) {
      prevEntryLength.current = 0;
      setCurrentContent(null);
    } else {
      shouldPresent();
    }

    switch (currentEntry?.type) {
      case 'ShowError':
        currentEntry.promiseResolver();
        break;
      case 'ShowAlert':
      case 'ShowModal':
        currentEntry.promiseResolver(handleDismissResult.current);
        break;
      default:
        throw new Error('Unsupported AlertEntry type');
    }
  }

  const shouldPresent = React.useCallback(() => {
    const present = () => {
      const Content = entryList.current[0].content;
      setCurrentContent(<Content />);
      sheet.current?.present();
    };

    const isFirstEntry =
      entryList.current.length === 1 && prevEntryLength.current === 0;
    const hasQueuedEntry =
      entryList.current.length > 0 &&
      prevEntryLength.current > entryList.current.length;

    if (isFirstEntry || hasQueuedEntry) {
      requestAnimationFrame(() => {
        present();
      });
    }

    prevEntryLength.current = entryList.current.length;
  }, []);

  const configureSheet = React.useCallback(
    (mode: 'detached' | 'modal', behavior?: BackdropPressBehavior) => {
      const behaviorValue = behavior ?? 'none';

      switch (mode) {
        case 'detached':
          if (!detached.value) {
            detached.value = true;
            backdropPressBehavior.value = behaviorValue;
            floatBottomDistance.value = bottomInset;
          }
          return;
        case 'modal':
          if (detached.value) {
            detached.value = false;
            backdropPressBehavior.value = behaviorValue;
            floatBottomDistance.value = 0;
          }
          return;
      }
    },
    [bottomInset, backdropPressBehavior, floatBottomDistance, detached],
  );
  //#endregion Internal methods

  //#region Public API
  const handleDismiss = React.useCallback((result?: any) => {
    handleDismissResult.current = result;
    sheet.current?.dismiss();
  }, []);

  const showAlert = React.useCallback(
    (options: AlertOptions) => {
      configureSheet('detached');

      const { promise, resolve } = getPromiseResolve<AlertBtnResult>();

      const content = () => (
        <AlertView {...options} onDismiss={handleDismiss} />
      );

      entryList.current.push({
        type: 'ShowAlert',
        content,
        promiseResolver: resolve,
      });

      shouldPresent();
      return promise;
    },
    [configureSheet, handleDismiss, shouldPresent],
  );

  const showModal = React.useCallback(
    (options: AlertOptions) => {
      configureSheet('detached');

      const { promise, resolve } = getPromiseResolve<AlertBtnResult>();

      const content = () => (
        <ModalView {...options} onDismiss={handleDismiss} />
      );

      entryList.current.push({
        type: 'ShowModal',
        content,
        promiseResolver: resolve,
      });

      shouldPresent();
      return promise;
    },
    [configureSheet, handleDismiss, shouldPresent],
  );

  const showNotification = React.useCallback(
    (options: NotificationOptions) => {
      const content = () => (
        <NotificationView {...options} onDismiss={handleDismiss} />
      );
      showModal({
        type: 'Custom',
        content,
      });
    },
    [handleDismiss, showModal],
  );

  const showError = React.useCallback(
    (message: string) => {
      configureSheet('detached');

      const { promise, resolve } = getPromiseResolve<void>();

      const defaultError = 'Default Error',
        error = 'Error',
        ok = 'Ok';
      const text = message || defaultError;

      const content = () => (
        <AlertView
          btn={{ confirmBtnTitle: ok }}
          onDismiss={handleDismiss}
          type="Standard"
          title={error}
          message={text}
        />
      );

      entryList.current.push({
        type: 'ShowError',
        promiseResolver: resolve,
        content,
      });

      shouldPresent();
      return promise;
    },
    [configureSheet, handleDismiss, shouldPresent],
  );
  //#endregion

  return (
    <AlertsV2Context.Provider
      value={{
        showAlert,
        showModal,
        showNotification,
        showError,
      }}>
      <BottomSheetModalProvider>
        {props.children}
        <BottomSheetModal
          ref={sheet}
          onDismiss={onDismiss}
          snapPoints={animatedSnapPoints}
          handleHeight={animatedHandleHeight}
          contentHeight={animatedContentHeight}
          bottomInset={floatBottomDistance.value}
          enablePanDownToClose={false}
          backgroundComponent={null}
          handleComponent={null}
          backdropComponent={Backdrop}
          detached={detached.value}
          style={[
            styles.sheetContainer,
            sheetStyle,
            { backgroundColor: colors.background },
          ]}>
          <Animated.View
            style={styles.contentContainerStyle}
            onLayout={handleContentLayout}>
            {currentContent}
          </Animated.View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </AlertsV2Context.Provider>
  );
};

function Backdrop(backdropProps: BottomSheetBackdropProps) {
  const { colors } = useTheme();

  return (
    <BottomSheetBackdrop
      backgroundColor={colors.text}
      {...backdropProps}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={0.75}
    />
  );
}

function getPromiseResolve<ResultType = void>() {
  let resolve: (value: ResultType) => void;
  const promise = new Promise<ResultType>((res) => {
    resolve = res;
  });
  return { promise, resolve: resolve! };
}

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: BaseColor.grayColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16.0,
    elevation: 24,
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});
