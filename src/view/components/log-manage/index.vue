<template>
  <div>
      <a-table
        :columns="columns"
        :row-key="record => record.id"
        :data-source="dataSource"
        :pagination="false"
        :loading="loading"
        style="background-color: white;"
        :bordered=true
      >
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
import axios from 'axios';
export default {
  components: {

    },
  data() {
    return {
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      current: 1,
      pageSize: 10,
      total: 50,
      columns: [
        {
          title: '操作',
          dataIndex: 'methodName',
          width: '20%'
        },
        {
          title: '操作者',
          dataIndex: 'operateUser',
          width: '20%',
        },
        {
          title: '操作时间',
          dataIndex: 'operateTime',
          width: '20%',
        },
      ],
      dataSource: [],
      loading: false,
    };
  },
  methods: {
    async queryData(params) {
      return axios.get('/hdapi/auth/user/log/page', {
        params,
      });
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
    fetchData() {
      this.loading = true;
      this.queryData({
        pageSize: this.pageSize,
        pageNumber: this.current,
      })
        .then(res => {
          this.dataSource = res.data.data.list;
          this.total = res.data.data.total
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>