import React, { useState } from "react";
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Header, Button, Image, Text, Icon, Card, SafeAreaView, CardList } from "@components";
import { BaseStyle, BaseColor, useTheme } from "@config";
import * as Utils from "@utils";
import styles from "./styles";
import Swiper from "react-native-swiper";
import { HomePopularData, HomeListData, HomeBannerData } from "@data";
import { useTranslation } from "react-i18next";

export default function Home({ navigation }) {
  const deltaY = new Animated.Value(0);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [banner] = useState(HomeBannerData);
  const [services] = useState([
    {
      id: "1",
      color: colors.primaryLight,
      icon: "shopping-bag",
      name: "shopping",
      route: "Place"
    },
    {
      id: "2",
      color: BaseColor.kashmir,
      icon: "coffee",
      name: "coffee_bag",
      route: "Place"
    },
    {
      id: "3",
      color: BaseColor.pinkColor,
      icon: "star",
      name: "event",
      route: "Place"
    },
    {
      id: "4",
      color: BaseColor.blueColor,
      icon: "handshake",
      name: "real_estate",
      route: "Place"
    },
    {
      id: "5",
      color: colors.accent,
      icon: "briefcase",
      name: "jobseeker",
      route: "Place"
    },
    {
      id: "3",
      color: BaseColor.greenColor,
      icon: "utensils",
      name: "restaurant",
      route: "Place"
    },
    {
      id: "4",
      color: BaseColor.yellowColor,
      icon: "car",
      name: "automotive",
      route: "Place"
    },
    {
      id: "5",
      color: BaseColor.kashmir,
      icon: "ellipsis-h",
      name: "more",
      route: "Category"
    }
  ]);
  const [popular] = useState(HomePopularData);
  const [list] = useState(HomeListData);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());

  const heightImageBanner = Utils.scaleWithPixel(225);
  const marginTopBanner = heightImageBanner - heightHeader + 10;
  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.imageBackground,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(150),
                Utils.scaleWithPixel(150),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Swiper
          dotStyle={{
            backgroundColor: colors.text
          }}
          activeDotColor={colors.primary}
          paginationStyle={styles.contentPage}
          removeClippedSubviews={false}
          autoplay={true}
          autoplayTimeout={2}
          showsPagination={false}
        >
          {banner.map((item, index) => {
            return (
              <Image key={item.id} source={item.image} style={{flex: 1}} />
            );
          })}
        </Swiper>
      </Animated.View>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: "always" }}>
        <Header
          title={''}
          renderRight={() => {
            // return <Icon name={'call'} size={20} color={colors.primary} />;
            return (
              <Button
                styleText={{marginLeft: 8}}
                style={{width: 130, paddingHorizontal: 10, height: 30}}
                icon={
                  <Icon
                    name={'phone'}
                    size={15}
                    color={'white'}
                    solid
                  />
                }
                full
                round
                onPress={() => alert('ddd')}>
                Help Line
              </Button>
            );
          }}
          onPressRight={() => {
            alert('there');
          }}
        />
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: deltaY }
              }
            }
          ])}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          scrollEventThrottle={8}
        >
          <View
            style={[
              styles.searchForm,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                shadowColor: colors.border
              },
              { marginTop: marginTopBanner }
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("SearchHistory")}
            >
              <View
                style={[BaseStyle.textInput, { backgroundColor: colors.card }]}
              >
                <Text body1 grayColor style={{ flex: 1 }}>
                  {t("search_location")}
                </Text>
                <View style={{ paddingVertical: 8 }}>
                  <View
                    style={[
                      styles.lineForm,
                      { backgroundColor: colors.border }
                    ]}
                  />
                </View>
                <Icon
                  name="location-arrow"
                  size={18}
                  color={colors.primaryLight}
                  solid
                />
              </View>
            </TouchableOpacity>
          </View>
          {/* services */}
          <FlatList
            contentContainerStyle={{ padding: 20 }}
            data={services}
            numColumns={4}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.serviceItem}
                  onPress={() => navigation.navigate(item.route)}
                >
                  <View
                    style={[
                      styles.serviceCircleIcon,
                      { backgroundColor: item.color }
                    ]}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      color={BaseColor.whiteColor}
                      solid
                    />
                  </View>
                  <Text footnote numberOfLines={1}>
                    {t(item.name)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          {/* Hiking */}
          <View style={styles.contentPopular}>
            <Text title3 semibold>
              {t("popular_location")}
            </Text>
            <Text body2 grayColor>
              {t("popular_lologan")}
            </Text>
          </View>
          <FlatList
            contentContainerStyle={{ paddingLeft: 5, paddingRight: 15 }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={popular}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item, index }) => (
              <Card
                style={[styles.popularItem, { marginLeft: 15 }]}
                image={item.image}
                onPress={() => navigation.navigate("PlaceDetail")}
              >
                <Text headline whiteColor semibold>
                  {item.name}
                </Text>
              </Card>
            )}
          />
          {/* Promotion */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 15
            }}
          >
            <Text title3 semibold>
              {t("recent_location")}
            </Text>
            <Text body2 grayColor>
              {t("recent_sologan")}
            </Text>
            <FlatList
              style={{ marginTop: 15 }}
              data={list}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                <CardList
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  rate={item.rate}
                  style={{ marginBottom: 15 }}
                  onPress={() => navigation.navigate("PlaceDetail")}
                />
              )}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
