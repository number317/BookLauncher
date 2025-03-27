import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, TouchableOpacity } from 'react-native';
import NavigationBar from '../../components/navigation-bar';
import Modal from '../../components/modal';
import Gray16 from '../../components/gray16';
import Icon from '../../components/icon';
import Store from '../../store';
import styles from './style';

const Setting = () => {
  const { rootStore } = useContext(Store);
  const { hideList, formatMessage } = rootStore;
  const [showModal, setShowModal] = useState(false); 

  const handleSelectLanguage = () => {
    setShowModal('language');
  };

  const handleShowHiddenApp = () => {
    setShowModal('hiddenApp');
  };

  const handleShowGrayTest = () => {
    setShowModal('grayTest');
  };

  const handleShowAppInfo = () => {
    setShowModal('appInfo');
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }

  return (
    <View style={styles.main}>
      <NavigationBar currentMenu="Setting" />
      <View style={styles.setting}>
        <Text style={styles.title}>{formatMessage('setting')}</Text>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <Text>{formatMessage('setting.appmode.setting')}</Text>
            <Icon name="right" size={40} />
          </View>
          <TouchableOpacity onPress={handleSelectLanguage}>
            <View style={styles.formItem}>
              <Text>{formatMessage('setting.language.setting')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShowHiddenApp}>
            <View style={styles.formItem}>
              <Text>{formatMessage('setting.hide.app')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShowGrayTest}>
            <View style={styles.formItem}>
              <Text>{formatMessage('setting.gray.test')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShowAppInfo}>
            <View style={styles.formItemLast}>
              <Text>{formatMessage('setting.app.info')}</Text>
              <Icon name="right" size={40} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {
        showModal === 'language' && (
          <Modal handleClose={handleCloseModal} displayType="bottom">
            <View>
              <View>
                <Text>English</Text>
                <Text>简体中文</Text>
              </View>
            </View>
          </Modal>
        )
      }
      {
        showModal === 'hiddenApp' && (
          <Modal handleClose={handleCloseModal} displayType="fullscreen">
            <Text>hiddenApp</Text>
          </Modal>
        )
      }
      {
        showModal === 'grayTest' && (
          <Modal handleClose={handleCloseModal} displayType="fullscreen">
            <View style={styles.grayTest}>
              <Gray16 />
            </View>
          </Modal>
        )
      }
      {
        showModal === 'appInfo' && (
          <Modal handleClose={handleCloseModal} displayType="center" showFooter>
            <Text>appInfo</Text>
          </Modal>
        )
      }
    </View>
  );
};

export default observer(Setting);
