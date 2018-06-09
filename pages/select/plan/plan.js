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
  sendPlanListRequest: function (that, relationId) {
    wx.request({
      url: `http://${host}/api/plan?relationId=${relationId}`,
      success: res => {
        if (res.data.msg === '没有记录') {
          return
        }
        const planListFormated = [];
        res.data.data.planList.forEach(item => {
          item.planTime = item.planTime.split(' ')[0]
          planListFormated.push(item);
        })

        that.setData({
          hasPlan: true,
          planList: planListFormated
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
  deleteConfirm: function (e) {
    wx.showModal({
      title: '警告',
      content: '删除后无法恢复，是否继续',
      success: (res) => {
        if (res.confirm) {
          this.deletePlan(e);
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