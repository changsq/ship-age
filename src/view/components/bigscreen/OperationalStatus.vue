<template>
    <div class="pie2">
      <div>
        <a-icon v-show="loading" type="loading"
          style="position:absolute;color: white;font-size:40px;margin: 130px 700px;" />
      </div>
      <table>
        <!-- 表格头部 -->
        <thead>
          <tr>
            <th style="background-color: transparent;">
              <dv-decoration-7>主缸状态</dv-decoration-7>
            </th>
            <th v-for="num in headers" :key="num">{{ num }}</th>
          </tr>
        </thead>
        <!-- 表格主体 -->
        <tbody>
          <tr v-for="(temps, type) in data" :key="type">
            <td>{{ type }}</td>
            <td v-for="(value, index) in temps" :key="index">{{ value }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pie2-footer"></div>
    </div>
</template>

<script>
export default {
  name: "xs-line",
  props: {
    wsdata: {}
  },
  data() {
    return {
      loading: true,
      headers: ['NO.1缸', 'NO.2缸', 'NO.3缸', 'NO.4缸', 'NO.5缸', 'NO.6缸'],
      data: {},
    };
  },

  methods: {
    clickaa() {
      this.wsMessage(this.wsdata)
      this.loading = false
    },
    wsMessage(wsdata) {
      if (wsdata) {
        this.data = wsdata.data
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
  width: 1300px;
  height: 280px;
  overflow: hidden;
  position: absolute;
  padding: 1px;
  margin: 10px;
  top: 720px;
  left: 540px;
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
  margin-top: 5px;
  width: 99.8%;
  height: 74%;
  border-collapse: separate;
  /* 允许设置单元格之间的距离 */
  border-spacing: 0 1px;
}

th,
td {
  text-align: center;
  padding: 14px;
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