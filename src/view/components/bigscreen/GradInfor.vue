<template>
  <div class="pie2">
    <div class="dashboard">
      <a-icon v-show="loading" type="loading"
        style="position:absolute;color: white;font-size:40px;margin: 130px 700px;" />
      <div class="title">
        <dv-decoration-7 style="width:150px;height:30px;margin-left: 150px;color: white;">参数显示</dv-decoration-7>
        <!-- {{this.option.series[0].data[0].value}} -->
      </div>
      <a-select ref="select" v-model="curDevice" style="width: 110px;margin:4% 70%;position: absolute;"
        @change="deviceChange">
        <a-select-option v-for="item in deviceList" :value="item.deviceID" :key="item.deviceID">{{ item.deviceName
          }}</a-select-option>
      </a-select>
      <div style="display: flex;">
        <dv-charts :key="dashboard" style="height: 200px;margin-top: 50px;" :option="option" />
        <dv-charts :key="dashboard1" style="height: 200px;margin-top: 50px;" :option="option1" />
      </div>
      <div style="display: flex;">
        <dv-charts :key="dashboard2" style="height: 200px;" :option="option2" />
        <dv-charts :key="dashboard3" style="height: 200px;" :option="option3" />
      </div>
      <div style="color: white;font-size: large;margin-left: 30%;font-weight: bold">主机转速：{{ wsdata.rpm}}  RPM</div>
    </div>
    <div class="pie2-footer"></div>
  </div>
</template>

