const network = require("../../../../utils/main.js");
const app = getApp();
var page = 1;
var hasmore = '';
Page({
    data: {
      show: {
        middle: false
      },
        base: '../../../../',
        title: '',
        imgUrls: [],
      flg: false,
        IMGURL: app.imgUrl,
        courselist: [],
        newsList: [],
        showEmpty: false,
        // title: 'A计划教育平台',
        isShowDialog: false,
        animationData: null,
        actyInfo: null,
       
        teacList: [],
        
        kemu: [],
       
        showEmpty: false,
      XBX: "",
      dictionary: "",
      homework: "",
      quality: "",
      space: "",
      book: "",
      bok: "",
      shop: "",
      accumulation: "",
        
        renew_content:'',
      showTab: true
        
    },
  setshow: function () {
    var that = this
    var header = wx.getStorageSync("header")
    var middle = wx.getStorageSync("middle")
    console.log(header.xbx)
    that.setData({
      XBX: header.xbx,
      dictionary: header.dictionary,
      homework: header.homework,
      space: header.space,
      quality: header.quality,
      book: middle.book,
      box: middle.box,
      shop: middle.shop,
      accumulation: middle.accumulation
    })
  },
    onLoad: function(options) {
        // console.log(app);     
        this.empty = this.selectComponent("#empty");
        this.compontNavbar = this.selectComponent("#compontNavbar");
        var that = this;
      that.setshow()
        that.getSwipImgs();
        this.setData({
            idname:app.idname
        });   
      if (app.userInfo.mobile == '17688976688') {
        this.setData({
          showTab: false
        })
      }        
    },
  more_new:function(){
    wx.navigateTo({
      url: '/pages/find/pages/news/news',
    })
  },
  more_sun:function(){
    wx.navigateTo({
      url: '/pages/home/pages/teacher/teacher',
    })
  },
    tz_little: function () {
        // console.log('111')
        wx.navigateToMiniProgram({
            appId: app.parAppId,
            path: '/pages/home/home',
            extraData: {},            
            success(res) {
                
            }
        })

    },
    onShow: function() {
        if (app.userInfo.register_community_name) {
            this.setData({
                title: app.userInfo.register_community_name
            })
        }
        
        
        wx.getSetting({
            success: (response) => {
                // console.log(response)
                // console.log(response.authSetting['scope.userLocation'])
                if (!response.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            // console.log('11111')
                            wx.getLocation({
                                type: 'wgs84',
                                success: function (res) {
                                    // console.log(res)
                                    app.longitude = res.longitude;
                                    app.latitude = res.latitude;

                                    // app.longitude = res.latitude;
                                    // app.latitude = res.longitude;
                                },
                            })

                        },
                        fail(){
                            // console.log('22222')
                        }
                    })
                } else {
                    wx.getLocation({
                        type: 'wgs84',
                        success: function (res) {
                            // console.log(res)
                            app.longitude = res.longitude;
                            app.latitude = res.latitude;
                        },
                    })

                }
            }
        })
    },
    init() {
        var that = this;
        
        that.getGoodsType();
        if (!app.allAddress) {
            network.getAllAdress();
        }
        if (!app.studyOptions) {
            that.getOptions();
        }
        that.getClassBarter();
        that.getNewsList();
        that.getCourseList();
        
        that.getTeacList();
        
        
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
  },
    judge:function(){
      var that = this;
      var token = wx.getStorageSync("userInfo")
      console.log(token)
      if (token == "") {

        this.setData({
          flg: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/home/pages/zuoyeNew/zuoyeNew',
        })
      }

        // wx.navigateTo({
        //     url: '/pages/home/pages/zuoyeEnter/zuoyeEnter',
        // })

        // network.POST({
        //     url: 'v14/renewal/check',
        //     params: {
        //         "mobile": app.userInfo.mobile,
        //         "token": app.userInfo.token,

        //     },
        //     success: function (res) {
        //         // console.log(res);
        //         wx.hideLoading();
        //         if (res.data.code == 200) {
        //             var a = res.data.data[0].item;

        //             if (a.is_end == 1) {
        //                 // console.log('111')
        //                 wx.navigateTo({
        //                     url: '/pages/home/pages/zuoyeJudge/zuoyeJudge',
        //                 })
        //             }
        //             else {
        //                 // console.log('222')
        //                 wx.navigateTo({
        //                     url: '/pages/home/pages/zuoyeEnter/zuoyeEnter',
        //                 })
        //             }

        //         } else {
        //             wx.showToast({
        //                 title: res.data.message,
        //                 icon: 'none',
        //                 duration: 1000
        //             });
        //         }
        //     },
        //     fail: function () {
        //         wx.hideLoading();
        //         wx.showToast({
        //             title: '服务器异常',
        //             icon: 'none',
        //             duration: 1000
        //         })
        //     }
        // });
        
    },

  course: function () {
    var that = this;
    var token = wx.getStorageSync("userInfo")
    console.log(token)
    if (token == "") {

      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/course/course?mytopid=0',
      })
    }
  },
  classmate: function () {
    var that = this;
    var token = wx.getStorageSync("userInfo")
    console.log(token)
    if (token == "") {

      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/classmate/classmate',
      })
    }
  },
  integralMall: function () {
    var that = this;
    var token = wx.getStorageSync("userInfo")
    console.log(token)
    if (token == "") {

      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/integralMall/integralMall',
      })
    }
  },

  teacherDetail: function (e) {
    var that = this;
    var token = wx.getStorageSync("userInfo")
    console.log(token)
    var id = e.currentTarget.dataset.id;
    if (token == "") {

      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: '/pages/home/pages/teacher/teacherDetail/teacherDetail?id='+id,
        
      })
    }
  },
  broadcast: function () {
    var that = this;
    var token = wx.getStorageSync("userInfo")
    console.log(token)
    if (token == "") {

      this.setData({
        flg: true
      })
    } else {
      wx.navigateTo({
        url: 'pages/home/pages/broadcast/broadcast',
      })
    }
  },
    
    
    //在线名师
    getTeacList: function() {
        var that = this;
        network.getTeacher(1, 1, function(res) {
            wx.hideLoading();
            var a = res.data.data[0].list;
            if (res.data.code == 200) {
                that.setData({
                    teacList: a,
                });
            } else {
                // wx.showToast({
                //     title: res.data.message,
                //     icon: 'none',
                //     duration: 1000
                // })
            }
        }, function() {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        });
    },
    //直播课程
    
    onReachBottom: function() {
        var that = this;
        
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
    getActy() {
        var that = this;
        network.getActy(function(res) {
            // console.log(res);
            that.setData({
                actyInfo: res.data.data[0].item
            });

            wx.hideTabBar();
            that.showDialog();
        });
    },
    getSwipImgs: function() {
        var that = this;
        network.getSwiperImgs(1, function(res) {
            // console.log(res);
            if (res.data.code == 200) {
                that.setData({
                    imgUrls: res.data.data[0].list
                });
                // console.log(that.data.imgUrls);

                that.init();
            }
            // else {
            //     wx.showToast({
            //         title: res.data.message,
            //         icon: 'none',
            //         duration: 1000
            //     })
            // }
        });
    
    },
    getNewsList: function() {
        var that = this;
        network.getNews(1, function(res) {
            wx.hideLoading();
            var a = res.data.data[0].list;
            console.log(a)
            if (res.data.code == 200) {
                that.setData({
                    newsList: a,
                    // showEmpty: a.length == 0 ? true : false
                });
            }
            // else {
            //     wx.showToast({
            //         title: res.data.message,
            //         icon: 'none',
            //         duration: 1000
            //     })
            // }
        }, function() {
            wx.hideLoading();
            wx.showToast({
                title: '服务器异常',
                icon: 'none',
                duration: 1000
            });
        });
    },
    
    getCourseList: function () {
        var that = this;
        network.POST({
            url: 'v13/ncourse/course-list',
            params: {
                "mobile": app.userInfo.mobile,
                // "token": app.userInfo.token,
                "page": 1,
                "pagesize": 20,
                "subjectid": '',
                "teacherid": '',
                "search": ''
            },
            success: function (res) {
                wx.hideLoading();
                // console.log(res);
                var a = res.data.data[0].list;
                if (res.data.code == 200) {
                    that.setData({
                        courselist: a,
                        showCourseEmpty: a.length == 0 ? true : false
                    });
                } 
                else {
                    // wx.showToast({
                    //     title: res.data.message,
                    //     icon: 'none',
                    //     duration: 1000
                    // });
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
    
    getOptions: function() {
        var that = this;
        network.POST({
            url: 'v14/public/conditions',
            params: {},
            success: function(res) {
                // console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0];
                    a.kemu.unshift({
                        id: 0,
                        title: '全部'
                    });
                    // console.log(a);
                    app.studyOptions = res.data.data[0];
                    // console.log(app.studyOptions);
                    that.setData({
                        kemu: res.data.data[0].kemu
                    });

                }
                // else {
                //     wx.showToast({
                //         title: res.data.message,
                //         icon: 'none',
                //         duration: 1000
                //     })
                // }
            },
            fail: function() {
                wx.showToast({
                    title: '获取public/conditions失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }, true);
    },
    
    getClassBarter: function() {
        network.POST({
            url: 'v14/easy-goods/type-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function(res) {
                // console.log(res);
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    a.unshift({
                        id: 0,
                        name: '全部'
                    });
                    app.classBarter = a;
                } else {
                    // wx.showToast({
                    //     title: res.data.message,
                    //     icon: 'none',
                    //     duration: 1000
                    // })
                }
            },
            fail: function() {
                wx.showToast({
                    title: '获取easy-goods/type-list失败',
                    icon: 'none',
                    duration: 1000
                })
            }
        }, true);
    },
    getGoodsType() {
        var that = this;
        network.POST({
            url: 'v14/shop-point/type-list',
            params: {
                "mobile": app.userInfo.mobile,
                "token": app.userInfo.token
            },
            success: function(res) {
                // console.log(res);
                wx.hideLoading();
                if (res.data.code == 200) {
                    var a = res.data.data[0].list;
                    a.unshift({
                        id: 0,
                        name: '全部'
                    });
                    // console.log(a);
                    app.goodsType = a;
                    that.getActy();
                } else {
                    // wx.showToast({
                    //     title: res.data.message,
                    //     icon: 'none',
                    //     duration: 1000
                    // })
                }
            },
            fail: function() {
                wx.hideLoading();
                wx.showToast({
                    title: '服务器异常',
                    icon: 'none',
                    duration: 1000
                })
            }
        });
    },
    showDialog: function() {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "ease-in-out",
            delay: 0
        });
        this.animation = animation;
        animation.scale(.5).step();
        this.setData({
            animationData: animation.export(),
            isShowDialog: true
        });
        setTimeout(function() {
            animation.scale(1).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200);
    },
    toActy() {
        var that = this;
        var a = that.data.actyInfo;

        this.closeDialog();

        if (a.type == 1) {
            if (a.typeid) {

                wx.navigateTo({
                    url: '/pages/home/pages/integralMall/integralMallDetail/integralMallDetail?id=' + a.typeid
                });
            } else {
                wx.navigateTo({
                    url: '/pages/home/pages/integralMall/integralMall'
                });
            }
            network.setActyCount(a.type, a.typeid, function(res) {
                // console.log(res);
            });
        }
    },
    closeDialog() {
        wx.showTabBar();
        this.setData({
            isShowDialog: false
        });
    },
    toH5(e) {
        var a = e.currentTarget.dataset;
        network.swipLink(a);
    },
    onUnload: function() {
        page = 1;
        hasmore = '';
        this.setData({
            showEmpty: false
        });
    },
    tz_signin:function(){
        wx.navigateTo({
            url: '/pages/home/pages/signin/signin'
        })
    },
    onPageScroll: function (ev) {
        
    },

    tz_detail: function (e) {
      var that = this;
      var token = wx.getStorageSync("userInfo")

      if (token == "") {

        this.setData({
          flg: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
        })
      }
    
    },
  memberExpires(e) {
    var that = this;
    network.memberExpires(function (res) {
      that.toggle('middle');
    }, function (res) {
      wx.navigateTo({
        url: '/pages/home/pages/courseList/courseDetail/courseDetail?courseid=' + e.currentTarget.dataset.myid + '&videopic=' + e.currentTarget.dataset.videopic,
      })
    });
  },
})