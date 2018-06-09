// pages/select/plan/plan.js
import { host } from '../../../common/const.js'
const app = getApp();
Page({
  data: {
    userInfo: {},
    my_userInfo: {},
    relationInfo: {},
    planList: [],
    hasPlan: false,
  },
  onShow: function () {
    this.setData({
      relationInfo: app.globalData.relationInfo,
      userInfo: app.globalData.userInfo,
      my_userInfo: app.globalData.my_userInfo
    })
    this.sendPlanListRequest(this, this.data.relationInfo.relationId);
  },
  sendPlanListRequest: function (that, relationId) {
    wx.request({
      url: `http://${host}/api/plan?relationId=${relationId}`,
      success: res => {
        if (res.data.msg === '没有记录') {
          return
        }
        that.setData({
          hasPlan: true,
          planList: res.data.data.planList
        });
      }
    })
  },
  changePlanStatus: function(e) {
    const planId = e.currentTarget.id;
    const planStatus = this.data.planList.filter((item) => {
      return item.planId === planId;
    })[0].planStatus;
    wx.request({
      url: `http://${host}/api/update_plan`,
      data: {
        relationId: this.data.relationInfo.relationId,
        planId: planId,
        operation: planStatus ? 'todo' : 'finished'
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code === 0) {
          wx.showModal({
            title: '修改结果',
            content: '修改计划完成状态成功',
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '修改结果',
            content: '修改计划完成状态失败',
            showCancel: false,
            success: () => {
              const oldPlanList = [];
              this.data.planList.forEach((item) => {
                if(item.planId === planId) {
                  item.planStatus === 1 ? 0 : 1;
                }
                oldPlanList.push(item);
              })
              this.setData({
                planList: oldPlanList
              })
            }
          })
        }
      }
    })
  },
  deletePlan: function (e) {
    const planId = e.currentTarget.id;
    wx.request({
      url: `http://${host}/api/delete_plan`,
      data: {
        relationId: this.data.relationInfo.relationId,
        planId
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code === 0) {
          let hasPlan = true;
          if (this.data.planList.length == 1) {
            hasPlan = false;
          }
          this.setData({
            planList: this.data.planList.filter((item) => {
              return item.planId != e.currentTarget.id;
            }),
            hasPlan
          })
        }
      }
    })
  },
  addPlan: function () {
    wx.navigateTo({
      url: './addplan',
    })
  }
})