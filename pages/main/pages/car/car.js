const network = require("../../../../utils/main.js");
const app = getApp();
var len = 0;

Math.formatFloat = function (f, digit) {
  var m = Math.pow(10, digit);
  return parseInt(f * m, 10) / m;
}

Page({
  data: {
    checkedList: [],
    list: [],
    showEmpty: false,
    priceAll: 0,
    isAll: true,
    cartCount: 0,
    url: '',
    numall:"",
    editIndex: 0,
    delBtnWidth: 60
  },
  topshoop: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    this.empty = this.selectComponent("#empty");
    this.peripheryBotmTab = this.selectComponent("#peripheryBotmTab");
    this.compontNavbar = this.selectComponent("#compontNavbar");
    // console.log(options)
  },
  onShow: function () {
    var that = this;
    that.getList();
    that.getCartCount();
    wx.request({
      url: app.requestUrl + 'v13/user-address/list',
      data: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "app_source_type": app.app_source_type
      },
      success: function (res) {
        console.log(res)
        for (var i = 0; i < res.data.data[0].list.length; i++) {
          if (res.data.data[0].list[i].is_default == 2) {
            console.log(res.data.data[0].list[i])
            wx.setStorageSync('receivingAddress', res.data.data[0].list[i])
          }
        }
      }
    })
  },
  selectGoods: function (e) {
    var that = this;
    var isAll = null;
    var priceAll = null;
    var idx = e.currentTarget.dataset.index;
    var clist = that.data.checkedList;
    var list = that.data.list;
  
    list[idx].checked = !list[idx].checked;
    for (var i = 0; i < list[idx].goods_list.length; i++) {
      var id = list[idx].goods_list[i].id;
      list[idx].goods_list[i].checked = list[idx].checked;
      if (list[idx].goods_list[i].checked) {
        clist.push(id);
      } else {
        clist = clist.filter((item) => {
          // console.log(item)
          if (item != id) return item;
        });
      }
    }
    isAll = clist.length == len ? true : false;
    priceAll = that.getTotalPrice(list);
 
    var hh = 0
    var flg = true
    for (var i = 0; i < list.length; i++) {
      var list_sun = list[i].goods_list
      for (var y = 0; y < list_sun.length; y++)
        if (flg == list_sun[y].checked) {
          var num = list_sun[y].num
          hh = hh + num
        }
    }
    that.setData({
      list: list,
      checkedList: clist,
      priceAll: priceAll,
      isAll: isAll,
      numall: hh
    });
  },
  selectGoods_new: function (e) {
    var that = this;
    var a = e.currentTarget.dataset;
    var clist = that.data.checkedList;
    var list = that.data.list;
    var count = 0;
    var priceAll = null;
    var isAll = null;
    var id = list[a.idx].goods_list[a.index].id;
    list[a.idx].goods_list[a.index].checked = !list[a.idx].goods_list[a.index].checked;
    if (list[a.idx].goods_list[a.index].checked) {
      clist.push(id);
      for (var i = 0; i < list[a.idx].goods_list.length; i++) {
        if (list[a.idx].goods_list[i].checked) {
          count++;
        }
      }
      if (count == list[a.idx].goods_list.length) {
        list[a.idx].checked = true;
      }
    } else {
      list[a.idx].checked = false;
      clist = clist.filter((item) => {
        if (item != id) return item;
      });
    }

    isAll = clist.length == len ? true : false;
    priceAll = that.getTotalPrice(list);
    var hh=0
    var flg=true
    for(var i=0;i<list.length;i++){
      var list_sun = list[i].goods_list
      for (var y = 0; y < list_sun.length;y++)
        if (flg == list_sun[y].checked){
          var num = list_sun[y].num
          hh=hh+num
        }
    }
    wx.setStorageSync("allnum", hh)
    that.setData({
      list: list,
      checkedList: clist,
      priceAll: priceAll,
      isAll: isAll,
      numall: hh
    });
  },
  getAllLength() {
    var list = this.data.list;

    //获取所有商品个数
    for (var j = 0; j < list.length; j++) {
      // console.log(list[j]);
      len += list[j].goods_list.length;
     
    }
   
    return len;
  },

  getTotalPrice(list) {
    var that = this;
    var a = 0;
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].goods_list.length; j++) {
        if (list[i].goods_list[j].checked) {
          a += list[i].goods_list[j].total;
          // console.log(list[i].goods_list[j].total)
        }
      }
    }
    // console.log(a)
    return a.toFixed(2);
  },
  switchAll() {
    var that = this;
    var isAll = that.data.isAll;
    var list = that.data.list;
    var a = 0;
    var b = [];

    for (var i = 0; i < list.length; i++) {
      list[i].checked = !isAll;
      for (var j = 0; j < list[i].goods_list.length; j++) {
        list[i].goods_list[j].checked = !isAll;
        if (!isAll) {
          a += list[i].goods_list[j].total;
          b.push(list[i].goods_list[j].id);
        }
      }
    }
    var hh = 0
    var flg = true
    for (var i = 0; i < list.length; i++) {
      var list_sun = list[i].goods_list
      for (var y = 0; y < list_sun.length; y++)
        if (flg == list_sun[y].checked) {
          var num = list_sun[y].num
          hh = hh + num
        }
    }
    that.setData({
      list: list,
      checkedList: b,
      priceAll:a,
      isAll: !isAll,
      numall: hh
    });
  },
  getList: function () {
    var that = this;
    network.POST({
      url: 'v13/shop-cart/list',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },
     
      success: function (res) {
        // console.log(app.userInfo.token)
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = res.data.data[0].list;
          console.log(a);
          var number = a.length
          console.log(a)
          if (number == 0) {
            that.setData({
              show: true,
              show_sun: false
            })
          } else {
            that.setData({
              show: false,
              show_sun: true
            })
          }
          var b = [];
          if (a.length > 0) {
            for (var i = 0; i < a.length; i++) {
              a[i].checked = true;
              for (var j = 0; j < a[i].goods_list.length; j++) {
                a[i].goods_list[j].checked = true;
                b.push(a[i].goods_list[j].id);
               
              }
            }
          }
          wx.setStorageSync('allnum', res.data.data[0].num_all)
          // console.log(that.getTotalPrice(a))
          that.setData({
            list: a,
            numall: res.data.data[0].num_all,
           
            checkedList: b,
            showEmpty: a.length == 0 ? true : false,
            isAll: a.length == 0 ? false : true,
            priceAll: that.getTotalPrice(a)
          });
          that.getAllLength();
          // console.log(that.data.list)
        } else {
          wx.showToast({
            title: res.data.message
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
  updateNum(id, num) {
    var that = this;
    network.POST({
      url: 'v13/shop-cart/up-num',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token,
        "id": id,
        "num": num,
       
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          var a = that.data.list;
          // console.log(that.data.list)
          // console.log(a);
          network.POST({
            url: 'v13/shop-cart/list',
            params: {
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token
            },

            success: function (res) {
              // console.log(app.userInfo.token)
              wx.hideLoading();
              if (res.data.code == 200) {
                var a = res.data.data[0].list;
                // console.log(a);
                var b = [];
                if (a.length > 0) {
                  for (var i = 0; i < a.length; i++) {
                    a[i].checked = true;
                    for (var j = 0; j < a[i].goods_list.length; j++) {
                      a[i].goods_list[j].checked = true;
                      b.push(a[i].goods_list[j].id);
                      // console.log(a[i].goods_list[j].num)
                    }
                  }
                }
                wx.setStorageSync('allnum', res.data.data[0].num_all)
                // console.log(that.getTotalPrice(a))
                that.setData({
                  list: a,
                  numall: res.data.data[0].num_all,

                  checkedList: b,
                  showEmpty: a.length == 0 ? true : false,
                  isAll: a.length == 0 ? false : true,
                  priceAll: that.getTotalPrice(a)
                });
                that.getAllLength();
                // console.log(that.data.list)
              } else {
                wx.showToast({
                  title: res.data.message
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
          a = a.map((item) => {
            // console.log(item);
            // var c = item.goods_list;
            item.goods_list = item.goods_list.map((im) => {
              // console.log(im);
              if (im.id == id) {
                im.num = res.data.data.num;
                im.total = im.num * im.price;
               
              }
              return im;
            });
            // console.log(item);
            return item;
          });
          // console.log(a);
          var b = that.getTotalPrice(a);
    
          // console.log(b);
          that.setData({
            list: a,
            priceAll: b
             
          });

          that.getCartCount();
        } else {
          wx.showToast({
            title: res.data.message
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
  modifNumClick(e) {
    // console.log(e)
    var that = this;
    var a = e.currentTarget.dataset;
 
    let num_all
   
    if (a.status == 1) {
      
      if (a.item.num > 1) {
       
        that.updateNum(a.item.id, --a.item.num);
        // console.log(a.item.num)
        num_all = wx.getStorageSync("allnum")
        num_all = num_all - 1
        wx.setStorageSync("allnum", num_all)
      }
    }

    if (a.status == 2) {
        var that = this;
      var totalnum;
      network.POST({
        url: 'v13/shop-goods/details',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "id":a.item.g_id
        },
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
         
          if (res.data.code == 200) {
            // console.log(res.data.data[0].item.total_num)
            totalnum = res.data.data[0].item.total_num
            if (a.item.num < totalnum) {
              that.updateNum(a.item.id, ++a.item.num);
              console.log(totalnum)
              num_all = wx.getStorageSync("allnum")
              num_all = num_all + 1
              wx.setStorageSync("allnum", num_all)
            } else {
              // that.updateNum(a.item.id, ++a.item.num);
              // // console.log(a)
              // num_all = wx.getStorageSync("allnum")
              // num_all = num_all + 1
              // wx.setStorageSync("allnum", num_all)
              wx.showToast({
                title: '已是最大库存',
                showCancel:false,
                duration: 1000,
                icon:"none"
              })
            }
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
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

      
     
  
      
    }

    that.setData({
      numall: num_all
    })
   
  },
  toComfirmOrder() {
    var that = this;
    var list = that.data.checkedList;
    if (list.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
      })
    } else {
      var ids = JSON.stringify(network.arrToObj(list));
   
      network.POST({
        url: 'v13/shop-order/go-buy',
        params: {
          "mobile": app.userInfo.mobile,
          "token": app.userInfo.token,
          "ids": ids
        },
        success: function (res) {
          // console.log(res);
          wx.hideLoading();
          if (res.data.code == 200) {
            wx.setStorageSync("goods", res.data.data[0]);

            wx.navigateTo({
              url: '/pages/home/pages/periphery/confirmOrder/confirmOrder?flag=2&ids=' + ids
            });
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
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
    }
  },
  getCartCount() {
    var that = this;
    network.POST({
      url: 'v13/shop-order/order-num',
      params: {
        "mobile": app.userInfo.mobile,
        "token": app.userInfo.token
      },
      success: function (res) {
        // console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            cartCount: res.data.data[0].cartcount
          });
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
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
  
  deleteGoods(e) {
    // console.log(e);
    var that = this;
    var id = {
      "0": e.currentTarget.dataset.id
    };
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          network.POST({
            url: 'v13/shop-cart/del',
            params: {
              "mobile": app.userInfo.mobile,
              "token": app.userInfo.token,
              "ids": JSON.stringify(id)
            },
            success: function (res) {
              // console.log(res);
              wx.hideLoading();
              if (res.data.code == 200) {
                wx.showToast({
                  title: '删除成功'
                });
                that.getList();
                that.getCartCount();
              } else {
                wx.showToast({
                  title: res.data.message
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
        }
      }
    })
  },
  onUnload: function () {
    this.setData({
      showEmpty: false
    });
  },
  tz_shangjia: function (e) {
    wx.navigateTo({
      url: '/pages/home/pages/ecology/businessDetail/businessDetail?businessid=' + e.currentTarget.dataset.businessid
    })
  },
  //手指刚放到屏幕触发
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    var that = this
    if (e.touches.length == 3) {
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 3) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      var a = e.currentTarget.dataset;
      var list = that.data.list;
      list[a.idx].goods_list[a.index].txtStyle = txtStyle;
      that.setData({
        list: list
      });
      

    }
  },
  touchE: function (e) {
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      var a = e.currentTarget.dataset;
      var list = that.data.list;
      list[a.idx].goods_list[a.index].txtStyle = txtStyle;
      that.setData({
        list: list
      });
    }
  },
})