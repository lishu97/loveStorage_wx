import { host } from '../../../common/const.js';
const app = getApp();
// pages/index/addstatus.js
Page({
  data: {
    planTime: '',
    planContent: '',
    relationInfo: {}
  },
  onLoad: function () {
    this.setData({
      relationInfo: app.globalData.relationInfo
    })
  },
  //获取input输入的值
  planContent: function (e) {
    this.setData({
      planContent: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      planTime: e.detail.value
    })
  },
  formSubmit: function (e) {
    if (this.data.planContent) {
      if(this.data.planTime) {
        wx.request({
          url: `http://${host}/api/create_plan`,
          method: 'post',
          data: {
            relationId: this.data.relationInfo.relationId,
            planContent: this.data.planContent,
            planTime: this.data.planTime
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
          content: '请选择计划日期后再保存',
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