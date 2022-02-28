import React from 'react';
import { useTheme } from '@config';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Fade,
} from 'rn-placeholder';
import { responsiveHeight } from 'react-native-responsive-dimensions';

export default function FeaturedCategoryPlaceholderComponent() {
  const { colors } = useTheme();

  return (
    <Placeholder
      Animation={Fade}
      style={{
        height: 57,
        flexDirection: 'column',
        display: 'flex',
      }}
      Left={(props) => (
        <PlaceholderMedia
          style={[
            props.style,
            {
              width: 38,
              height: 38,
              borderRadius: 20,
              backgroundColor: colors.card,
              marginLeft: 10,
              alignSelf: 'center',
            },
          ]}
        />
      )}>
      <PlaceholderLine
        style={{
          marginTop: responsiveHeight(1),
          backgroundColor: colors.card,
          alignSelf: 'center',
        }}
        width={70}
      />
    </Placeholder>
  );
}
