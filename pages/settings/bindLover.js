// pages/settings/binding.js
import { host } from '../../common/const.js';
const app = getApp();
Page({
  data: {
    my_userInfo: {}
  },
  onLoad: function() {
    this.setData({
      my_userInfo: app.globalData.my_userInfo
    })
  },
  onShow: function() {
    if (this.data.my_userInfo) {
      return;
    }
    wx.showModal({
      title: '请先注册/绑定帐号',
      content: '否则将无法正常使用系统功能',
      showCancel: false,
      success: () => {
        wx.redirectTo({
          url: '../bind',
        });
      }
    })
  },
  formSubmit: function(e) {
    wx.request({
      url: 'http://' + host + '/api/update_relation',
      data: {
        loveId1: this.data.my_userInfo.loveId,
        loveId2: e.detail.value.loveId2,
        operation: 'start'
      },
      method: 'POST',
      success: (res) => {
        wx.showModal({
          title: '绑定结果',
          content: res.data.msg,
          showCancel: false,
          success: () => {
            wx.navigateBack();
          }
        })
        // 若绑定成功，向服务器请求到情侣信息
        if(res.data.data.code === 0) {
          app.globalData.relationInfo = res.data.data.relationInfo;
          const url = 'http://127.0.0.1:3000/api/lover_info?userId=' + this.data.my_userInfo.userId;
          wx.request({
            url: url,
            success: res => {
              app.globalData.loverInfo = res.data.data.lover;
            },
            fail: res => {
              wx.showModal({
                title: '绑定出错',
                content: '请联系管理员',
                showCancel: false
              })
            }
          })
        }
      },
      fail: (res) => {
        wx.showModal({
          title: '绑定失败',
          content: '服务器错误，请联系管理员',
          showCancel: false
        })
      }
    })
  }
})