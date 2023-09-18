import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  responsiveHeight,
  responsiveWidth
} from 'react-native-responsive-dimensions';

/*
SpinnerLoader component 
*/
const SpinnerLoader = forwardRef(({ }, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  const width = responsiveWidth(100);
  const height = responsiveHeight(100);

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsLoading(true);
    },
    hide: () => {
      setIsLoading(false);
    },
  }));

  if (isLoading) {
    return (
      <View style={[styles.container, { height: height, width: width }]}>
        <ActivityIndicator
          style={{ bottom: 50 }}
          size="large"
        />
      </View>
    );
  } else {
    return null;
  }
});

export default SpinnerLoader;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
  },
});
