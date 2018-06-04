// pages/settings/loverInfo.js
const app = getApp();
import { host } from '../../common/const.js';
Page({
  data: {
    loverInfo: {},
    host: host
  },
  onLoad: function (options) {
    if(app.globalData.loverInfo) {
      this.setData({
        loverInfo: app.globalData.loverInfo
      })
    }
  }
})