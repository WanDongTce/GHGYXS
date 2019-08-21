// pages/ailangdu//pages/index/index.js
const network = require("../../../../utils/main.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    current: 1, //推荐、热门
    list: [],
    hasmore: true,
    page: 1,
    currentSwiper: 0
 },
  //热门以及推荐
  changeTab: function(e){
    if(e){
      let type = e.currentTarget.dataset.type;
      this.setData({
        current: type,
        page: 1
      });
    }
    this.getList(false);
  },
  //list
  getList: function(more){
    let that = this;
    wx.request({
      url: app.requestUrl + 'v14/chinese/read-audio',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "app_source_type": app.app_source_type,
        "type": that.data.current,
        "page": that.data.page
      },
      success: function (res) {
        let hasMore = res.data.data[0].hasmore;
        // console.log(hasMore);
        if (!more){
          that.setData({
            list: res.data.data[0].list,
            hasmore: hasMore,
            page: hasMore ? that.data.page + 1 : that.data.page
          })
        } else if(that.data.hasmore){
          that.setData({
            list: that.data.list.concat(res.data.data[0].list),
            hasmore: hasMore,
            page: hasMore ? that.data.page + 1 : that.data.page
          })
        }
      }
    });
  },
  //去听一听
  toListen: function (e) {
    var luyin_id = e.currentTarget.dataset.luyin;
    var luyin_praisenum = e.currentTarget.dataset.praisenum;
    var audio_id = e.currentTarget.dataset.audio;
    wx.navigateTo({
      url: "/pages/ailangdu/pages/listen/listen?id=" + luyin_id + "&good=" + luyin_praisenum + "&scid=" + audio_id
    })
  },
  // swiper
  change: function (e) {
    console.log(e.detail.current);
    this.setData({
      currentSwiper: e.detail.current
    });
  },
  //banner列表
  getSwipImgs: function () {
    var that = this;
    //正式使用改成11 爱朗读
    network.getSwiperImgs(11, function (res) {
      if (res.data.code == 200) {
        console.log(res.data.data[0].list);
        that.setData({
          imgUrls: res.data.data[0].list
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSwipImgs();
    this.getList();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList(true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})