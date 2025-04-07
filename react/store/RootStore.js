import { NativeModules } from 'react-native';
import { useLocalObservable } from "mobx-react-lite"
import { getLocalData, setLocalData } from '../components/global-store';
import GlobalConfig from '../components/global-config';
import I18nMap from '../locale';

const { _LocalInfo, _AppManager, _BookManager } = NativeModules;

const {
  DEVICE_WIDTH,
  LIST_CONTAINER_WIDTH,
  LIST_CONTAINER_HEIGHT,
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
    if (this.bookRows && this.bookColumns) {
      const pages = Math.ceil(this.bookList.length / this.bookColumns / this.bookRows);
      if (pages !== this.bookPages) {
        this.setBookPages(pages);
      }
      if (pages === 1) {
        this.setBookCurrentPage(1);
      }
    }
  },
  bookWidth: 0,
  setBookWidth(data) {
    this.bookWidth = data;
  },
  bookColumns: 0,
  setBookColumns(data) {
    this.bookColumns = data;
  },
  bookRows: 0,
  setBookRows(data) {
    this.bookRows = data;
  },
  bookPages: 0,
  setBookPages(data) {
    this.bookPages = data;
  },
  bookCurrentPage: 1,
  setBookCurrentPage(data) {
    this.bookCurrentPage = data;
  },
  async queryBookList() {
    if (this.bookList.length > 0) {
      return;
    }
    this,this.setBookLoading(true);
    let columns;
    if (DEVICE_WIDTH <= 600) {
      columns = 3;
    } else if (DEVICE_WIDTH <= 800) {
      columns = 4;
    } else {
      columns = 6;
    }

    this.setBookColumns(columns);
    // (list_width - padding * 2) / ((border + margin) * 2 * columns))
    const width = Math.floor((LIST_CONTAINER_WIDTH - 3*2 - 4*columns*2) / columns);
    const height = Math.floor(width * 4/3);
    const rows = Math.floor((LIST_CONTAINER_HEIGHT - 3) / (height + 4 * 2));
    
    try {
      const books = await _BookManager.getBookList();
      this.setBookList(books);

      if (rows * columns < books.length) {
        this.setBookPages(Math.ceil(books.length / (rows * columns)));
        console.info('info: bookPages', this.bookPages);
      } else {
        this.setBookPages(1);
      }

      this.setBookRows(rows);
      this.setBookWidth(width);
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
      const cacheAppList = await getLocalData('appList') || [];
      const notCacheList = result.filter(x => !cacheAppList.some(y => y.packageName === x.packageName));
      cacheAppList.push(...notCacheList);
      this.setAppList(cacheAppList);

      const columns = Math.floor((LIST_CONTAINER_WIDTH - 3*2) / (80 + 4 * 2));
      const size = Math.floor((LIST_CONTAINER_WIDTH - 3*2) / columns) - 8;
      const rows = Math.floor((LIST_CONTAINER_HEIGHT - 3) / (size + 4 * 2));

      const pageSizeApp = columns * rows;
      const pages = Math.ceil(this.appList.length / pageSizeApp);

      console.info('info: columns, row', columns, rows);
      this.setAppRows(rows);
      this.setAppColumns(columns);
      this.setAppCardSize(size);
      this.setAppPages(pages);
      this.setAppLoading(false);
    });
  },
  appLoading: true,
  setAppLoading(data) {
    this.appLoading = data;
  },
  appCardSize: 0,
  setAppCardSize(data) {
    this.appCardSize = data;
  },

  appRows: 0,
  setAppRows(data) {
    this.appRows = data;
  },

  appColumns: 0,
  setAppColumns(data) {
    this.appColumns = data;
  },

  appPages: 0,
  setAppPages(data) {
    this.appPages = data;
  },

  appCurrentPage: 1,
  setAppCurrentPage(data) {
    this.appCurrentPage = data;
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
  async changeLang(lang) {
    this.setLang(lang); 
    setLocalData('lang', lang);
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
