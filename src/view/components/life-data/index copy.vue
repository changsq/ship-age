<template>
    <div style="background-color: white;padding-top: 50px;padding-bottom: 50px;">
      <div class="div3">
        <a-select
          v-model="options.value"
          mode="tags"
          style="width: 80%;"
          placeholder="选择文件"
          :options="options"
          @change="handleChange"
        ></a-select>
        <a-button type="primary" class="button1">选择文件</a-button>
      </div>
      <div class="div1">
        <a-button type="primary">开始预测</a-button>
        <a-button class="button1" type="primary">导出寿命预测报告</a-button>
      </div>
      <div class="div1">
        <div style="font-size: larger;font-weight: bold;">进度：</div>
        <a-progress style="width: 70%;" :percent="30" />
      </div>
      <div>
        <div style="margin-top: 40px;margin-left: 14%;">
          <a-card title="结果" style="width: 80%;">
            <div class="div3">
              <div style="width: 100%;">
                  <a-table
                    :columns="columns"
                    :row-key="record => record.component"
                    :pagination="false"
                    :data-source="dataSource"
                    :loading="loading"
                    style="background-color: white;"
                    :bordered=true
                  />
              </div>
            </div>
          </a-card>
        </div>
      </div>
    </div>
</template>

<script>
import { sendWebsocket, closeWebsocket } from '/websocket.js'
export default {
  name: 'power_sys_test',
  components: {

  },
  data () {
    return {
      options:[],
      columns: [
        {
          title: '船舶ID',
          dataIndex: 'shipId',
          width: '10%'
        },
        {
          title: '部件ID',
          dataIndex: 'apartId',
          width: '10%'
        },
        {
          title: '剩余寿命',
          dataIndex: 'componentRemainingUsfulLife',
          width: '10%',
        },
        {
          title: '初始时间',
          dataIndex: 'startTime',
          width: '10%',
        },
        {
          title: '健康状态',
          dataIndex: 'status',
          width: '10%',
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          width: '10%'
        },
      ],
      faultData:{},
      dataSource:[],
      loading: false,
    }
  },
  beforeDestroy () {
      closeWebsocket()
    },
  mounted() {
      this.getData()
  },
  created() {
},
  methods: {
    handleChange(){

    },
    getData(){

    },
  }
}
</script>

<style scoped>
.div1 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}
.div3 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
.div2 {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-left: 50px;
  margin-right: 20px;
  margin-top: 20px;
}
.ant-card {
  border-width: 2px !important;
  border-color: rgb(224, 224, 224) !important;
}
.button1{
  margin-left: 20px;
}
.select1 {
  width: 220px !important;
  height: 40px !important;
  line-height: 40px !important;
  font-size: 16px !important;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>
