import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Icon, Text, Button } from '@components';
import PropTypes from 'prop-types';
import { BaseColor, useTheme } from '@config';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { showBetaModal } from '../../popup/betaPopup';

export default function FilterSort(props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const backgroundColor = colors.background;
  const cardColor = colors.card;

  const [sortOption, setSortOption] = useState(props.sortOption);
  const [sortSelected, setSortSelected] = useState(props.sortSelected);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setSortOption(
      sortOption.map((item) => {
        return {
          ...item,
          checked: item.value == sortSelected.value,
        };
      }),
    );
  }, []);

  const onSelectFilter = (selected) => {
    setSortOption(
      sortOption.map((item) => {
        return {
          ...item,
          checked: item.value == selected.value,
        };
      }),
    );
  };

  const onOpenSort = () => {
    showBetaModal();
    // setModalVisible(true);
    //
    // setSortOption(
    //   sortOption.map(item => {
    //     return {
    //       ...item,
    //       checked: item.value == sortSelected.value,
    //     };
    //   }),
    // );
  };

  const onApply = () => {
    const { onChangeSort } = props;
    const sorted = sortOption.filter((item) => item.checked);
    if (sorted.length > 0) {
      setSortSelected(sorted[0]);
      setModalVisible(false);
      onChangeSort(sorted[0]);
    }
  };

  const iconModeView = (modeView) => {
    switch (modeView) {
      case 'block':
        return 'square';
      case 'grid':
        return 'th-large';
      case 'list':
        return 'th-list';
      default:
        return 'th-list';
    }
  };

  const { style, modeView, onChangeView, labelCustom, onLocation, isLocation } =
    props;
  const customAction =
    modeView != '' ? (
      <TouchableOpacity onPress={onChangeView} style={styles.contentModeView}>
        <Icon
          name={iconModeView(modeView)}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
      </TouchableOpacity>
    ) : (
      <Text headline grayColor numberOfLines={1} style={styles.contentModeView}>
        {labelCustom}
      </Text>
    );

  return (
    <View style={[styles.contain, { backgroundColor }, style]}>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          setSortOption(props.sortOption);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[styles.contentFilterBottom, { backgroundColor: cardColor }]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          {sortOption.map((item, index) => (
            <TouchableOpacity
              style={[
                styles.contentActionModalBottom,
                { borderBottomColor: colors.border },
              ]}
              key={item.value}
              onPress={() => onSelectFilter(item)}>
              <Text body2 semibold primaryColor={item.checked}>
                {t(item.text)}
              </Text>
              {item.checked && (
                <Icon name="check" size={14} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
          <Button
            full
            style={{ marginTop: 10, marginBottom: 20 }}
            onPress={() => onApply()}>
            {t('apply')}
          </Button>
        </View>
      </Modal>
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center' }}
        onPress={() => onOpenSort()}>
        <Icon
          name={sortSelected.icon}
          size={16}
          color={BaseColor.grayColor}
          solid
        />
        <Text headline grayColor style={{ marginLeft: 5 }}>
          {t(sortSelected.text)}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={onLocation} style={styles.contentFilter}>
          {isLocation ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <Text style={{ color: colors.primary, marginRight: 5 }}>
                Nearby
              </Text>
              <Icon
                name="map-marker-alt"
                size={16}
                color={colors.primary}
                solid
              />
            </View>
          ) : (
            <Icon
              name="map-marker-alt"
              size={16}
              color={BaseColor.grayColor}
              solid
            />
          )}
        </TouchableOpacity>
        <View style={styles.line} />
        {customAction}
      </View>
    </View>
  );
}

FilterSort.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  sortOption: PropTypes.array,
  sortSelected: PropTypes.object,
  modeView: PropTypes.string,
  labelCustom: PropTypes.string,
  onChangeSort: PropTypes.func,
  onChangeView: PropTypes.func,
  onLocation: PropTypes.func,
  isLocation: PropTypes.bool,
};

FilterSort.defaultProps = {
  style: {},
  sortOption: [
    {
      value: 'low_price',
      icon: 'sort-amount-up',
      text: 'lowest_price',
    },
    {
      value: 'hight_price',
      icon: 'sort-amount-down',
      text: 'hightest_price',
    },
    {
      value: 'high_rate',
      icon: 'sort-amount-up',
      text: 'hightest_rating',
    },
    {
      value: 'popular',
      icon: 'sort-amount-down',
      text: 'popularity',
    },
  ],
  sortSelected: {
    value: 'high_rate',
    icon: 'sort-amount-up',
    text: 'hightest_rating',
  },
  modeView: '',
  labelCustom: '',
  onChangeSort: () => {},
  onChangeView: () => {},
  onLocation: () => {},
  isLocation: false,
};
