const common = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  init: 'init...',
  uninstall: 'uninstall',
  hide: 'hide',
  show: 'show',
  setting: 'setting',
  delete: 'Delete',
  read: 'Read',
};

const book = {
  'book.loading.tip': 'Loading book list...',
  'book.empty.tip': 'There is no books in /sdcard/Books',
  'book.no.koreader': 'Koreader is not installed',
};

const app = {
  'app.list.reading': 'reading app list...',
};

const setting = {
  'setting.appmode.setting': 'app mode',
  'setting.appmode.book': 'shelf',
  'setting.appmode.simple': 'simple',
  'setting.app.view': 'Apps View',
  'setting.gray.test': 'Gray Test',
  'setting.app.info': 'App Info',
  'setting.language.setting': 'Language Setting',
  'setting.app.reset': 'Reset App',
  'setting.hello.text': 'Hello',
};

export default {
  ...common,
  ...book,
  ...app,
  ...setting,
};
