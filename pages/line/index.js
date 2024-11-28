import * as echarts from '../../utils/ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  updateChart(chart); // 初始化时更新图表
  return chart;
}

// 合并更新图表的逻辑
function updateChart(chart) {
  const months = Array.from({ length: 72 }, (_, i) => `${Math.floor(i / 12)}岁${i % 12}月`); // 0到6岁
  const boyData = [
    50.8, 55.0, 59.0, 62.5, 65.5, 68.5, 72.0, 75.0, 78.0, 81.0, 83.5, 86.0,
    89.0, 90.5, 92.0, 93.5, 95.0, 96.0, 97.0, 98.0, 100.0, 102.0, 104.0, 106.0,
    108.0, 110.0, 111.0, 112.0, 113.0, 115.0, 117.0, 119.0, 121.0, 123.0, 125.0,
    126.0, 127.0, 128.0, 129.0, 130.0, 131.0, 132.0, 133.0, 134.0, 135.0, 136.0,
    137.0, 138.0, 139.0, 140.0, 141.0, 142.0, 143.0, 144.0, 145.0, 146.0, 147.0,
    148.0, 149.0, 150.0, 151.0, 152.0, 153.0, 154.0, 155.0, 156.0, 157.0, 158.0,
    159.0, 160.0, 161.0, 162.0, 163.0
  ];
  const girlData = [
    49.5, 54.0, 58.0, 61.5, 64.0, 67.0, 70.0, 73.0, 76.0, 79.0, 81.5, 84.0,
    87.0, 88.5, 90.0, 91.5, 93.0, 94.0, 95.0, 96.0, 98.0, 100.0, 102.0, 104.0,
    106.0, 108.0, 110.0, 111.0, 112.0, 113.0, 114.0, 115.0, 116.0, 117.0, 118.0,
    119.0, 120.0, 121.0, 122.0, 123.0, 124.0, 125.0, 126.0, 127.0, 128.0, 129.0,
    130.0, 131.0, 132.0, 133.0, 134.0, 135.0, 136.0, 137.0, 138.0, 139.0, 140.0,
    141.0, 142.0, 143.0, 144.0, 145.0, 146.0, 147.0, 148.0, 149.0, 150.0, 151.0,
    152.0, 153.0, 154.0, 155.0, 156.0
  ];

  const birthDate = wx.getStorageSync('birthDate'); // 获取出生日期
  if (birthDate) {
    const birth = new Date(birthDate);
    const currentDate = new Date();
    const ageInMonths = (currentDate.getFullYear() - birth.getFullYear()) * 12 + (currentDate.getMonth() - birth.getMonth());

    const option = {
      title: {
        text: '身高成长曲线',
        left: 'center'
      },
      legend: {
        data: ['男孩身高成长曲线', '女孩身高成长曲线'],
        top: 50,
        left: 'center',
        backgroundColor: 'white',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value',
        name: '身高 (cm)',
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '男孩身高成长曲线',
          type: 'line',
          smooth: true,
          data: boyData,
          markPoint: {
            data: ageInMonths < 72 ? [{
              name: '您孩子的位置',
              coord: [ageInMonths, boyData[ageInMonths]],
              itemStyle: { color: 'red' },
              symbol: 'circle',
              symbolSize: 10
            }] : []
          }
        },
        {
          name: '女孩身高成长曲线',
          type: 'line',
          smooth: true,
          data: girlData,
          markPoint: {}
        }
      ]
    };

    if (ageInMonths >= 72) {
      option.title.text = '您的孩子已超过6岁'; // 提示超过6岁
    }

    chart.setOption(option);
  } else {
    wx.showToast({
      title: '请先输入出生日期',
      icon: 'none'
    });
  }
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    showBoys: true,
    showGirls: true
  },

  toggleBoys() {
    this.setData({ showBoys: !this.data.showBoys });
    this.updateChart(); // 调用统一的更新函数
  },

  toggleGirls() {
    this.setData({ showGirls: !this.data.showGirls });
    this.updateChart(); // 调用统一的更新函数
  },

  updateChart() {
    const chart = this.chart;
    updateChart(chart); // 更新图表
  },

  onLoad() {
    this.setData({
      ec: {
        onInit: initChart
      }
    });
  },

  onReady() {
    this.chart = this.selectComponent('#mychart-dom-line').chart; // 获取图表实例
  },

  onShow() {
    this.updateChart(); // 页面显示时更新图表
  }
});
