const network = require("../../../../utils/main.js");
const app = getApp();

Page({
    data: {
        base: '../../../../',
        IMGURL: app.imgUrl,
      showTab: true
    },
    onLoad: function (options) {
        this.compontNavbar = this.selectComponent("#compontNavbar");
      if (app.userInfo.mobile == '17688976688') {
        this.setData({
          showTab: false
        })
      }   
    }
})