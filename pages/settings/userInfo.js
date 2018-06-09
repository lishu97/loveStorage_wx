// pages/settings/userInfo.js
const app = getApp();
import { host } from '../../common/const.js';
Page({
  data: {
    my_userInfo: {},
    userInfo: {},
    host
  },
  onShow: function (options) {
    this.setData({
      my_userInfo: app.globalData.my_userInfo,
      userInfo: app.globalData.userInfo
    })
  }
})