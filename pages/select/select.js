// page/select/select.js
const app = getApp()
Page({
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.relationInfo && app.globalData.relationInfo.relationId) {
      return;
    }
    wx.showModal({
      title: '请先绑定情侣',
      content: '点击确定将跳转到情侣绑定界面',
      success: (res) => {
        if(res.confirm) {
          wx.navigateTo({
            url: '../settings/bindLover',
          });
        }
      }
    })
  },
})