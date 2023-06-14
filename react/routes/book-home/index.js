import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import Store from '../../store';
import NavitaionBar from '../../components/navigation-bar';
import styles from './style';

const BookHome = () => {
  const { rootStore } = useContext(Store);
  return (
    <View style={styles.main}>
      <NavitaionBar currentMenu="Book" />
      <View style={styles.book}>
        <Text>book home</Text>
      </View>
    </View>
  );
};

export default observer(BookHome);
