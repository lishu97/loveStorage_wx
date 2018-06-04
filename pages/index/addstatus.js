import { host } from '../../common/const.js';
const app = getApp();
// pages/index/addstatus.js
Page({
  data: {
    statusContent: '',
    my_userInfo: {}
  },
  onLoad: function() {
    this.setData({
      my_userInfo: app.globalData.my_userInfo
    })
  },
  //获取input输入的值
  statusContent: function (e) {   
    this.setData({
      statusContent: e.detail.value
    })
  },
  formSubmit: function (e) {
    if(this.data.statusContent) {
      wx.request({
        url: `http://${host}/api/create_status`,
        method: 'post',
        data: {
          userId: this.data.my_userInfo.userId,
          statusContent: this.data.statusContent,
          statusTime: new Date()
        },
        success: res => {
          if (res.data.data.code === 0) {
            wx.navigateBack()
          }
        },
        fail: function () {
          wx.showModal({
            title: '保存失败',
            content: '请联系管理员解决此问题',
            showCancel: false
          })
        }
      })
    } else {
      wx.showModal({
        title: '内容为空',
        content: '请输入内容后再保存',
        showCancel: false
      })
    }
    
  }
})