import React, { useEffect, useState } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { SectionList, TouchableOpacity, View } from 'react-native';
import { BaseStyle, useTheme, Images } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  HelpLineItem,
  Text,
  Button,
} from '@components';
import { useTranslation } from 'react-i18next';
import call from 'react-native-phone-call';
import Modal from 'react-native-modal';
import styles from '../../components/FilterSort/styles';

const HelpLine = React.memo(({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const cardColor = colors.card;
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({ numbers: [] });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onItemClick = (record) => {
    if (record.numbers.length > 1) {
      setSelectedIndex(0);
      setSelectedRecord(record);
      setModalVisible(true);
    } else {
      call({ number: record.numbers[0] }).catch((e) => console.log(e));
    }
  };

  const callNow = () => {
    setModalVisible(false);
    call({ number: selectedRecord.numbers[selectedIndex] }).catch((e) =>
      console.log(e),
    );
  };

  useEffect(() => {
    const getHelplines = remoteConfig().getValue('helplines');
    getHelplines._value && setData(JSON.parse(getHelplines._value));
  }, []);

  const Item = ({ record }) => (
    <HelpLineItem
      onPress={() => onItemClick(record)}
      image={record.image}
      txtLeftTitle={record.title}
      txtContent={record.extension ? `Dial Extension ${record.extension}` : ''}
      txtRight={'Date'}
    />
  );

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('help_line')}
        renderLeft={() => (
          <Icon name="arrow-left" size={20} color={colors.primary} />
        )}
        onPressLeft={() => navigation.goBack()}
      />
      <SectionList
        sections={data}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item record={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text
            title3
            semibold
            style={{
              backgroundColor: cardColor,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 8,
              paddingBottom: 8,
            }}>
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
          style={[styles.contentFilterBottom, { backgroundColor: cardColor }]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          <Text semibold title3 style={{ paddingTop: 10, paddingBottom: 5 }}>
            {selectedRecord.title}
          </Text>
          <Text>{selectedRecord.description}</Text>
          <Text semibold style={{ paddingVertical: 10 }}>
            {'Dial extension when system ask after call: '}{' '}
            <Text semibold title2 primaryColor>
              {selectedRecord.extension}
            </Text>
          </Text>
          {selectedRecord.numbers.map((number, index) => (
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
          <Button
            full
            style={{ marginTop: 10, marginBottom: 20 }}
            onPress={() => callNow()}>
            {t('call_now')}
          </Button>
        </View>
      </Modal>
    </SafeAreaView>
  );
});

export default HelpLine;
