import React, { useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import Icon from '../icon';
import Store from '../../store';
import { styles_center, styles_bottom, styles_fullscreen } from './style';

/*
 * displayType: bottom, center, fullscreen
 */
const Modal = (props) => {
  const {
    showHeader = true,
    handleClose,
    displayType = 'center',
    showFooter = false,
    handleOk = () => {},
    handleCancel = () => {},
    style,
    children,
  } = props;
  const { rootStore: { formatMessage } } = useContext(Store);
  const styles = displayType === 'center' && styles_center || displayType === 'bottom' && styles_bottom || styles_fullscreen;

  return (
    <View style={styles.container}>
      <View style={{ ...styles.modal, ...style }}>
        {
          showHeader && (
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose}>
                <Icon name="close" size={40} />
              </TouchableOpacity>
            </View>
          )
        }
        <View style={ styles.body }>
          { children }
        </View>
        {
          showFooter && (
            <View style={styles.footer}>
              <TouchableOpacity onPress={handleCancel}>
                <View style={styles.cancel}>
                  <Text style={styles.actionText}>
                    {formatMessage('cancel')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOk}>
                <View style={styles.ok}>
                  <Text style={styles.actionText}>
                    {formatMessage('confirm')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        }
      </View>
    </View>
  );
};

export default Modal;
