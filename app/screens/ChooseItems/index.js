import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { BaseStyle, useTheme } from '@config';
import { Header, SafeAreaView, Icon, Text, Button } from '@components';
import styles from './styles';
import { useTranslation } from 'react-i18next';

export default function ChooseItems({ route, navigation }) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [items, setItems] = useState(route.params.items);
  const [loading, setLoading] = useState(false);

  /**
   * @description make selected old data
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  useEffect(() => {
    const { selected } = route.params;

    if (selected.length > 0) {
      setItems(
        items.map((item) => {
          return {
            ...item,
            checked: selected.some((check) => check.name === item.name),
          };
        }),
      );
    }
  }, []);

  /**
   * @description Called when apply
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  const onApply = () => {
    const { onApply } = route.params;
    setLoading(true);
    setTimeout(() => {
      onApply(items.filter((item) => item.checked));
      navigation.goBack();
    }, 500);
  };

  /**
   * @description Called when setting location is selected
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   * @param {object} select
   */
  const onChange = (select) => {
    setItems(
      items.map((item) => {
        if (item.name === select.name) {
          return {
            ...item,
            checked: !item.checked,
          };
        }
        return item;
      }),
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.sectionEmpty}>
        <Text semibold style={styles.sectionEmptyText}>
          No {route?.params?.title || 'Items'} Available
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={
          route?.params?.title
            ? `Select ${route?.params?.title}`
            : 'Select Items'
        }
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.contain}>
        <FlatList
          contentContainerStyle={{ paddingVertical: 10 }}
          data={items}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, { backgroundColor: colors.card }]}
              onPress={() => onChange(item)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={item.icon}
                  color={item?.checked ? colors.primary : colors.text}
                  style={{ marginRight: 10 }}
                  size={15}
                />
                <Text
                  body1
                  style={
                    item.checked
                      ? {
                          color: colors.primary,
                        }
                      : {}
                  }>
                  {item.name}
                </Text>
              </View>
              {item.checked && (
                <Icon name="check" size={14} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={listEmptyComponent}
        />
        <Button full loading={loading} onPress={() => onApply()}>
          {t('apply')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
