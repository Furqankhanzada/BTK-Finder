import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

import { Icon, Text } from '@components';
import { BaseColor, useTheme } from '@config';

export default function ListItem(props: any) {
  const { colors } = useTheme();
  const { title, businessDetail, onPress } = props;
  return (
    <ScrollView>
      <View style={styles.contains}>
        <TouchableOpacity
          style={[styles.profileItem, { borderBottomColor: colors.border }]}
          onPress={onPress}>
          <Text body1>{title}</Text>
          <View style={styles.businessDetailContainer}>
            {businessDetail?.length >= 18 ? (
              <Text
                numberOfLines={1}
                style={[styles.businessDetailText, { color: colors.border }]}
                body1>
                {businessDetail ? businessDetail : '-'}
              </Text>
            ) : (
              <Text style={{ color: colors.border }} body1>
                {businessDetail ? businessDetail : '-'}
              </Text>
            )}

            <View>
              <Icon
                name="angle-right"
                size={18}
                color={colors.primary}
                style={styles.icon}
                enableRTL={true}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contains: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    height: 56,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  businessDetailContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  businessDetailText: {
    width: '65%',
  },
  icon: {
    marginLeft: 5,
  },
});
