const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
        info: '',
        msgCount: 0,
        showTab: true,
      homework: "",
      question: "",
      answer: "",
      note: "",
      course: "",
      correction: "",
      card: "",
      renew: "",
      extention: "",
      recommender: "",
      record: "",
      supervise: "",
      qualitysun: "",
      transaction: "",
      school: "",
      order: "",
      shop: "",
      gift: "",
      mine_study: "",
      mine_member: "",
      mine_order: "",
      mine_dayli: "",
    },
    onLoad(){
      var that=this
      that.setshow()
        this.compontNavbar = this.selectComponent("#compontNavbar");
      if (app.userInfo.mobile == '17688976688') {
        this.setData({
          showTab: false
        })
      }  
    },
  setshow: function () {
    var that = this

    var mine = wx.getStorageSync("mine")
    console.log(mine.mine_member.card)
    that.setData({
      homework: mine.mine_study.homework,
      question: mine.mine_study.question,
      answer: mine.mine_study.answer,
      note: mine.mine_study.note,
      course: mine.mine_study.course,
      correction: mine.mine_study.correction,
      card: mine.mine_member.card,
      renew: mine.mine_member.renew,
      extention: mine.mine_member.extention,
      recommender: mine.mine_member.recommender,
      record: mine.mine_money.record,
      supervise: mine.mine_dayli.supervise,
      qualitysun: mine.mine_dayli.quality,
      transaction: mine.mine_dayli.transaction,
      school: mine.mine_dayli.school,
      order: mine.mine_order.order,
      shop: mine.mine_order.shop,
      gift: mine.mine_order.gift,
      mine_study: mine.mine_study.mine_study,
      mine_member: mine.mine_member.mine_member,
      mine_money: mine.mine_money.mine_money,
      mine_dayli: mine.mine_dayli.mine_dayli,
      mine_order: mine.mine_order.mine_order
    })
  },
  loginshow: function () {
    var that = this;
    var token = wx.getStorageSync("userInfo")

    if (token == "") {
      this.setData({
        flg: true
      })
    }
  },
    onShow: function () {
        // console.log(app);
        var that = this;
      that.loginshow()
        that.getUserInfo(); 
        that.getMsg();
    },
    getUserInfo: function () {
        var that = this;
        network.getUserInfo(function(res){
            // console.log(res);
            wx.hideLoading();
            if (res.data.code == 200) {
                var a = res.data.data[0].item;
                that.setData({
                    info: a
                });
            } else {
                // wx.showToast({
                //     title: res.data.message,
                //     icon: 'none',
                //     duration: 1000
                // });
            }
        });
    },
  tolgon: function () {
    var that = this
    wx.navigateTo({
      url: '/pages/common/login/login',
    })
    that.setData({
      flg: false
    })
  },

  nonelgon: function () {
    var that = this

    that.setData({
      flg: false
    })
    console.log(111)
    wx.switchTab({
      url: '/pages/main/pages/home/home'
    });
  },
    getMsg(){
        var that = this;
        network.POST({
            url: 'v9/message/read',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function (res) {
                // console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0].item;
                    that.setData({
                        msgCount: a.message
                    });
                } else {
                    console.log(res.data.message);
                }
            },
            fail: function (err) {
                console.log(err);
            }
        }, true);
    },
    toInfo(e) {
        // console.log(app);
        if (app.userInfo.step == 8) {
            // wx.navigateTo({
            //     url: '/pages/my/pages/personInfo/personInfo'
            // });
            wx.navigateTo({
                url: '/pages/my/pages/setPage/setPage'
            });
        } else {
            wx.navigateTo({
                //url: '/pages/login/presonalInfo/presonalInfo'
              url: '/pages/my/pages/setPage/setPage'
            });
        }

    },
    toNote:function(){
      wx.navigateTo({
          url: '/pages/my/pages/myMsgNew/myMsgNew'
      });
        // wx.navigateTo({
        //     url: '/pages/my/pages/myMsg/myMsg'
        // });
    },
    toTuiguang:function(e){
        wx.navigateTo({
            url: '/pages/my/pages/tuiguangNew/tuiguangNew'
        });
    },
    toRecharge() {
        wx.showToast({
            title: '敬请期待',
            icon: 'none'
        });
        // wx.navigateTo({
        //     url: '/pages/my/recharge/recharge'
        // })
    },
    toMemberRenewal(){
        wx.navigateTo({
            url: '/pages/my/pages/memberRenewalNew/memberRenewalNew'
        })
    },
    toIntegarl(){
        var that = this;
        wx.navigateTo({
            url: '/pages/my/pages/myIntegarl/myIntegarl?score=' + that.data.info.score
        })
    },
    toMyAns(){
        wx.navigateTo({
            url: '/pages/common/webView/webView?src=' + app.ansHref + '&uid=' + app.userInfo.id + '&miniPro=1'
        });
    }
})