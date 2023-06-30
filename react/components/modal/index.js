import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from '../icon';
import styles from './style';

const Modal = (props) => {
  const { showHeader = true, handleClose, style, children } = props;

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        {
          showHeader && (
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleClose}>
                <Icon name="close" size={16} />
              </TouchableOpacity>
            </View>
          )
        }
        <View style={{ ...styles.modalBody, ...style }}>
          { children }
        </View>
      </View>
    </View>
  );
};

export default Modal;
