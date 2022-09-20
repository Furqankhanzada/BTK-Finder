import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
import { BaseColor } from '@config';

export const AlertsV2Context = React.createContext<AlertsV2ContextType | null>(
  null,
);

const INITIAL_SNAP_POINTS = ['CONTENT_HEIGHT'];

export const AlertsV2Provider: React.FC = (props) => {
  //#region Variables
  const { bottom } = useSafeAreaInsets();
  const bottomInset = bottom + 16;

  const [currentContent, setCurrentContent] =
    React.useState<React.ReactNode>(null);
  const [sheetMode, setSheetMode] = React.useState({
    detached: true,
    bottomInset,
    style: styles.detachedStyle,
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

  function present() {
    const Content = entryList.current[0].content;
    setCurrentContent(<Content />);
    sheet.current?.present();
  }

  const shouldPresent = React.useCallback(() => {
    const isFirstEntry =
      entryList.current.length === 1 && prevEntryLength.current === 0;
    const hasQueuedEntry =
      entryList.current.length > 0 &&
      prevEntryLength.current > entryList.current.length;

    if (isFirstEntry || hasQueuedEntry) {
      present();
    }

    prevEntryLength.current = entryList.current.length;
  }, []);

  const configureSheet = React.useCallback(
    (mode: 'detached' | 'modal') => {
      switch (mode) {
        case 'detached':
          if (!sheetMode.detached) {
            setSheetMode({
              detached: true,
              bottomInset,
              style: styles.detachedStyle,
            });
          }
          return;
        case 'modal':
          if (sheetMode.detached) {
            setSheetMode({
              detached: false,
              bottomInset: 0,
              style: styles.modalStyle,
            });
          }
          return;
      }
    },
    [bottomInset, sheetMode.detached],
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
      configureSheet('modal');

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
          bottomInset={sheetMode.bottomInset}
          enablePanDownToClose={false}
          backgroundComponent={null}
          handleComponent={null}
          backdropComponent={Backdrop}
          detached={sheetMode.detached}
          style={[styles.sheetContainer, sheetMode.style]}>
          <View
            style={styles.contentContainerStyle}
            onLayout={handleContentLayout}>
            {currentContent}
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </AlertsV2Context.Provider>
  );
};

function Backdrop(backdropProps: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop
      {...backdropProps}
      pressBehavior="none"
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
    backgroundColor: BaseColor.whiteColor,
    shadowColor: BaseColor.grayColor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16.0,
    elevation: 24,
  },
  detachedStyle: {
    marginHorizontal: 16,
  },
  modalStyle: {
    marginHorizontal: 0,
  },
  contentContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
});
