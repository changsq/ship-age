<template>
  <div>
    <!-- <div class="warningInfo">
      <div v-for="(item, index) in wsdata" :key="index" style="width: 1000px;margin-top: 10px;font-size: 20px;">
        <a-icon type="exclamation-circle" theme="twoTone" two-tone-color="#eb2f96" />
        {{ item.componentName }}健康天数为{{ item.data.healthDays }},低于{{ time1 }}的预警值
      </div>
    </div> -->
    <div class="statusCode">
      <div class="codeText">数据更新时间：{{ predictionTime }}</div>
    </div>
    <div class="pie2">
      <div class="progress">
        <div style="color:white;width: 700px;">
          剩余保养时间为根据故障报警情况和设备状态参数得出的设备可剩余的维修保养时间，该时间为模型算出，需结合厂家推荐时间对设备进行合理科学保养。
        </div>
        <br>
        <div>
          <span style="font-size: large;color: white;">选择部件：</span>

          <a-select ref="select" v-model="name" style="width: 300px" @change="partChange">
            <a-select-option v-for="(item, index) in filteArray(lddata.elements, deviceId)" :value="index" :key="index">{{
        item.elementName
      }}</a-select-option>
          </a-select>
        </div>
        <a-tooltip title="保养">
          <a-progress :percent="timeRate" :showInfo="showInfo" :strokeColor="strokeColor[healthStatus]"
            :trailColor="trailColor" style="margin-top: 30px;width: 700px;" />
        </a-tooltip>
        <br>
        <a-badge style="margin-top: 20px;" :color="badgeColor[healthStatus]" /><span style="color:white">已运行时间:<span>{{
        workingTime
      }}小时</span></span>
        <a-badge style="margin-left: 20px;" color="white" /><span style="color:white">剩余保养时间:<span>{{ spareTime
            }}小时</span></span>
        <span style="color:white;margin-left: 20px;">厂家推荐时间(PMS):<span>{{
        max
      }}小时</span></span>
        <span style="color:white;margin-left: 20px;">部件替换时间:<span>{{
          replacementTime
        }}小时</span></span>
      </div>
      <div class="parameter">
        <div class="tips">
          <div class="tip"><a-badge style="margin-left: 20px;" color="red" /><span
              style="color:white">已运行时间+剩余保养时间＜PMS-下限</span></div>
          <div class="tip"><a-badge style="margin-left: 20px;" color="green" /><span
              style="color:white">PMS-下限≤已运行时间+剩余保养时间≤PMS+上限</span></div>
          <div class="tip"><a-badge style="margin-left: 20px;" color="blue" /><span
              style="color:white">PMS+上限＜已运行时间+剩余保养时间</span></div>
        </div>
        <div></div>

        <div style="margin-top: 45px;">
          <span style="color: white;font-size: large;">参数设置：</span>
          <span style="color: white;margin-left: 20px;font-size: large;">下限警告阈值(小时)：</span>
          <a-input-number id="inputNumber" v-model="lowerWarningThreshold" :max="99999" />
          <span style="color: white;margin-left: 20px;font-size: large;">上限警告阈值(小时)：</span>
          <a-input-number id="inputNumber" v-model="upperWarningThreshold" :max="99999" />
          <a-button type="primary" style="margin-left: 20px;" @click="parameterChange">确定</a-button>
        </div>
      </div>
      <div class="pie2-footer"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { message } from 'ant-design-vue';
