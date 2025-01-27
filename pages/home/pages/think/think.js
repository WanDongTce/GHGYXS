const network = require("../../../../utils/main.js");
const app = getApp();
// console.log(app);
var page = 1;
var hasmore = null;
var search = '';
var nianji = 0;
var kemu = 0;
var version = 0;
var ceshu = 4;

Page({
    data: {
      show: {
        middle: false
      },
        base: '../../../../',
        isShowOptions: false,
        list: [],
        showEmpty: false
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
        this.empty = this.selectComponent("#empty");
        this.studyFilter = this.selectComponent("#studyFilter");
    },
    onShow: function () {
        var that = this;
        that.getContList(true);
    },
    getContList: function (contaFlag) {
        var that = this;
        network.POST({
            url: 'v14/study/course-ware-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token,
                "page": page,
                "type": 2,
                "search": search,
                "nianji": nianji,
                "kemu": kemu,
                "version": version,
                "ceshu": ceshu
            },
            success: function (res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var b = res.data.data[0].list;
                    if (contaFlag) {
                        var a = that.data.list.concat(b);
                        that.setData({
                            list: a,
                            showEmpty: a.length == 0? true : false
                        });
                    } else {
                        that.setData({
                            list: b,
                            showEmpty: b.length == 0 ? true : false
                        });
                    }
           
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
        if (!this.data.isShowOptions && this.data.list.length > 0) {
            if (hasmore) {
                page++;
                this.getContList(true);
            } else {
                wx.showToast({
                    title: '没有更多了',
                    icon: 'none',
                    duration: 1000
                })
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

  onHide: function () {
    this.setData({
      show: {
        middle: false
      }
    });
  },
    showOptions() {
        this.setData({
            isShowOptions: true
        })
    },
    filterCallBack(e) {
        var a = e.detail;
        page = 1;
        search = a.search;
        nianji = a.nianji;
        kemu = a.kemu;
        version = a.version;
        ceshu = a.ceshu;
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });
        this.setData({
            isShowOptions: false
        });
        this.getContList(false);
    },
    toDetail(e) {
      var a = e.currentTarget.dataset;
      // console.log(a);
      var start_time = Date.parse(new Date()) / 1000;
      var end_time = start_time + 5;
      network.getAddStudyRecord(2, a.id, start_time, end_time, function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/common/webView/webView?src=' + a.href + '&getpointype=2&studyid=' + a.id
          })
        }
        else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          })
        }
      }, function () {
        wx.hideLoading();
        wx.showToast({
          title: '服务器异常',
          icon: 'none',
          duration: 1000
        });
      });
    },
    memberExpires(e) {
        var that = this;
        network.memberExpires(function (res) {
          that.toggle('middle');
        },function(res){

        });
    },
    onUnload: function () {
        page = 1;
        hasmore = null;
        search = '';
        nianji = 0;
        kemu = 0;
        version = 0;
        ceshu = 4;
        this.setData({
            nianji: 0,
            kemu: 0,
            version: 0,
            ceshu: 4,
            showEmpty: false
        });
    }
})