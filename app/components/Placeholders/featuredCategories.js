import React from 'react';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  ShineOverlay,
} from 'rn-placeholder';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const FeaturedCategoryPlaceholderComponent = () => (
  <Placeholder
    Animation={ShineOverlay}
    style={{
      height: 70,
      marginTop: 1,
      marginHorizontal: 14,
    }}
    Left={(props) => (
      <PlaceholderMedia
        style={[
          props.style,
          {
            width: responsiveWidth(12),
            height: responsiveHeight(7),
            borderRadius: 20,
          },
        ]}
      />
  )}>
  <PlaceholderLine style={{ marginTop: responsiveHeight(1) }} width={53} />
  </Placeholder>
);

export default FeaturedCategoryPlaceholderComponent;