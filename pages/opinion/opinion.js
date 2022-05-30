// pages/feedback/feedback.js
let util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
      value: '',
      isputting: false
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        util.setSeason(that)
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
  
    },
  
    onput() {
      this.setData({
        isputting: true,
        value: ''
      })
      setTimeout(() => {
        this.setData({
          isputting: false
        })
      }, 2000)
  
    }
  })