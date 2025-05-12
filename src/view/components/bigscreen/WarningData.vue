<template>
  <div>
    <div class="pie2">
      <div class="title">
        <dv-decoration-7 style="width:150px;height:30px;margin-left: 150px;color: white;">当前报警</dv-decoration-7>
      </div>
      <div class="percentage">
        <div>
          <a-icon v-show="loading" type="loading"
            style="position:absolute;color: white;font-size:40px;margin: 130px 700px;" />
        </div>
        <table>
          <!-- 表格头部 -->
          <thead>
            <tr>
              <th>序号</th>
              <th>时间</th>
              <th>报警信息</th>
            </tr>
          </thead>
          <!-- 表格主体 -->
          <tbody>
            <tr v-for="item in data" :key="item.tagCode">
              <td>{{ item.tagCode }}</td>
              <td>{{ item.time.replace('T', ' ') }}</td>
              <td @click="showAd(item.id, item.advice)">{{ item.description }}
                <a-icon type="exclamation-circle" theme="twoTone" two-tone-color="#eb2f96" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="pie2-footer"></div>
    </div>
    <a-modal v-model="open" title="" :footer="[]">
      <p style="margin-top: 30px;white-space: pre-wrap;">{{ advice }}</p>
    </a-modal>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: true,
      open: false,
      advice: '',
      data: [],
      fddata: {},
    };
  },

  methods: {
    clickaa(fddata) {
      this.fddata = fddata
      this.wsMessage(this.fddata)
      this.loading = false
    },
    wsMessage(wsdata) {
      if (wsdata) {
        this.data = wsdata.data
      }
    },
    showAd(id, advice) {
      this.open = true
      this.advice = advice.replace(/<br>/g, '\n')
    },
    handleOk() {
      this.open = false
    }
  },
}
</script>

<style scoped>
.percentage {
  width: 420px;
  height: 360px;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 20px;
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

/* .handle-advise {
  color: white;
  font-size: 25px;
  position: absolute;
  text-align: center;
  width: 100%;
  margin-top: 50px;
} */

.pie2 {
  width: 440px;
  height: 400px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 100px;
  left: 45px;
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

table {
  width: 100%;
  height: 74%;
  border-collapse: separate;
  /* 允许设置单元格之间的距离 */
  border-spacing: 0 1px;
}

th,
td {
  text-align: center;
  padding: 12px;
  border: none;
  /* 边框颜色 */
  border-radius: 4px;
  /* 圆角 */
  color: white;
}
th {
  background-color: rgb(25, 129, 246, 0.5);
  /* 背景色 */
  color: white;
  /* 文字颜色 */
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* 阴影效果 */
}

tr {
  /* background-color: rgb(11, 53, 88); */
  /* 背景色 */
  font-size: 14px;
}

tr:nth-child(even) {
  background-color: rgb(19, 41, 63);
  /* 奇偶行交替颜色 */
}
</style>