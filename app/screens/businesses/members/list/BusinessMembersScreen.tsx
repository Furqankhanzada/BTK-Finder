import * as React from 'react';
import {
  StyleSheet,
  View,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import {
  TabView,
  SceneRendererProps,
  Route,
  TabBar,
  NavigationState,
} from 'react-native-tab-view';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, Icon, Text } from '@components';
import { BaseStyle, useTheme } from '@config';
import { MembershipStatus } from '@screens/settings/profile/models/UserPresentable';

import { MembersStackParamList } from 'navigation/models/BusinessDetailBottomTabParamList';
import ActiveMembers from './ActiveMembers';
import ArchiveMembers from './ArchiveMembers';

type Props = StackScreenProps<MembersStackParamList, 'Members'>;

const renderScene = (
  sceneProps: SceneRendererProps & { route: Route },
  props: Props,
) => {
  const { route } = sceneProps;
  switch (route.key) {
    case MembershipStatus.ACTIVE:
      return <ActiveMembers {...props} />;
    case MembershipStatus.ARCHIVE:
      return <ArchiveMembers {...props} />;
    default:
      return null;
  }
};

export default function BusinessMembersScreen(props: Props) {
  const layout = useWindowDimensions();
  const { colors } = useTheme();
  const { navigation, route } = props;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: MembershipStatus.ACTIVE, title: 'Active' },
    { key: MembershipStatus.ARCHIVE, title: 'Archived' },
  ]);

  const renderTabBar = (
    tabBarProps: SceneRendererProps & {
      navigationState: NavigationState<Route>;
    },
  ) => (
    <TabBar
      {...tabBarProps}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{ backgroundColor: colors.card }}
      labelStyle={{ color: colors.text }}
    />
  );

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Members"
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        renderRight={() => {
          return (
            <View style={styles.addButton}>
              <Icon
                name="plus"
                size={12}
                color={colors.primary}
                enableRTL={true}
              />
              <Text
                numberOfLines={1}
                style={[styles.addButtonText, { color: colors.primary }]}>
                Add
              </Text>
            </View>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() =>
          navigation.navigate('AddOrEditMember', {
            businessId: route.params.businessId,
          })
        }
      />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={(renderProps: SceneRendererProps & { route: Route }) =>
          renderScene(renderProps, props)
        }
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 15,
    marginLeft: 5,
  },
});
