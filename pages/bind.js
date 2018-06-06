// pages/bind.js
import util from '../common/util.js';
import {host, regExp} from '../common/const.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operation: 'signUp',
    warn: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  radioChange: function () {
    if(this.data.operation === 'signUp') {
      this.setData({
        operation: 'bind'
      })
    } else {
      this.setData({
        operation: 'signUp'
      })
    }
  },
  // bindDateChange: function (e) {
  //   this.setData({
  //     date: e.detail.value
  //   })
  // },
  formSubmit: function (e) {
    this.setData({ warn: '' });
    if(this.data.operation === 'signUp') {
      // 注册
      const { username, password, passwordCheck, nickname } = e.detail.value;
      if (!regExp.username.test(username)) {
        wx.showModal({
          title: '错误',
          content: '用户名不合法！',
          showCancel: false
        })
        return;
      } else if (!regExp.password.test(password)) {
        wx.showModal({
          title: '错误',
          content: '密码不合法！',
          showCancel: false
        })
        return;
      } else if (password !== passwordCheck) {
        wx.showModal({
          title: '错误',
          content: '两次密码输入不一致！',
          showCancel: false
        })
        return;
      }
      this.sendSignUpRequest(this, username, password, nickname, this.sendBindRequest);
    } else {
      // 绑定
      const { username, password } = e.detail.value;
      if (!regExp.username.test(username)) {
        wx.showModal({
          title: '错误',
          content: '用户名不合法！',
          showCancel: false
        })
        return;
      } else if (!regExp.password.test(password)) {
        wx.showModal({
          title: '错误',
          content: '密码不合法！',
          showCancel: false
        })
        return;
      }
      this.sendBindRequest(this, username, password, app.globalData.openId);
    } 
  },
  sendSignUpRequest: function (that, username, password, nickname, cb) {
    wx.request({
      url: 'http://' + host + '/api/sign_up',
      data: {
        username,
        password,
        nickname
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code === 1) {
          wx.showModal({
            title: '注册失败',
            content: res.data.msg,
          })
          return;
        }
        app.globalData.my_userInfo = res.data.data.userInfo;
        wx.showModal({
          title: '注册成功',
          content: '点击确定将自动绑定该帐号',
          success: (res) => {
            if(res.confirm) {
              cb && cb(that, username, password, app.globalData.openId)
            }
          }
        })        
      }
    })
  },
  sendBindRequest: function(that, username, password, openId) {
    wx.request({
      url: 'http://' + host + '/api/wx/bind',
      data: {
        username,
        password,
        openId
      },
      method: 'POST',
      success: (res) => {
        if (res.data.data.code === 1) {
          wx.showModal({
            title: '绑定失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        app.globalData.hasBinded = true;
        app.globalData.my_userInfo = res.data.data.userInfo;
        wx.showModal({
          title: '绑定结果',
          content: '绑定成功',
          showCancel: false,
          success: () => {
            wx.reLaunch({
              url: 'index/index',
            })
          }
        })
      }
    })
  } 
})