import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { View, Text, FlatList, Image, TouchableOpacity, NativeModules } from 'react-native';
import TopStatus from '../../components/top-status';
import NavitaionBar from '../../components/navigation-bar';
import Modal from '../../components/modal';
import Book from './Book';
import Store from '../../store';
import styles from './styles';

const { _BookManager } = NativeModules;

const BookHome = () => {
  const { rootStore } = useContext(Store);
  const {
    bookList,
    bookColumns,
    bookRows,
    bookPages,
    bookCurrentPage,
  } = rootStore;
  const [bookDetail, setBookDetail] = useState(false);

  const renderBookList = () => {
    if (bookList.length > 0) {
      return (
        <FlatList
          data={bookPages > 1 ? bookList.slice((bookCurrentPage - 1) * bookColumns * bookRows, bookColumns * bookRows * bookCurrentPage) : bookList}
          keyExtractor={(item) => item.name}
          numColumns={bookColumns}
          pagingEnable
          showHorizontalScrollIndicator={false}
          showVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
          renderItem={({ item, index }) => <Book book={item} index={index} handleBookInfo={() => setBookDetail(item)} />}
        />
      );
    } else {
      return (
        <View style={styles.empty}>
          <Text>{rootStore.formatMessage('book.empty.tip')}</Text>
        </View>
      );
    }
  };

  const handleDelete = () => {
    _BookManager.deleteBook(bookDetail.path);
    setBookDetail(false);
  };

  const handleRead = () => {
    _BookManager.openBook(bookDetail.path);
    setBookDetail(false);
  };

  return (
    <View style={styles.wrap}>
      <TopStatus />
      <View style={styles.main}>
        <NavitaionBar currentMenu="Book" />
        {
          rootStore.bookLoading ? (
            <View style={styles.empty}>
              <Text>{rootStore.formatMessage('book.loading.tip')}</Text>
            </View>
          ) : renderBookList()
        }
      </View>
      {
        bookDetail && (
          <Modal handleClose={() => setBookDetail(false)} displayType="center" style={styles.modal}>
            <View style={styles.modalBody}>
              <View style={styles.detail}>
                <Image
                  source={{ uri: `file://${bookDetail.cover}` }} 
                  style={styles.image}
                  resizeMode="cover"
                />
                <Text style={styles.name}>
                  {bookDetail.name}
                </Text>
              </View>
              <View style={styles.action}>
                <TouchableOpacity onPress={handleDelete}>
                  <Text>{rootStore.formatMessage('delete')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRead}>
                  <Text>{rootStore.formatMessage('read')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )
      }
    </View>
  );
};

export default observer(BookHome);
