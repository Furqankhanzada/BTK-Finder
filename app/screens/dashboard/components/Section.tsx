import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Tag, Text } from '@components';
import { useTheme } from '@config';

interface Props {
  title: string;
  subTitle?: string;
  viewAllText?: string;
  tag?: string;
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
  tag,
}: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.section, { borderColor: colors.card }]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderContent}>
          {title ? (
            <View style={styles.titleContainer}>
              <Text headline semibold>
                {title}
              </Text>
              {tag ? (
                <Tag primary style={styles.tag}>
                  {tag}
                </Tag>
              ) : null}
            </View>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    marginLeft: 10,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
