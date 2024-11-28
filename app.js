// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
});
!function(){
  var PageTmp = Page;
 
  Page =function (pageConfig) {
 
    // 设置全局默认分享
    pageConfig = Object.assign({
      onShareAppMessage:function () {
        return {
        };
      }
    },pageConfig);
 
    PageTmp(pageConfig);
  };
}();