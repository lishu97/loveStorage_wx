import { host } from '../../../common/const.js';
const app = getApp();
// pages/index/addstatus.js
Page({
  data: {
    anniversaryTime: '',
    anniversaryContent: '',
    relationInfo: {}
  },
  onLoad: function () {
    this.setData({
      relationInfo: app.globalData.relationInfo
    })
  },
  //获取input输入的值
  anniversaryContent: function (e) {
    this.setData({
      anniversaryContent: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      anniversaryTime: e.detail.value
    })
  },
  formSubmit: function (e) {
    if (this.data.anniversaryContent) {
      if (this.data.anniversaryTime) {
        wx.request({
          url: `http://${host}/api/create_anniversary`,
          method: 'post',
          data: {
            relationId: this.data.relationInfo.relationId,
            anniversaryContent: this.data.anniversaryContent,
            anniversaryTime: this.data.anniversaryTime
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
          title: '时间为空',
          content: '请选择纪念日期后再保存',
          showCancel: false
        })
      }
    } else {
      wx.showModal({
        title: '内容为空',
        content: '请输入内容后再保存',
        showCancel: false
      })
    }
  }
})