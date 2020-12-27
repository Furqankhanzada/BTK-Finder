import React, { useState } from 'react';
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

  const btkNumbers = ['02137170555', '02138771555'];
  const DATA = [
    {
      title: 'Emergency Numbers',
      data: [
        {
          title: 'Bahria Hospital',
          numbers: ['021111111284'],
          image: Images.logo,
        },
        {
          title: 'Bahria Medical Center',
          numbers: ['02136435400', '02138771555'],
          extension: '660',
          description:
            '24/7 Pharmacy, Clinical & Interventional Neurology, Dental Centre, Eye Department and More.',
          image: Images.logo,
        },
        {
          title: 'Bahria Security',
          numbers: ['03212810185', '02138771555'],
          extension: '624',
          description:
            'You can call on this number regarding to Bahria Town security issues.',
          image: Images.logo,
        },
        {
          title: 'Bahria Fire Brigade',
          numbers: ['02138771555'],
          extension: '959',
          description:
            'Call to Bahria Fire Depart if their are fires in buildings, vehicles or on outdoor structures.',
          image: Images.logo,
        },
        {
          title: 'Bahria Ambulance',
          numbers: ['02136435406'],
          image: Images.logo,
        },
        {
          title: 'Madadgar (15)',
          numbers: ['15'],
          image: Images.madadgar15,
        },
        {
          title: 'Edhi',
          numbers: ['115'],
          image: Images.edhi,
        },
      ],
    },
    {
      title: 'General Numbers',
      data: [
        {
          title: 'Complaint Department',
          description:
            'You can complain about anything like: Power break down, Water tanker request, Gas cylinder request, Electrical fault.',
          numbers: ['02134110447', '02138771555'],
          extension: '700',
          image: Images.logo,
        },
        {
          title: 'Billing Department',
          numbers: btkNumbers,
          extension: '1031',
          description: 'Regarding Maintenance bill and electrical bill.',
          image: Images.logo,
        },
        {
          title: 'Possession Department',
          numbers: btkNumbers,
          extension: '618',
          description: 'Regarding to new homes, plots and properties.',
          image: Images.logo,
        },
        {
          title: 'Police Station',
          numbers: ['02134644407', '02134642971'],
          description:
            'Call Bahria Town Police Station if you witness a crime like a robbery, an assault, or another type of criminal behavior.',
          image: Images.police,
        },
      ],
    },
  ];

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
        sections={DATA}
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
          // setSortOption(props.sortOption);
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
