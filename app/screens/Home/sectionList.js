import React from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Loading, Icon } from '@components';
import styles from './styles';

function SectionList(props) {
  const {
    title,
    subTitle,
    seeMoreFunc,
    data,
    loading,
    renderItem,
    horizontal = false,
  } = props;
  const listEmptyComponent = () => {
    return (
      <View style={styles.sectionEmpty}>
        <Text semibold style={styles.sectionEmptyText}>
          No {title} Available
        </Text>
      </View>
    );
  };
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderContent}>
          {title ? (
            <Text title3 semibold>
              {title}
            </Text>
          ) : null}
          {subTitle ? (
            <Text body2 grayColor>
              {subTitle}
            </Text>
          ) : null}
        </View>
        {data && data.length && seeMoreFunc ? (
          <TouchableOpacity
            style={styles.sectionHeaderButton}
            onPress={seeMoreFunc}>
            <Text semibold style={styles.sectionHeaderButtonText}>
              See More
            </Text>
            <Icon
              name="angle-double-right"
              style={styles.sectionHeaderButtonIcon}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {loading ? (
        <View style={styles.sectionLoading}>
          <Loading loading={true} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.sectionListContainer,
            {
              width: data && data.length ? null : '100%',
              marginHorizontal: horizontal ? 0 : 15,
            },
          ]}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          data={data}
          ListEmptyComponent={listEmptyComponent}
          keyExtractor={(item, index) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

export default SectionList;
