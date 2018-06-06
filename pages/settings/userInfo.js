// pages/settings/userInfo.js
const app = getApp();
import { host } from '../../common/const.js';
Page({
  data: {
    my_userInfo: {},
    host
  },
  onLoad: function (options) {
    if (app.globalData.my_userInfo) {
      this.setData({
        my_userInfo: app.globalData.my_userInfo
      })
    }
  }
})