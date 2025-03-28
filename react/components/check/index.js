import React from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../icon';
import styles from './style';

const Check = (props) => {
  const { text, checked, onCheck } = props;

  return (
    <TouchableOpacity onPress={onCheck}>
      <View style={styles.check}> 
        <Icon name={checked ? 'check-one' : 'round'} size={18} style={{ marginRight: 2 }} />
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default observer(Check);
