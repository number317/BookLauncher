import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Pressable } from 'react-native';
import styles from './styles';

const Time = () => {
  const [hours, setHours] = useState((new Date()).getHours().toString().padStart(2, '0'));
  const [minutes, setMinutes] = useState((new Date()).getMinutes().toString().padStart(2, '0'));
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      const date = new Date();
      const h = date.getHours().toString().padStart(2, '0');
      const m = date.getMinutes().toString().padStart(2, '0');
      hours !== h && setHours(h);
      minutes !== m && setMinutes(m);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const goSetting = () => {
    navigation.navigate('Setting');
  };

  return (
    <View style={styles.container}>
      <Pressable onLongPress={goSetting}>
        <Text style={styles.hour}>{hours}</Text>
      </Pressable>
      <Text style={styles.minute}>{minutes}</Text>
    </View>
  );
};

export default Time;
