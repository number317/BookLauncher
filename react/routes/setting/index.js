import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text } from 'react-native';
import NavigationBar from '../../components/navigation-bar';
import Gray16 from '../../components/gray16';
import Store from '../../store';
import styles from './style';

const Setting = () => {
  const { rootStore } = useContext(Store);
  const { hideList, formatMessage } = rootStore;
  return (
    <View style={styles.main}>
      <NavigationBar currentMenu="Setting" />
      <View style={styles.setting}>
      </View>
    </View>
  );
};

export default observer(Setting);
