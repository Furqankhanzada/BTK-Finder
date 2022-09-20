import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@components';
import { useTheme } from '@config';

interface Props {
  title: string;
  subTitle?: string;
  viewAllText?: string;
  onViewAll: () => void;
  isLoading: boolean;
  children: JSX.Element;
}

export default function Section({
  title,
  subTitle,
  viewAllText,
  onViewAll,
  children,
}: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderColor: colors.card }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderContent}>
          {title ? (
            <Text headline semibold>
              {title}
            </Text>
          ) : null}
          {subTitle ? (
            <Text caption1 grayColor>
              {subTitle}
            </Text>
          ) : null}
        </View>
        {onViewAll ? (
          <TouchableOpacity style={styles.viewAllBtn} onPress={onViewAll}>
            <Text caption1 darkPrimaryColor>
              {viewAllText ? viewAllText : 'View All'}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeaderContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
