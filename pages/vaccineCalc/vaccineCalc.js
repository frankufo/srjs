// pages/vaccineCalc/vaccineCalc.js
Page({
  data: {
    birthDate: '',
    vaccineSchedule: [],
  },

  onShow() {
    // 获取存储的出生日期
    const birthDate = wx.getStorageSync('birthDate');
    if (birthDate) {
      this.setData({
        birthDate: birthDate,
        vaccineSchedule: this.calculateVaccineSchedule(new Date(birthDate))
      });
    }
    else{
      this.setData({
        birthDate: birthDate,
        vaccineSchedule: []
      });
    }
  },

  // 计算疫苗接种时间
  calculateVaccineSchedule(birthDate) {
    const schedule = [];
    const vaccines = [
        { name: '乙肝疫苗（1/3）', offsetMonths: 0, isFree: true,note:"出生24小时内接种" }, // 出生
        { name: '卡介苗(1/1)', offsetMonths: 0, isFree: true, note:"出生24小时内接种" }, // 出生
        { name: '乙肝疫苗（2/3）', offsetMonths: 1 , isFree: true,note:"与第一剂间隔不超过2个月"}, // 1个月
        { name: '脊灰疫苗（1/4）', offsetMonths: 2 , isFree: true,note:"若接种五联疫苗，则无需接种"}, // 2个月
        { name: '五联疫苗（1/4）', offsetMonths: 2,note:"可代替白喉、破伤风、百日咳、脊灰、Hib，可少打8针" }, // 2个月
        { name: '十三价肺炎疫苗（1/4）', offsetMonths: 2,note:"≤4月龄接种" }, // 2个月
        { name: '口服五价轮状（1/3）', offsetMonths: 2,note:"6-12周内完成第一剂接种"}, // 2个月
        { name: '脊灰疫苗（2/4）', offsetMonths: 3 , isFree: true,note:"若接种五联疫苗，则无需接种"}, // 3个月
        { name: '百白破疫苗（1/4）', offsetMonths: 3 , isFree: true,note:"若接种五联疫苗，则无需接种"}, // 3个月
        { name: '五联疫苗（2/4）', offsetMonths: 3,note:"与第一针至少间隔一个月" }, // 3个月
        { name: '十三价肺炎疫苗（2/4）', offsetMonths: 3 ,note:"与第一剂间隔<22个月"}, // 3个月
        { name: '口服五价轮状（2/3）', offsetMonths: 3,note:"与第一剂间隔4-10周" }, // 3个月
        { name: '脊灰疫苗（3/4）', offsetMonths: 4, isFree: true,note:"若接种五联疫苗，则无需接种" }, // 4个月
        { name: '百白破疫苗（2/4）', offsetMonths: 4, isFree: true,note:"若接种五联疫苗，则无需接种" }, // 4个月
        { name: '五联疫苗（3/4）', offsetMonths: 4,note:"与第二针间隔至少1个月" }, // 4个月
        { name: '百白破疫苗（3/4）', offsetMonths: 5, isFree: true,note:"若接种五联疫苗，则无需接种" }, // 5个月
        { name: '十三价肺炎疫苗（3/4）', offsetMonths: 5 ,note:"6月龄内完成第三针"}, // 5个月
        { name: '口服五价轮状（3/3）', offsetMonths: 5,note:"最晚不超过8月龄接种" }, // 5个月
        { name: 'A群流脑疫苗（1/2）', offsetMonths: 6 , isFree: true,note:"打了A+C流脑结合疫苗可不用接种"}, // 6个月
        { name: '乙肝疫苗（3/3）', offsetMonths: 6 , isFree: true,note:"最晚不超过12月龄接种"}, // 6个月
        { name: '流感疫苗（可选）', offsetMonths: 6 }, // 6个月及以上
        { name: 'A+C流脑结合疫苗（1/2）', offsetMonths: 6,note:"可代替A群流脑疫苗" }, // 6个月
        { name: '手足口疫苗（1/2）', offsetMonths: 6,note:"6月龄后接种" }, // 6个月
        { name: '手足口疫苗（2/2）', offsetMonths: 7 ,note:"与第一剂间隔>1个月"}, // 7个月
        { name: '乙脑减毒活疫苗（1/2）', offsetMonths: 8, isFree: true,note:"≤12月龄内接种第一剂" }, // 8个月
        { name: '麻腮风疫苗（1/2）', offsetMonths: 8, isFree: true ,note:"苗王，副作用大"}, // 8个月
        { name: 'A群流脑疫苗（2/2）', offsetMonths: 9 , isFree: true,note:"打了A+C流脑结合疫苗可不用接种"}, // 9个月
        { name: 'A+C流脑结合疫苗（2/2）', offsetMonths: 9,note:"可代替A群流脑疫苗" }, // 9个月
        { name: '十三价肺炎疫苗（4/4）', offsetMonths: 12 ,note:"最晚15月龄前接种"}, // 12个月
        { name: '水痘疫苗（1/2）', offsetMonths: 12,note:"12月龄后尽快接种" }, // 12个月
        { name: '麻腮风疫苗（2/2）', offsetMonths: 18, isFree: true ,note:"苗王，副作用大"}, // 18个月
        { name: '百白破疫苗（4/4）', offsetMonths: 18, isFree: true,note:"若接种五联疫苗，则无需接种" }, // 18个月
        { name: '甲肝减毒活疫苗（1/1）', offsetMonths: 18, isFree: true ,note:"与甲肝灭火疫苗2选1"}, // 18个月
        { name: '甲肝灭活疫苗（1/2）', offsetMonths: 18,note:"与甲肝减毒活疫苗2选1，但是比其抗体持久" }, // 18个月
        { name: '五联疫苗（4/4）', offsetMonths: 18 ,note:"与第三剂间隔6个月"}, // 18个月
        { name: '乙脑减毒活疫苗（2/2）', offsetMonths: 24, isFree: true,note:"最迟3周岁内完成" }, // 2岁
        { name: '甲肝灭活疫苗（2/2）', offsetMonths: 24,note:"与甲肝减毒活疫苗2选1，但是比其抗体持久" }, // 2岁
        
        { name: 'A+C群多糖流脑疫苗（1/2）', offsetMonths: 36 , isFree: true,note:"与四价流脑结合疫苗、ACYW135群多糖流脑疫苗二选一"}, // 3岁
        { name: '四价流脑结合疫苗（1/1）', offsetMonths: 36 }, // 3岁
        { name: 'ACYW135群多糖流脑疫苗（1/2）', offsetMonths: 36 }, // 3岁
        
        { name: '脊灰疫苗（4/4）', offsetMonths: 48, isFree: true,note:"若接种五联疫苗，则无需接种" }, // 4岁
        { name: '水痘疫苗（2/2）', offsetMonths: 48 ,note:"若出过水痘则可不接种"}, // 4岁
        
        { name: '白破疫苗（1/1）', offsetMonths: 72 , isFree: true,note:"接种了五联可忽略"}, // 6岁
        { name: 'A+C群多糖流脑疫苗（2/2）', offsetMonths: 72 , isFree: true,note:"与四价流脑结合疫苗、ACYW135群多糖流脑疫苗二选一"}, // 6岁
        { name: 'ACYW135群多糖流脑疫苗（2/2）', offsetMonths: 72 }, // 6岁
      // 可以继续添加其他疫苗
    ];

    vaccines.forEach(vaccine => {
      const date = new Date(birthDate);
      date.setMonth(date.getMonth() + vaccine.offsetMonths);
      schedule.push({
        date: this.formatDate(date),
        name: vaccine.name,
        isFree: vaccine.isFree,
        note:vaccine.note
      });
    });

    return schedule;
  },

  // 格式化日期为 YYYY-MM-DD
  formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
});