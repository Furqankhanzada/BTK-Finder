import React from 'react';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  ShineOverlay,
} from 'rn-placeholder';
import {
  responsiveHeight,
} from 'react-native-responsive-dimensions';

const FeaturedCategoryPlaceholderComponent = () => (
  <Placeholder
    Animation={ShineOverlay}
    style={{
      height: 70,
      marginTop: 2,
      marginBottom: 0,
      marginHorizontal: 16,
      flexDirection: "column",
    }}
    Left={(props) => (
      <PlaceholderMedia
        style={[
          props.style,
          {
            width: 38,
            height: 38,
            borderRadius: 20,
          },
        ]}
      />
  )}>
  <PlaceholderLine style={{ marginTop: responsiveHeight(1) }} width={50} />
  </Placeholder>
);

export default FeaturedCategoryPlaceholderComponent;