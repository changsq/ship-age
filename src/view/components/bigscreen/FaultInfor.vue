<template>
  <div class="pie2">
    <!-- <p>{{ message }}</p>      -->
    <div>
      <a-icon v-show="loading" type="loading" style="position:absolute;color: white;font-size:40px;margin: 200px;" />
    </div>
    <div>
      <div class="title">
        <dv-decoration-7 style="width:150px;height:30px;margin-left: 150px;color: white;">状态变化曲线</dv-decoration-7>
      </div>
      <span style="font-size: large;color: white;margin-left: 40px;">参数选择：</span>
      <a-select class="select1" ref="select" v-model="value1" style="width: 200px">
        <a-select-option value="0">排气温度</a-select-option>
        <a-select-option value="1">冷却淡水出口温度</a-select-option>
        <a-select-option value="2">扫气温度</a-select-option>
        <a-select-option value="3">活塞冷却油出口温度</a-select-option>
        <a-select-option v-if="!id" value="4">主机转速</a-select-option>
      </a-select>
      <a-button type="primary" style="margin-left: 10px;" @click="handleSelect">确定</a-button>
      <div class="datePicker">
        <span style="margin: 5px 0px;font-size: large;color: white;">时间选择：</span>
        <div>
          <a-range-picker style="width: 250px;margin-top: 5px;" v-model="selectedDates" />
        </div>
      </div>
      <div id='main' class="percentage"></div>
      <div class="pie2-footer"></div>
    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs';
import moment from 'moment'
import axios from 'axios';
export default {
  name: "xs-pie",
  data() {
    return {
      id: null,
      loading: true,
      time: {
        start: '',
        end: '',
      },

      Param: '',
      selectedDates: [moment().subtract(7, 'days'), moment()],
      value1: '4',
      chartData: [],
      // newChartData: [],
      option: {}
    };
  },

  mounted() {
    this.handleSelect()
  },
  methods: {

    drawChart() {
      var myChart = this.$echarts.init(document.getElementById('main'), 'dark');
      myChart.setOption(this.option);
    },

    async queryData(url, params) {
      return axios.get(url, {
        params,
      });

    },
    handleSelect() {
      this.newChartData = []
      const startTime = new Date(this.selectedDates[0]._d)
      const endTime = new Date(this.selectedDates[1]._d)
      this.time.start = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
      this.time.end = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
      this.selectedParam();
      this.queryData('/hdapi/server/StatusMonitor/HistoryPage', {
        beginTime: this.time.start,
        endTime: this.time.end,
        shipCode: this.$parent.curShipCode,
        param: this.Param,
      }).then(res => {
        for (const key in res.data.data) {
          if (res.data.data.hasOwnProperty(key)) {
            const array = res.data.data[key];
            this.chartData[key - 1] = array.map(item => [item.sampleTime, item.val]);
          }
        }
        const selectDevice = this.value1 === '4' || this.id
        const newChartData = this.value1 === '4' ? this.chartData[0] : this.chartData[this.id - 1]
        const series = [
          {
            name: '',
            type: 'line',
            smooth: false,
            symbol: 'none',
            areaStyle: null,
            data: newChartData
          }, { type: 'line',data: null }, { type: 'line',data: null }, {type: 'line', data: null }, { type: 'line',data: null }, { type: 'line',data: null }
        ]
        const seriesAll = [
          {
            name: '气缸1',
            type: 'line',
            smooth: false,
            symbol: 'none',
            areaStyle: null,
            data: this.chartData[0]
          },
          {
            name: '气缸2',
            type: 'line',
            smooth: false,
            symbol: 'none',
            areaStyle: null,
            data: this.chartData[1]
          },
          {
            name: '气缸3',
            type: 'line',
            smooth: false,
            symbol: 'none',
            areaStyle: null,
            data: this.chartData[1]
          },
          {
            name: '气缸4',
            type: 'line',
            smooth: false,
            symbol: 'none',
            areaStyle: null,
            data: this.chartData[1]
          },
          {
            name: '气缸5',
            type: 'line',
            smooth: false,
            symbol: 'none',
            areaStyle: null,
            data: this.chartData[1]
          },
          {
            name: '气缸6',
            type: 'line',
            smooth: false,
            symbol: 'none',
            areaStyle: null,
            data: this.chartData[1]
          }
        ]
        this.option = {
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: ''
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'time',
            boundaryGap: false
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 40
            },
            {
              start: 0,
              end: 20
            }
          ],
          color: [
            '#4992ff',
            '#7cffb2',
            '#fddd60',
            '#ff6e76',
            '#58d9f9',
            '#05c091',
            '#ff8a45',
            '#8d48e3',
            '#dd79ff'
          ],
          backgroundColor: 'rgb(3,16,86)',
          series: selectDevice ? series : seriesAll
        };
        this.drawChart();
        this.hideLoading();
      })
    },
    hideLoading() {
      this.loading = false
    },
    getDeviceId(id) {
      this.id = id
      if (this.value1 === '4') { this.value1 = '0' }
      this.handleSelect()
    },
    selectedParam() {
      switch (this.value1) {
        case '0':
          this.Param = '排气温度';
          break;
        case '1':
          this.Param = '冷却淡水出口温度';
          break;
        case '2':
          this.Param = '扫气温度';
          break;
        case '3':
          this.Param = '活塞冷却油出口温度';
          break;
        case '4':
          this.Param = '主机转速';
          break;
      }
    }
  },
}
</script>

<style scoped>
.pie2 {
  width: 440px;
  height: 500px;
  overflow: hidden;
  position: absolute;
  background: url(../../../assets/images/line.png) rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(25, 186, 139, 0.17);
  padding: 1px;
  margin: 10px;
  top: 150px;
  left: 1400px;
}

.pie2::before {
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}

.pie2::after {
  position: absolute;
  right: 0;
  top: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}

.pie2 .pie2-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.pie2 .pie2-footer::before {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}

.pie2 .pie2-footer::after {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}

.pie2 .title {
  text-align: center;
  width: 100%;
  margin-bottom: 20px;
}

.pie2 .title span {
  font-size: 20px;
  color: rgb(0, 186, 255);
}

.percentage1 {
  width: 100%;
  /* height: 100px; */
}

.percentage {
  width: 400px;
  height: 300px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 150px;
  right: 0px;
  left: 8px;
  text-align: center;
}

.percentage2 {
  width: 100%;
  height: 300px;
  top: 20px;
  /* text-align: left; */
  position: absolute;
  padding: 20px;
}

.p1 {
  font-size: 25px;
  /* text-align: left; */
  color: #ffffff;
  left: 20px;
  top: 20px;
}

.datePicker {
  display: flex;
  margin-left: 40px;
}
</style>