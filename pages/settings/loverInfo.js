// pages/settings/loverInfo.js
const app = getApp();
import { host } from '../../common/const.js';
Page({
  data: {
    loverInfo: {},
    host
  },
  onLoad: function (options) {
    if(app.globalData.loverInfo) {
      this.setData({
        loverInfo: app.globalData.loverInfo
      })
    }
  },
  clickBut: function() {
    wx.showModal({
      title: '解除绑定',
      content: '确定要继续吗？',
      showCancel: true,
      success: (res) => {
        if(res.confirm) {
          this.sendUntieRequest();
        }
      }
    })
  },
  sendUntieRequest: function() {
    wx.request({
      url: 'http://' + host + '/api/update_relation',
      data: {
        loveId1: app.globalData.my_userInfo.loveId,
        loveId2: this.data.loverInfo.loveId,
        operation: 'stop'
      },
      method: 'POST',
      success: (res) => {
        wx.showModal({
          title: '解绑结果',
          content: res.data.msg,
          showCancel: false,
          success: () => {
            wx.navigateBack();
          }
        })
        // 若解绑成功，重置全局数据
        if (res.data.data.code === 0) {
          app.globalData.loverInfo = {};
        }
      },
      fail: (res) => {
        wx.showModal({
          title: '解绑失败',
          content: '服务器错误，请联系管理员',
          showCancel: false,
          success: () => {
            wx.navigateBack();
          }
        })
      }
    })
  }
})