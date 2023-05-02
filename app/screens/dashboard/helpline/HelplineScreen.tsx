import React, { useEffect, useState } from 'react';
import { Linking, SectionList, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';

import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Button,
  ListThumbCircle,
} from '@components';
import { handleError } from '@utils';
import { StackScreenProps } from '@react-navigation/stack';
import { useRemoteConfig } from '@hooks';

import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import styles from '../../../components/FilterSort/styles';
import { trackEvent, EVENTS } from '../../../userTracking';
import { HelplinesData } from '../../../models/RemoteConfig';

const HelpLine = React.memo(
  ({ navigation }: StackScreenProps<GlobalParamList, 'HelpLine'>) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const remoteConfig = useRemoteConfig();
    const cardColor = colors.card;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<
      HelplinesData | undefined
    >();
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onItemClick = (record: HelplinesData) => {
      if (record.numbers.length > 1) {
        setSelectedIndex(0);
        setSelectedRecord(record);
        setModalVisible(true);
      } else {
        Linking.openURL(`tel:${record.numbers[0]}`).catch(handleError);
        trackEvent(EVENTS.CALL_ON_HELPLINE, {
          title: record.title,
          number: record.numbers[0],
        });
      }
    };

    const callNow = () => {
      setModalVisible(false);
      Linking.openURL(`tel:${selectedRecord?.numbers[selectedIndex]}`).catch(
        handleError,
      );
      trackEvent(EVENTS.CALL_ON_HELPLINE, {
        title: selectedRecord?.title,
        number: selectedRecord?.numbers[selectedIndex],
      });
    };

    useEffect(() => {
      console.log('Helpline ####', remoteConfig.helplines);
      // const getHelplines = remoteConfig().getValue('helplines');
      // getHelplines._value && setData(JSON.parse(getHelplines._value));
    }, [remoteConfig]);

    return (
      <SafeAreaView style={BaseStyle.safeAreaView}>
        <Header
          title={t('help_line')}
          renderLeft={() => (
            <Icon name="arrow-left" size={20} color={colors.primary} />
          )}
          onPressLeft={() => navigation.goBack()}
        />
        <SectionList
          sections={remoteConfig.helplines}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ListThumbCircle
              style={styles.listThumbCircle}
              image={item.image}
              txtLeftTitle={item.title}
              txtContent={
                item.extension ? `Dial Extension ${item.extension}` : ''
              }
              iconRightName="phone"
              onPress={() => onItemClick(item)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              title3
              semibold
              style={[
                styles.sectionHeaderTitle,
                { backgroundColor: cardColor },
              ]}>
              {title}
            </Text>
          )}
        />
        <Modal
          isVisible={modalVisible}
          onSwipeComplete={() => {
            setModalVisible(false);
          }}
          swipeDirection={['down']}
          style={styles.bottomModal}>
          <View
            style={[
              styles.contentFilterBottom,
              { backgroundColor: cardColor },
            ]}>
            <View style={styles.contentSwipeDown}>
              <View style={styles.lineSwipeDown} />
            </View>
            <Text semibold title3 style={styles.selectedRecordText}>
              {selectedRecord?.title}
            </Text>
            <Text>{selectedRecord?.description}</Text>
            <Text semibold style={styles.recordSubText}>
              {'Dial extension when system ask after call: '}{' '}
              <Text semibold title2 primaryColor>
                {selectedRecord?.extension}
              </Text>
            </Text>
            {selectedRecord?.numbers.map((number, index) => (
              <TouchableOpacity
                style={[
                  styles.contentActionModalBottom,
                  { borderBottomColor: colors.border },
                ]}
                key={number}
                onPress={() => setSelectedIndex(index)}>
                <Text body2 semibold primaryColor={index === selectedIndex}>
                  {t(number)}
                </Text>
                {index === selectedIndex && (
                  <Icon name="check" size={14} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            <Button full style={styles.callButton} onPress={() => callNow()}>
              {t('call_now')}
            </Button>
          </View>
        </Modal>
      </SafeAreaView>
    );
  },
);

export default HelpLine;
