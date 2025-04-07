import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Image, Text, TouchableOpacity, NativeModules, ToastAndroid } from 'react-native';
import Store from '../../store';
import styles from './styles';

const { _BookManager } = NativeModules;

const Book = (props) => {
  const { book, handleBookInfo } = props;
  const { rootStore } = useContext(Store);

  const handleOpenBook = (book) => {
    _BookManager.openBook(book.path).catch((e) => {
      console.info('info: open error: ', e);
      if (e.message === 'NoKoreader') {
        ToastAndroid.show(rootStore.formatMessage('book.no.koreader'), ToastAndroid.SHORT); 
      }
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => handleOpenBook(book)}
        onLongPress={() => handleBookInfo(book)}
      >
        <View style={styles.book}>
          {
            book.coverReady ? (
              <Image
                source={{ uri: `file://${book.cover}` }}
                style={{ ...styles.cover, width: rootStore.bookWidth }}
                resizeMode="cover"
              />
            ) : (
              <View style={{ ...styles.cover, width: rootStore.bookWidth }} />
            )
          }
          <View style={styles.info}>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {book.name.split('.')[0]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default observer(Book);