import { closeWebsocket, sendWebsocket } from '/websocket.js';
export default {
  name: "xs-line",
  props: {
    curShipCode: ''
  },
  data() {
    return {
      config: {
        value: 66
      },
      token: '',
      name: 0,
      deviceName: '',
      showInfo: false,
      predictionTime: '',
      selectPart: '',
      lddata: {},
      value1: '',
      workingTime: '',
      spareTime: '',
      timeRate: 0,
      trailColor: "rgb(24,144,255)",
      init0: false,
      allLifeData: {},
      upperWarningThreshold: 20,
      lowerWarningThreshold: 10,
      id: '',
      deviceId: '',
      deviceName: '',
      max: 9999999,
      replacementTime: '',
      elementType: '',
      elementCode: '',
      healthStatus: '',
      haveWs: false,
      strokeColor: {
        'red': 'red',
        'green': 'green',
        'blue': 'blue'
      },
      badgeColor: {
        'red': 'red',
        'green': 'green',
        'blue': 'blue'
      },
    };
  },
  // computed: {
  //   filteredWsdata() {
  //     // 过滤 healthStatus 为 'yellow' 的项目
  //     const filteredComponents = Object.entries(this.wsdata)
  //       .filter(([key, value]) => value.data.healthStatus === 'yellow')
  //       .reduce((acc, [key, value]) => {
  //         acc[key] = value; // Rebuild the object
  //         return acc;
  //       }, {});
  //     return filteredComponents
  //   }
  // },
  mounted() {
    this.getToken()
    this.mountedHook()
  },
  beforeDestroy() {
    closeWebsocket()
  },
  created() {
  },
  methods: {
    mountedHook() {
      this.getLifeData()
        // 生成一个动态的值，这里使用随机数作为示例
        const dynamicValue = Math.floor(Math.random() * 100);
        // 使用生成的动态值构建 WebSocket URL
        const websocketUrl = `/hdws/RULserver/RULwebsocket/${dynamicValue}?Authorization=${this.token}`;

        // 通过动态生成的 URL 建立 WebSocket 连接
        sendWebsocket(websocketUrl, this.wsMessage);

        // 初始化 WebSocket 消息处理
      this.wsMessage();
    },
    closeWebsocket() {
      closeWebsocket()
    },
    wsMessage(lddata) {
      if (lddata && lddata.shipCode === this.curShipCode) {
        if (this.init0 === false) {
          this.value1 = '0'
        }
        if (lddata && !lddata.msg) {
          this.lddata = lddata;
          setTimeout(() => {  // 延迟执行
            this.lifeData()
          }, 100);
        }
      }
    },
    getToken() {
      const token = sessionStorage.getItem('hdToken')
      if (token) {
        this.token = token
      } else {
        const hashPart = window.location.hash.slice(1);

        // 找到查询字符串部分
        const queryStringStart = hashPart.indexOf('?');
        if (queryStringStart !== -1) {
          const queryString = hashPart.slice(queryStringStart + 1);

          // 使用URLSearchParams解析查询字符串
          const hashParams = new URLSearchParams(queryString);
          const tokenValue = hashParams.get('token'); // 假设token是查询参数之一
          const shipCodeValue = hashParams.get('shipcode');
          if (tokenValue) { this.token = tokenValue; }
          if (shipCodeValue) { this.curShipCode = shipCodeValue; }
          sessionStorage.setItem('hdToken', this.token)
        }
      }
    },
    lifeData() {
      if (this.lddata.elements) {
        const filterArray = this.filteArray(this.lddata.elements, this.deviceId)
        this.predictionTime = filterArray[this.value1].data[0].predictionTime
        this.healthStatus = filterArray[this.value1].data[0].healthStatus
        let healthDays = parseInt(filterArray[this.value1].data[0].healthDays)
        const filterLifeData = this.allLifeData.data.data.filter(v => v.elementName === filterArray[this.name].elementName)
        this.elementType = filterLifeData[0].type
        this.elementCode = filterLifeData[0].code
        this.getParameter()
        this.workingTime = parseInt(filterArray[this.value1].data[0].actualRunningTime)
        this.spareTime = healthDays
        const rate = 100 - parseInt(filterArray[this.value1].data[0].healthRate.replace('%', ''), 10);
        this.timeRate = rate
      }
    },
    getDeviceId(id) {
      if (id === null) {
        this.deviceId = ''
      } else {
        this.deviceId = id
      }
      this.lifeData()
      this.name = 0
    },
    getDeviceName(name) {
      this.deviceName = name
      this.lifeData()
      this.name = 0
    },
    filteArray(array, value) {
      if (this.deviceId != '' || this.deviceName != '') {
        if (this.deviceName != '') {
          const array1 = this.filterArray(array, value)
          return this.filterArray(array1, this.deviceName)
        } else {
          return this.filterArray(array, value)
        }
      } else {
        return array
      }
    },
    filterArray(array, value) {
      if (array && value != '') { return array.filter(item => item.elementName.includes(value)); } else { return array }
    },
    partChange(value) {
      this.init0 = true
      this.value1 = value
      this.lifeData()
    },
    getParameter() {
      const url = `/hdapi/RULserver/element/find`
      const datae = {
        type: this.elementType,
        code: this.elementCode
      }
      const filterArray = this.filteArray(this.lddata.elements, this.deviceId)
      this.$axios({
        url: url,
        method: "post",
        data: datae
      }).then((res) => {
        this.upperWarningThreshold = res.data[0].upperWarningThreshold
        this.lowerWarningThreshold = res.data[0].lowerWarningThreshold;
        this.id = res.data.filter(v => v.elementName === filterArray[this.name].elementName)[0].id
        this.max = res.data[0].life
        this.replacementTime = res.data[0].replacementTime
        this.elementName = res.data.filter(v => v.elementName === filterArray[this.name].elementName)[0].elementName
      })
    },
    async queryData(url, params) { 
      return axios.get(url, {
        params,
      });
    },
    getLifeData() {
      const url = `/hdapi/RULserver/RemainingUsefulLife/getElementsRulList`
      this.queryData(url, {
        pageNumber: 1,
        pageSize: 10,
      }).then(res => {
        this.allLifeData = res
      })
    },
    parameterChange() {
      const id = this.id
      const url = `/hdapi/RULserver/element`
      const datae = {
        id: id,
        lowerWarningThreshold: this.lowerWarningThreshold,
        upperWarningThreshold: this.upperWarningThreshold,
        elementName: this.elementName,
        shipCode: this.curShipCode
      }
      if (Number(this.upperWarningThreshold) < Number(this.max)) {
        this.$axios({
          url: url,
          method: "put",
          data: datae
        }).then(() => {
          message.info('修改成功！')
          this.wsMessage()
        })
      } else {
        message.info('输入不合法')
      }
    },

  },
}
</script>

<style scoped>
.percentage {
  width: 400px;
  height: 300px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 30px;
  right: 0px;
  left: 8px;
  text-align: center;
}

.rowClass {
  color: #ffffff
}

.pie2 .title {
  position: absolute;
  text-align: center;
  width: 100%;
}

.pie2 .title span {
  font-size: 25px;
  color: #ffffff;
}

.pie2 {
  width: 1600px;
  height: 250px;
  overflow: hidden;
  display: flex;
  position: absolute;
  margin: 10px;
  top: 720px;
  left: 160px;
  background: url(../../../assets/images/line.png) rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(25, 186, 139, 0.17);
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

.progress {
  margin-top: 25px;
  margin-left: 50px;
}

.parameter {
  margin-top: 0px;
  margin-left: 50px;
}

.warningInfo {
  display: flex;
  flex-direction: column;
  margin: 150px 1500px;
  color: white
}

.statusCode {
  margin: 6.7% 14%;
}

.codeText {
  color: white;
  font-size: large;
}

.tips {
  display: flex;
  flex-direction: column;
  margin-left: 52%;
  margin-top: 10px;
}

.tip {
  margin-top: 10px;
}
</style>