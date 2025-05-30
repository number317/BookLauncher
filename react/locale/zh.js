const common = {
  confirm: '确认',
  cancel: '取消',
  init: '初始化...',
  uninstall: '卸载',
  hide: '隐藏',
  show: '显示',
  setting: '设置',
  delete: '删除',
  read: '阅读',
};

const book = {
  'book.loading.tip': '书籍加载中...',
  'book.empty.tip': '/sdcard/Books 暂无书籍',
  'book.no.koreader': '未安装Koreader',
};

const app = {
  'app.list.reading': '读取应用列表中...',
};

const setting = {
  'setting.appmode.setting': '应用模式',
  'setting.appmode.book': '书架',
  'setting.appmode.simple': '极简',
  'setting.app.view': '应用视图',
  'setting.gray.test': '灰度测试',
  'setting.app.info': '应用信息',
  'setting.language.setting': '语言设置',
  'setting.app.reset': '重置应用',
  'setting.hello.text': '问候语',
};

export default {
  ...common,
  ...book,
  ...app,
  ...setting,
};
