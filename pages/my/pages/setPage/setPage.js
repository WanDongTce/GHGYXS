// pages/setPage/setPage.js
Page({

  data: {
  
  },

  onLoad: function (options) {
  
  },
  exitLogin: function () {
    wx.clearStorageSync();
    wx.reLaunch({
      url: '/pages/common/login/login'
    })
  }

})