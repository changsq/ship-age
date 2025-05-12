<template>
  <div>
    <a-form>
      <div style="display: flex;align-items: center;" >
          <div>船舶ID：</div>
          <a-input style="width: 10%;"/>
          <div style="margin-left: 20px;">部件ID：</div>
          <a-input style="width: 10%;"/>
          <div style="margin-left: 20px;">故障ID：</div>
          <a-input style="width: 10%;"/>

        <div style="margin-left: 40px;">开始时间：</div>
        <a-date-picker/>
        <div style="margin-left: 40px;">结束时间：</div>
        <a-date-picker/>
        <a-form-item>
          <a-button style="margin-top: 25px;margin-left: 20px;" type="primary" @click="handleSubmit">查询</a-button>
        </a-form-item>
        <a-button style="margin-left: 20px;" type="primary">备件录入</a-button>
      </div>
    </a-form>
    <a-table
        :columns="columns"
        :row-key="record => record.component"
        :data-source="tableData"
        :pagination="false"
        :loading="loading"
        style="background-color: white;"
        :bordered=true
      >
      <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="doEvent('edit',record)">备件数据更新</a-button>
        </template>
      </a-table>
      <div style="display: flex;">
        <a-pagination
            v-model="current"
            :page-size-options="pageSizeOptions"
            :total="total"
            show-size-changer
            :page-size="pageSize"
            @showSizeChange="onShowSizeChange"
            style="margin-top: 8px;"
          >
            <template slot="buildOptionText" slot-scope="props">
              <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
              <span v-if="props.value === '50'">全部</span>
            </template>
          </a-pagination>
          <div style="margin-top:12px;" class="ml10">共 <b>{{ total }}</b> 条记录</div>
      </div>
  </div>
</template>

<script>
import { sendWebsocket, closeWebsocket } from '/websocket.js'
export default {
  data() {
    return {
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      current: 1,
      pageSize: 10,
      total: 0,
      columns: [
        {
          title: '船舶ID',
          dataIndex: 'shipId',
          width: '10%'
        },
        {
          title: '系统ID',
          dataIndex: 'sysId',
          width: '10%',
        },
        {
          title: '部件类型',
          dataIndex: 'spareType',
          width: '10%'
        },
        {
          title: '备件数据',
          dataIndex: 'status1',
          width: '10%'
        },
        {
          title: '备件建议',
          dataIndex: 'spareAdvice',
          width: '10%'
        },
        {
          title: '操作',
          key: 'operation',
          width: '20%',
          scopedSlots: { customRender: 'operation'}
        }
      ],
      faultData:{},
      tableData:[],
      loading: false,
    };
  },
  beforeDestroy () {
      closeWebsocket()
    },

  mounted() {
  },

  methods: {
    handleSubmit(){

    },
    onShowSizeChange(current, pageSize) {
      this.pageSize = pageSize;
      this.loading = true;
      this.queryData({
        pageSize: this.pageSize,
        pageNumber: this.current,
      })
        .then(res => {
          this.dataSource = res.data.data.list;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>