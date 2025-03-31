import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import Icon from '../icon';
import Store from '../../store';
import styles from './styles';

const TopStatus = () => {
  const { rootStore, rootStore: { batteryLevel, isCharging } } = useContext(Store);

  return (
    <View style={styles.container}>
      <Text style={styles.hello}>
        {rootStore.hello}
      </Text>
      <View style={styles.battery}>
        {isCharging && <Icon name="battery-charge" />}
        {!isCharging && batteryLevel >= 70 && <Icon name="battery-full" />}
        {!isCharging && batteryLevel > 50 && batteryLevel < 70 && <Icon name="battery-working-one" />}
        {!isCharging && batteryLevel < 50 && batteryLevel > 20 && <Icon name="battery-working" />}
        {!isCharging && batteryLevel < 20 && <Icon name="battery-empty" />}
        <Text style={styles.level}>
          {batteryLevel}%
        </Text>
      </View>
    </View>
  )
};

export default observer(TopStatus);
