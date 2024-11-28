Page({
  data: {
    nickname: '',
    birthDate: '',
    daysSinceBirth: null,
    ageYears:null,
    ageMonths:null,
    daysToNextBirthday:null,
    hasData: false
  },

  onLoad: function() {
    // 读取本地存储的数据
    const nickname = wx.getStorageSync('nickname');
    const birthDate = wx.getStorageSync('birthDate');
    if (nickname && birthDate) {
      this.setData({
        nickname,
        birthDate,
      });
      this.calculateDaysSinceBirth(birthDate);
    }
  },

  onNameInput: function(e) {
    this.setData({
      nickname: e.detail.value
    });
  },

  onDateChange: function(e) {
    this.setData({
      birthDate: e.detail.value
    });
  },

  onConfirm: function() {
    const { nickname, birthDate } = this.data;
    if (!nickname || !birthDate) {
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none'
      });
      return;
    }

    // 保存到本地存储
    wx.setStorageSync('nickname', nickname);
    wx.setStorageSync('birthDate', birthDate);

    this.calculateDaysSinceBirth(birthDate);

  },

  calculateDaysSinceBirth: function(birthDate) {
    const currentDate = new Date();
    const birth = new Date(birthDate);
    if (birth > currentDate) {
      wx.showToast({
        title: '宝宝还未出生哦，请查看其他功能！',
        icon: 'none',
        duration: 2000  // 持续2秒
      });
      this.setData({
        hasData: false
      });
      return;  // 阻止后续逻辑
    }
    const timeDiff = currentDate - birth;
    const daysSinceBirth = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let ageYears = currentDate.getFullYear() - birth.getFullYear();
    let ageMonths = currentDate.getMonth() - birth.getMonth();
    if (ageMonths < 0 || (ageMonths === 0 && currentDate.getDate() < birth.getDate())) {
      ageYears--;
      ageMonths += 12;
    };
    const nextBirthday = new Date(birth.getFullYear() + ageYears + 1, birth.getMonth(), birth.getDate());
    const daysToNextBirthday = Math.ceil((nextBirthday - currentDate) / (1000 * 60 * 60 * 24));

    this.setData({
      daysSinceBirth,
      ageYears,
      ageMonths,
      daysToNextBirthday,
      hasData: true
    });
  },
  clearData() {
    wx.removeStorageSync('nickname');
    wx.removeStorageSync('birthDate');
    this.setData({
      nickname: '',
      birthDate: '',
      daysSinceBirth: 0,
      ageYears:0,
      ageMonths:0,
      daysToNextBirthday:0,
      hasData: false
    });
    wx.showToast({
      title: '信息已清除',
      icon: 'success',
      duration: 500
    });
  },
  onShareTimeline: function() {
    return {
    };
  }
});