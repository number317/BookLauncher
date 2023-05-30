import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const Modal = (props) => {
  const { children } = props;

  return (
      <View style={styles.container}>
        { children }
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});

export default Modal;
