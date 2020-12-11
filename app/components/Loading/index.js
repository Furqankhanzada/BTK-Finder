import React from "react";
import { View, ActivityIndicator } from "react-native";
import { BaseColor } from "@config";
import PropTypes from "prop-types";
import styles from "./styles";

export default function Loading({loading}) {
    if(!loading) return null;
  return (
    <View style={styles.container}>
        <ActivityIndicator
          size="large"
          color={BaseColor.blueColor}
          style={{}}
        />
    </View>
  );
}

Loading.propTypes = {
  loading: PropTypes.bool
};

Loading.defaultProps = {
  loading: false
};
