import { NativeModules } from 'react-native';
import { useLocalObservable } from "mobx-react-lite"
import { getLocalData, setLocalData } from '../components/global-store';
import GlobalConfig from '../components/global-config';
import I18nMap from '../locale';

const { _LocalInfo, _AppManager, _BookManager } = NativeModules;

const {
  DEVICE_WIDTH,
  DEVICE_HEIGHT,
  NAVIGATION_BAR_WIDTH,
  LIST_CONTAINER_WIDTH,
  LIST_CONTAINER_HEIGHT,
  APP_CARD_WIDTH,
  APP_CARD_HEIGHT,
} = GlobalConfig;

const RootStore = () => useLocalObservable(() => ({
  hello: 'Hello world!',
  setHello(data) {
    this.hello = data;
  },
  appMode: '',
  setAppMode(data) {
    this.appMode = data;
  },
  batteryLevel: 0,
  setBatteryLevel(data) {
    this.batteryLevel = data;
  },
  isCharging: false,
  setIsCharging(data) {
    this.isCharging = data;
  },
  bookLoading: true,
  setBookLoading(data) {
    this.bookLoading = data;
  },
  bookList: [],
  setBookList(data) {
    this.bookList = data;
  },
  bookWidth: 0,
  setBooksWidth(data) {
    this.bookWidth = data;
  },
  async queryBookList() {
    this,this.setBookLoading(true);
    console.info('info: DEVICE_WIDTH', DEVICE_WIDTH);
    console.info('info: DEVICE_HEIGHT', DEVICE_HEIGHT);
    let booksEachLine;
    if (DEVICE_WIDTH <= 600) {
      booksEachLine = 3;
    } else if (DEVICE_WIDTH <= 800) {
      booksEachLine = 4;
    } else {
      booksEachLine = 6;
    }

    const booksWidth = Math.floor((LIST_CONTAINER_WIDTH - 3*2 - 3*booksEachLine*2) / booksEachLine);
    console.info('info: booksWidth', booksWidth);
    this.setBooksWidth(booksWidth);

    try {
      const booksStr = await _BookManager.getBookList();
      this.setBookList(JSON.parse(booksStr));
    } catch (error) {
      console.error('error: get books error ', error);
      this.setBookList([]);
    }
    this.setBookLoading(false);
  },
  appList: [],
  setAppList(data) {
    this.appList = data;
  },
  queryAppList() {
    _AppManager.getAppList(async (result) => {
      console.info('info: get app list', result);
      const cacheAppList = await getLocalData('appList') || [];
      const notCacheList = result.filter(x => !cacheAppList.some(y => y.packageName === x.packageName));
      cacheAppList.push(...notCacheList);
      this.setAppList(cacheAppList);

      const appCountPerLine = Math.floor(LIST_CONTAINER_WIDTH / APP_CARD_WIDTH);
      const appPaddingHorizontal = (DEVICE_WIDTH - appCountPerLine * APP_CARD_WIDTH - NAVIGATION_BAR_WIDTH) / 2;

      const appCountPerColumn = Math.floor(LIST_CONTAINER_HEIGHT / APP_CARD_HEIGHT);
      const appPaddingVertical = (DEVICE_HEIGHT - appCountPerColumn * APP_CARD_HEIGHT) / 2;

      const pageSizeApp = appCountPerLine * appCountPerColumn;

      this.setAppPageSize(pageSizeApp);
      this.setAppPadding([appPaddingHorizontal, appPaddingVertical]);
      this.setAppLoading(false);
    });
  },
  appLoading: true,
  setAppLoading(data) {
    this.appLoading = data;
  },

  appPadding: [],
  setAppPadding(data) {
    this.appPadding = data;
  },

  appPageSize: 0,
  setAppPageSize(data) {
    this.appPageSize = data;
  },

  currentAppPage: 1,
  setCurrentAppPage(data) {
    this.currentAppPage = data;
  },

  lang: '',
  setLang(data) {
    this.lang= data;
  },
  async queryLocalLang() {
    return new Promise(resolve => {
      _LocalInfo.getLocalLanguage((currentLang) => {
        this.setLang(currentLang);
        setLocalData('lang', currentLang);
        resolve();
      });
    });
  },
  formatMessage(key) {
    if (I18nMap[this.lang]) {
      return I18nMap[this.lang][key] || key;
    } else {
      return I18nMap.en[key] || key;
    }
  },
  queryCacheConfig() {
    return Promise.all([
      getLocalData('hello'),
      getLocalData('appMode'),
      getLocalData('lang'),
    ]);
  },
}));

export default RootStore;
