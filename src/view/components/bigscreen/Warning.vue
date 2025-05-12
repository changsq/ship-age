<template>
  <div class="pie2">
    <!-- <p>{{ message }}</p>      -->
    <div class="title">
      <dv-decoration-7 style="width:150px;height:30px;margin-left: 150px;color: white;">故障统计</dv-decoration-7>
    </div>
    <div class="datePicker">
      <span style="margin: 5px 0px;font-size: large;color: white;">选择时间：</span>
      <a-range-picker style="width: 250px;" v-model="selectedDates" />
      <a-button style="margin-left: 10px;" type="primary" @click="handleTimePick">确定</a-button>
    </div>
    <div style="display: flex;justify-content: center">
      <el-col :span="8" style="width: 80%;">
        <el-card shadow="hover" class="card1">
          <img src="@/assets/images/svg1.svg" alt="" style="margin-left: 0px;">
          <span style="margin-left: 20px;">无异常运行</span>
          <span style="margin-left: 20px;color:rgb(255, 255, 255) ;">{{ normal !== null ? normal : '-' }} 天</span>
        </el-card>
      </el-col>
    </div>
    <div style="display: flex;justify-content: center">
      <el-col :span="8" style="width: 80%;">
        <el-card shadow="never" class="card2">
          <img src="@/assets/images/svg2.svg" alt="" style="margin-left: 0px;">
          <span style="margin-left: 20px;">异常未处理</span>
          <span style="margin-left: 20px;color:rgb(255, 255, 255) ;">{{ unnormal !== null ? unnormal : '-' }} 天</span>
        </el-card>
      </el-col>
    </div>
    <div style="display: flex;justify-content: center">
      <el-col :span="8" style="width: 80%;">
        <el-card shadow="never" class="card2">
          <img src="@/assets/images/svg3.svg" alt="" style="margin-left: 0px;">
          <span style="margin-left: 20px;">异常次数</span>
          <span style="margin-left: 20px;color:rgb(255, 255, 255) ;">{{ alarm !== null ? alarm : '-' }} 次</span>
        </el-card>
      </el-col>
    </div>
    <div style="display: flex;justify-content: center">
      <el-col :span="8" style="width: 80%;">
        <el-card shadow="never" class="card2">
          <img src="@/assets/images/svg4.svg" alt="" style="margin-left: 0px;">
            <span style="margin-left: 20px;">高发故障</span>
            <span style="margin-left: 10px;color:rgb(255, 255, 255);">{{ top1 !== null ? top1 : '-' }}</span>
        </el-card>
      </el-col>
    </div>
    <div class="pie2-footer"></div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
export default {
  name: "xs-pie",
  data() {
    return {
      selectedDates: [moment().subtract(7, 'days'), moment()],
      normal: 0,
      unnormal: 0,
      alarm: 0,
      top1: '',
      time: {
        start: '',
        end: ''
      }
    };
  },
  mounted() {
    this.handleTimePick()
  },
  methods: {
    handleTimePick() {
      const startTime = new Date(this.selectedDates[0]._d)
      const endTime = new Date(this.selectedDates[1]._d)

      this.time.start = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
      this.time.end = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')

      //获取正常运行天数
      this.queryData('/hdapi/server/FaultDetection/statistic/normal', {
        beginTime: this.time.start,
        endTime: this.time.end,
        shipCode: this.$parent.curShipCode,
      }).then(res => {
        this.normal = res.data.data
      })
      //获取异常未处理天数
      this.queryData('/hdapi/server/FaultDetection/statistic/unnormal', {
        beginTime: this.time.start,
        endTime: this.time.end,
        shipCode: this.$parent.curShipCode,
      }).then(res => {
        this.unnormal = res.data.data
      })
      //获取报警次数
      this.queryData('/hdapi/server/FaultDetection/statistic/alarm', {
        beginTime: this.time.start,
        endTime: this.time.end,
        shipCode: this.$parent.curShipCode,
      }).then(res => {
        this.alarm = res.data.data
      })
      //获取异常次数最多类型
      this.queryData('/hdapi/server/FaultDetection/statistic/unnormal/top1', {
        beginTime: this.time.start,
        endTime: this.time.end,
        shipCode: this.$parent.curShipCode,
      }).then(res => {
        this.top1 = res.data.data
        this.top1 = this.top1.replace(/<br>/g, " ");
      })
    },


    async queryData(url, params) {
      return axios.get(url, {
        params,
      });
    },
  },
}
</script>

<style scoped>
.pie2 {
  width: 440px;
  height: 800px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 120px;
  left: 1400px;
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

.pie2 .title {
  position: absolute;
  text-align: center;
  width: 100%;
}

.pie2 .title span {
  font-size: 25px;
  color: #ffffff;
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
  top: 30px;
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
  margin-left: 15px;
  margin-top: 50px;
}

.card1 {
  display: flex;
  align-items: center;
  background-color: rgb(25, 129, 246, 0.5);
  height: 80px;
  color: white;
  font-size: large;
  margin-top: 25px;
  border-radius: 10px
}

.card2 {
  display: flex;
  align-items: center;
  background-color: rgb(25, 129, 246, 0.5);
  height: auto;
  color: white;
  font-size: large;
  margin-top: 10px;
  border-radius: 10px;
}
</style>