const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    list: [],
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  current: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.current;
    //改变tab状态 筛选列表
    that.getlist(type);
    that.setData({
      currentTab: type
    })
  },
  getlist: function (type) {
    var that = this
    wx.request({
      url: app.requestUrl + 'v9/activity/index',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        // "searchname": name,
        "app_source_type": app.app_source_type,
        "type": parseInt(type)
      },
      success: function (res) {

        console.log(res.data.data[0].list)
        that.setData({
          list: res.data.data[0].list
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  to_activity: function (event) {
    var postad = event.currentTarget.dataset.postad;
    var title = event.currentTarget.dataset.title;
    var that = this;
    console.log(postad, ' that.data.currentTab: ', that.data.currentTab)
    wx.navigateTo({
      url: `/pages/ailangdu/pages/activity/activity?id=${postad}&type=${that.data.currentTab}&title=${title}`
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //录音多步返回
    this.getlist(1);
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})