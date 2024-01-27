import { Modal, StyleSheet, FlatList } from 'react-native';
import { Header, Icon, SafeAreaView, SelectItem } from '@components';
import { useTheme } from '@config';
import React from 'react';

export type Item = {
  id: string;
  title: string;
};

type Props = {
  title?: string;
  visible: boolean;
  items: Item[];
  selectedItem: Item | undefined;
  onPress: (item: any) => void;
  onRequestClose: () => void;
  onClosePress: () => void;
};

export default function ListModal({
  title,
  visible,
  items,
  selectedItem,
  onPress,
  onRequestClose,
  onClosePress,
}: Props) {
  const { colors } = useTheme();

  const renderItem = ({ item }: { item: Item }) => {
    return (
      <SelectItem
        onPress={() => onPress(item)}
        text={item.title}
        checked={item.id === selectedItem?.id}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide">
      <SafeAreaView style={styles.safeAreaView}>
        <Header
          title={title}
          renderLeft={() => {
            return (
              <Icon
                name="times"
                size={20}
                color={colors.primary}
                enableRTL={true}
              />
            );
          }}
          onPressLeft={onClosePress}
        />
        <FlatList
          style={styles.listItemsContainer}
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedItem}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  listItemsContainer: {
    paddingHorizontal: 20,
  },
});
