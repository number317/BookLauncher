import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, NativeModules, NativeEventEmitter } from 'react-native';
import Icon from '../icon';
import Store from '../../store';
import styles from './styles';

const { _BatteryStatus } = NativeModules;
const batteryEventEmitter = new NativeEventEmitter(_BatteryStatus);

const TopStatus = () => {
  const { rootStore } = useContext(Store);
  const [batteryLevel, setBatteryLevel] = useState(0);
  const [isCharging, setIsCharging] = useState(false);

  const handleBatteryChange = (event) => {
    const { batteryLevel, isCharging } = event;
    setBatteryLevel(batteryLevel);
    setIsCharging(isCharging);
  };

  useEffect(() => {
    const init = async () => {
      const batteryInfo = await _BatteryStatus.getBatteryStatus();
      setBatteryLevel(batteryInfo.batteryLevel);
      setIsCharging(batteryInfo.isCharging);
    };
    init();

    _BatteryStatus.startBatteryStatusListener();
    batteryEventEmitter.addListener('BatteryStatusChanged', handleBatteryChange);
    return () => {
      batteryEventEmitter.removeListener('BatteryStatusChanged', handleBatteryChange);
      _BatteryStatus.stopBatteryStatusListener();
    }
  }, []);

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
