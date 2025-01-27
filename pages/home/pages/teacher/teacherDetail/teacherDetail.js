const network = require("../../../../../utils/main.js");
const app = getApp();
var teacherid = '';
var pagesize = 20;
var page = 1;
var hasmore = '';

Page({
    data: {
      show: {
        middle: false
      },
        base: '../../../../../',
        IMGURL: app.imgUrl,
        curTabIndex: 0,
        detail: '',
        list: [],
        coursecount:0
    },
    tabFun: function (e) {
        // console.log(e);
        this.setData({
            curTabIndex: e.currentTarget.dataset.id
        });
    },
    onLoad: function (options) {
        teacherid = options.id;
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
    },
    onShow(){
        var that = this;
        that.getDetail();
        that.getList(); 
    },
    getDetail: function () {
        var that = this;
        network.POST({
            url: 'v13/nteacher/teacher-info',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "teacherid": teacherid
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        detail: res.data.data[0].item
                    });

                } else {

                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        })
    },
    getList: function (flag) {
        var that = this;
        network.POST({
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "pagesize": pagesize,
                "subjectid": '',
                "teacherid": teacherid,
                "search": '',
                "type": ''
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
              if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    var b = res.data.data[0].count;
                    if (flag) {
                        a = that.data.list.concat(a);
                    }
                    that.setData({
                        list: a,
                        coursecount:b,
                        showEmpty: a.length == 0 ? true : false
                    });

                    hasmore = res.data.data[0].hasmore;
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000
                    });
                }
            },
            fail: function () {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    onReachBottom: function () {
        var that = this;
        if (that.data.list.length > 0) {
            if (hasmore) {
                page++;
                that.getList();
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                });
            }
        }
    },
  //提示会员是否到期
  onTransitionEnd() {
    // console.log(`You can't see me 🌚`);
  },
  toggle(type) {
    this.setData({
      [`show.${type}`]: !this.data.show[type]
    });
  },

  togglePopup() {
    this.toggle('middle');
  },
  noBuy: function () {
    this.toggle('middle');
  },
  goBuy: function () {
    wx.navigateTo({
      url: '/pages/my/pages/memberRenewalNewPay/memberRenewalNewPay'
    });
  },
  //判断会员是否过期
  memberExpires(e) {
    var that = this;
    network.memberExpires(function (res) {
      that.toggle('middle');
    }, function (res) {
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.id
      })
    });
  },
  onHide: function () {
    this.setData({
      show: {
        middle: false
      }
    });
  },
    toCourseDetail: function (e) {
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.id
      })
    }
})