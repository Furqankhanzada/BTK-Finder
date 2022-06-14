import React from 'react';
import { useTheme } from '@config';
import {
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Progressive,
} from 'rn-placeholder';
import { View } from 'react-native';

export default function PlaceDetailPlaceholder() {
  const { colors } = useTheme();

  return (
    <View style={{ marginTop: 132 }}>
      <Placeholder Animation={Progressive}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: 8,
            marginBottom: 20,
            alignSelf: 'flex-end',
          }}>
          <PlaceholderMedia
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              marginLeft: 17,
            }}
          />
          <PlaceholderMedia
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              marginLeft: 17,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <PlaceholderMedia
            style={{
              width: 32,
              height: 32,
              borderRadius: 25,
            }}
          />
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <PlaceholderLine
              style={{ width: '15%', height: 8, marginTop: 3, marginLeft: 10 }}
            />
            <PlaceholderLine
              style={{
                width: '60%',
                height: 10,
                marginTop: -3,
                marginLeft: 10,
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <PlaceholderMedia
            style={{
              width: 32,
              height: 32,
              borderRadius: 25,
            }}
          />
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <PlaceholderLine
              style={{ width: '15%', height: 8, marginTop: 3, marginLeft: 10 }}
            />
            <PlaceholderLine
              style={{
                width: '45%',
                height: 10,
                marginTop: -3,
                marginLeft: 10,
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <PlaceholderMedia
            style={{
              width: 32,
              height: 32,
              borderRadius: 25,
            }}
          />
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <PlaceholderLine
              style={{ width: '15%', height: 8, marginTop: 3, marginLeft: 10 }}
            />
            <PlaceholderLine
              style={{
                width: '55%',
                height: 10,
                marginTop: -3,
                marginLeft: 10,
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 18 }}>
          <PlaceholderMedia
            style={{
              width: 32,
              height: 32,
              borderRadius: 25,
            }}
          />
          <View style={{ flexDirection: 'column', width: '100%' }}>
            <PlaceholderLine
              style={{ width: '15%', height: 8, marginTop: 3, marginLeft: 10 }}
            />
            <PlaceholderLine
              style={{
                width: '50%',
                height: 10,
                marginTop: -3,
                marginLeft: 10,
              }}
            />
          </View>
        </View>
        <PlaceholderLine style={{ width: '70%', height: 15, marginTop: 20 }} />
        <PlaceholderLine style={{ width: '80%', height: 15 }} />
        <PlaceholderLine style={{ width: '76%', height: 15 }} />
        <PlaceholderLine style={{ width: '90%', height: 15 }} />
      </Placeholder>
    </View>
  );
}
