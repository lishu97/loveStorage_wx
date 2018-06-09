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
  },
  sendAnniversaryListRequest: function (that, relationId) {
    wx.request({
      url: `http://${host}/api/anniversary?relationId=${relationId}`,
      success: res => {
        if (res.data.msg === '没有记录') {
          return
        }
        that.setData({
          hasAnniversary: true,
          anniversaryList: res.data.data.anniversaryList
        });
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