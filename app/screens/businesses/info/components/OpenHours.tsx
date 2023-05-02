import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, Text } from '@components';
import { BaseColor, useTheme } from '@config';
import * as Utils from '@utils';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';

interface Props {
  business: BusinessPresentable;
}

export default function OpenHours({ business }: Props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [collapseHour, setCollapseHour] = useState(true);

  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
  };

  const updateOpenHours = (data: any) => {
    let array = [
      { day: 'Monday' },
      { day: 'Tuesday' },
      { day: 'Wednesday' },
      { day: 'Thursday' },
      { day: 'Friday' },
      { day: 'Saturday' },
      { day: 'Sunday' },
    ];
    if (data?.length) {
      array = data.concat(
        array.filter(({ day }) => !data.find((f: any) => f.day === day)),
      );
    }
    return array;
  };

  return (
    <View>
      {business.openHours && business.openHours?.length ? (
        <Fragment>
          <TouchableOpacity style={styles.line} onPress={onCollapse}>
            <View
              style={[styles.contentIcon, { backgroundColor: colors.border }]}>
              <Icon name="clock" size={16} color={BaseColor.whiteColor} />
            </View>
            <View style={styles.contentInforAction}>
              <View>
                <Text caption2 grayColor>
                  {' '}
                  {t('open_hour')}{' '}
                </Text>
                <Text footnote semibold style={styles.time}>
                  {business.openHours[0].from
                    ? business.openHours[0].from.toLowerCase()
                    : ''}
                  {' - '}
                  {business.openHours[0].to
                    ? business.openHours[0].to.toLowerCase()
                    : ''}
                </Text>
              </View>
              <Icon
                name={collapseHour ? 'angle-down' : 'angle-up'}
                size={24}
                color={BaseColor.grayColor}
              />
            </View>
          </TouchableOpacity>
          {business?.openHours?.length > 1 ? (
            <View
              style={[
                styles.openHourContainer,
                // eslint-disable-next-line react-native/no-inline-styles
                { height: collapseHour ? 0 : 'auto' },
              ]}>
              {updateOpenHours(business.openHours).map((item: any) => {
                return (
                  <View
                    style={[
                      styles.lineWorkHours,
                      { borderColor: colors.border },
                    ]}
                    key={item.day}>
                    <Text body2 grayColor>
                      {item.day}
                    </Text>
                    {'isOpen' in item && !item.isOpen ? (
                      <Text body2 accentColor semibold>
                        {' '}
                        Close{' '}
                      </Text>
                    ) : (
                      <Text body2 accentColor semibold>
                        {item.from ? item.from.toLowerCase() : ''}
                        {!(item.isOpen || item.from || item.to) ? 'Close' : ''}
                        {item.from && item.to ? ' - ' : ''}
                        {item.to ? item.to.toLowerCase() : ''}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ) : null}
        </Fragment>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  contentIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentInforAction: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  lineWorkHours: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  time: {
    marginTop: 5,
    marginLeft: 2,
  },
  openHourContainer: {
    paddingLeft: 40,
    paddingRight: 20,
    marginTop: 5,
    overflow: 'hidden',
  },
});
