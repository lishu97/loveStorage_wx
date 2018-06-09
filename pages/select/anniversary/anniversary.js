// pages/select/anniversary/anniversary.js
import { host } from '../../../common/const.js'
const app = getApp();
Page({
  data: {
    userInfo: {},
    my_userInfo: {},
    relationInfo: {},
    anniversaryList: [],
    hasAnniversary: false,
  },
  onShow: function () {
    this.setData({
      relationInfo: app.globalData.relationInfo,
      userInfo: app.globalData.userInfo,
      my_userInfo: app.globalData.my_userInfo
    })
    this.sendAnniversaryListRequest(this, this.data.relationInfo.relationId);
    if (this.data.my_userInfo) {
      return;
    }
    wx.showModal({
      title: '请先注册/绑定帐号',
      content: '否则将无法正常使用系统功能',
      showCancel: false,
      success: () => {
        wx.redirectTo({
          url: '../select',
        });
      }
    })
  },
  sendAnniversaryListRequest: function (that, relationId) {
    wx.request({
      url: `http://${host}/api/anniversary?relationId=${relationId}`,
      success: res => {
        if (res.data.msg === '没有记录') {
          return
        }
        const anniversaryListFormated = [];
        res.data.data.anniversaryList.forEach(item => {
          item.anniversaryTime = item.anniversaryTime.split(' ')[0]
          anniversaryListFormated.push(item);
        })
        that.setData({
          hasAnniversary: true,
          anniversaryList: anniversaryListFormated
        });
      }
    })
  },
  deleteConfirm: function (e) {
    wx.showModal({
      title: '警告',
      content: '删除后无法恢复，是否继续',
      success: (res) => {
        if (res.confirm) {
          this.deleteAnniversary(e);
        }
      }
    })
  },
  deleteAnniversary: function (e) {
    const anniversaryId = e.currentTarget.id;
    wx.request({
      url: `http://${host}/api/delete_anniversary`,
      data: {
        relationId: this.data.relationInfo.relationId,
        anniversaryId
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code === 0) {
          let hasAnniversary = true;
          if (this.data.anniversaryList.length == 1) {
            hasAnniversary = false;
          }
          this.setData({
            anniversaryList: this.data.anniversaryList.filter((item) => {
              return item.anniversaryId != e.currentTarget.id;
            }),
            hasAnniversary
          })
        }
      }
    })
  },
  addAnniversary: function () {
    wx.navigateTo({
      url: './addanniversary',
    })
  }
})