<script>
export default {
  props: {
    wsdata: {}
  },
  data() {
    return {
      data: [],
      loading: true,
      curDevice: 1,
      deviceList: [
        { deviceID: 1, deviceName: 'NO.1缸' },
        { deviceID: 2, deviceName: 'NO.2缸' },
        { deviceID: 3, deviceName: 'NO.3缸' },
        { deviceID: 4, deviceName: 'NO.4缸' },
        { deviceID: 5, deviceName: 'NO.5缸' },
        { deviceID: 6, deviceName: 'NO.6缸' },
      ],
      dashboard: Date.now(),
      dashboard1: Date.now() + 1000,
      dashboard2: Date.now() + 2000,
      changeDevice:false,
      dashboard3: Date.now() + 3000,
      option: {
        title: {
          text: '排气温度',
          style: {
            fill: '#fff'
          }
        },
        series: [
          {
            type: 'gauge',
            data: [{ name: 'itemA', value: 0 }],
            min: 0,
            max: 500,
            center: ['50%', '60%'],
            axisLabel: {
              formatter: '{value}℃',
              style: {
                fill: '#fff'
              }
            },
            axisTick: {
              style: {
                stroke: '#fff'
              }
            },
            animationCurve: 'easeInOutBack'
          }
        ]
      },
      option1: null,
      option2: null,
      option3: null,
    };
  },

  created() {
    this.updateTitleText();
  },
  methods: {
    deviceChange() {
      // this.$emit('deviceChange',this.curDevice)
      this.changeDevice = true
      this.wsMessage()
    },
    clickss() {
      this.wsMessage(this.wsdata);
      this.loading = false
    },
    deviceChoose(id){
      this.curDevice=id
      this.deviceChange()
    },
    wsMessage(wsdata) {
      if (wsdata || this.changeDevice) {
        if(wsdata){
        this.data = Object.keys(wsdata.data).map((parameter, index) => {
          const values = wsdata.data[parameter];
          return {
            key: (index + 1).toString(),
            parameter: parameter,
            value1: values[1],
            value2: values[2],
            value3: values[3],
            value4: values[4],
            value5: values[5],
            value6: values[6],
          };
        });
      }
        if (this.curDevice === 1) {
          this.$set(this.option.series[0].data[0], 'value', parseFloat(this.data[3].value1.split('℃')[0]));
          this.$set(this.option1.series[0].data[0], 'value', parseFloat(this.data[0].value1.split('℃')[0]));
          this.$set(this.option2.series[0].data[0], 'value', parseFloat(this.data[2].value1.split('℃')[0]));
          this.$set(this.option3.series[0].data[0], 'value', parseFloat(this.data[1].value1.split('℃')[0]));
        } else if (this.curDevice === 2) {
          this.$set(this.option.series[0].data[0], 'value', parseFloat(this.data[3].value2.split('℃')[0]));
          this.$set(this.option1.series[0].data[0], 'value', parseFloat(this.data[0].value2.split('℃')[0]));
          this.$set(this.option2.series[0].data[0], 'value', parseFloat(this.data[2].value2.split('℃')[0]));
          this.$set(this.option3.series[0].data[0], 'value', parseFloat(this.data[1].value2.split('℃')[0]));
        } else if (this.curDevice === 3) {
          this.$set(this.option.series[0].data[0], 'value', parseFloat(this.data[3].value3.split('℃')[0]));
          this.$set(this.option1.series[0].data[0], 'value', parseFloat(this.data[0].value3.split('℃')[0]));
          this.$set(this.option2.series[0].data[0], 'value', parseFloat(this.data[2].value3.split('℃')[0]));
          this.$set(this.option3.series[0].data[0], 'value', parseFloat(this.data[1].value3.split('℃')[0]));
        } else if (this.curDevice === 4) {
          this.$set(this.option.series[0].data[0], 'value', parseFloat(this.data[3].value4.split('℃')[0]));
          this.$set(this.option1.series[0].data[0], 'value', parseFloat(this.data[0].value4.split('℃')[0]));
          this.$set(this.option2.series[0].data[0], 'value', parseFloat(this.data[2].value4.split('℃')[0]));
          this.$set(this.option3.series[0].data[0], 'value', parseFloat(this.data[1].value4.split('℃')[0]));
        } else if (this.curDevice === 5) {
          this.$set(this.option.series[0].data[0], 'value', parseFloat(this.data[3].value5.split('℃')[0]));
          this.$set(this.option1.series[0].data[0], 'value', parseFloat(this.data[0].value5.split('℃')[0]));
          this.$set(this.option2.series[0].data[0], 'value', parseFloat(this.data[2].value5.split('℃')[0]));
          this.$set(this.option3.series[0].data[0], 'value', parseFloat(this.data[1].value5.split('℃')[0]));
        } else if (this.curDevice === 6) {
          this.$set(this.option.series[0].data[0], 'value', parseFloat(this.data[3].value6.split('℃')[0]));
          this.$set(this.option1.series[0].data[0], 'value', parseFloat(this.data[0].value6.split('℃')[0]));
          this.$set(this.option2.series[0].data[0], 'value', parseFloat(this.data[2].value6.split('℃')[0]));
          this.$set(this.option3.series[0].data[0], 'value', parseFloat(this.data[1].value6.split('℃')[0]));
        }
        this.dashboard = Date.now();
        this.dashboard1 = Date.now() + 1000;
        this.dashboard2 = Date.now() + 2000;
        this.dashboard3 = Date.now() + 3000;
      }
      this.changeDevice = false
    },
    updateTitleText() {
      // 使用深拷贝来创建一个新的配置对象
      this.option1 = JSON.parse(JSON.stringify(this.option));
      this.option1.title.text = '冷却淡水出口温度';
      this.option1.series[0].max = 200
      this.option2 = JSON.parse(JSON.stringify(this.option));
      this.option2.title.text = '扫气温度';
      this.option2.series[0].max = 100
      this.option3 = JSON.parse(JSON.stringify(this.option));
      this.option3.title.text = '活塞冷却油出口温度';
      this.option3.series[0].max = 120
    },

  },
}
</script>

<style scoped>
.percentage {
  width: 420px;
  height: 360px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 22px;
  right: 0px;
  left: 8px;
  text-align: center;
}

.pie2 .title {
  position: absolute;
  text-align: center;
  width: 100%;
}

.pie2 .title span {
  font-size: 20px;
  color: rgb(0, 186, 255);
}

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
  left: 50px;
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
</style>