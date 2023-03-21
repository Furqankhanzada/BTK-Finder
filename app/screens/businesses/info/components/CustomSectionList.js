import React from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Loading, Icon } from '@components';
import { BaseColor } from '@config';
import * as Utils from '@utils';

function CustomSectionList(props) {
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
          keyExtractor={(item, index) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  sectionHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderButtonText: {
    fontSize: 16,
    color: BaseColor.blueColor,
  },
  sectionHeaderButtonIcon: {
    marginLeft: 5,
    fontSize: 18,
    color: BaseColor.blueColor,
  },
  sectionLoading: {
    height: Utils.scaleWithPixel(160),
    position: 'relative',
  },
  sectionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    height: Utils.scaleWithPixel(160),
    flex: 1,
  },
  sectionEmptyText: {
    textAlign: 'center',
  },
  sectionListContainer: {
    paddingLeft: 5,
    paddingRight: 15,
  },
});

export default CustomSectionList;
