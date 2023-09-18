import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface PrimaryImageProps {
  primaryImgSource: any;
  primaryImageStyle?: any;
}

const PrimaryImage: React.FC<PrimaryImageProps> = props => {

  return (
    <Image
      source={props.primaryImgSource}
      style={[
        { alignSelf: 'center' },
        props.primaryImageStyle
      ]}
    />
  );
};

export default PrimaryImage;

const styles = StyleSheet.create({});
