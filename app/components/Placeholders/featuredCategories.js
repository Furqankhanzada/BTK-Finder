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
      height: 55,
      flexDirection: "column",
      display: "flex",
    }}
    Left={(props) => (
      <PlaceholderMedia
        style={[
          props.style,
          {
            width: 38,
            height: 38,
            borderRadius: 20,
            marginLeft: 5,
          },
        ]}
      />
  )}>
  <PlaceholderLine style={{ marginTop: responsiveHeight(1) }} width={90} />
  </Placeholder>
);

export default FeaturedCategoryPlaceholderComponent;