<template>
  <div>
    <Edit @editFinish="editFinish" ref="edit"/>
    <Create @createFinish="createFinish" ref="create"/>

    <custom-bread-crumb show-icon style="margin-left: 30px;" :list="breadCrumbList"></custom-bread-crumb>
    <div>
      <a v-for="item in breadCrumbList" :to="item.to" :key="`bread-crumb-${item.name}`" class="mtitle">{{ showTitle(item) }}</a>
    </div>
    <a-card style="margin-top: 10px;width:100%;">
      <div style="display: flex;">
        <a-input placeholder="用户名" style="width: auto;"></a-input>
        <a-button type="primary" icon="search" style="margin-left: 20px;">查询</a-button>
        <a-button type="primary" style="margin-left: auto;" @click="doEvent('create')">添加</a-button>
      </div>
    </a-card>
      <a-table
        :columns="columns"
        :row-key="record => record.user.id"
        :pagination="false"
        :data-source="dataSource"
        :loading="loading"
        style="background-color: white;margin-top: 10px;"
      >
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="doEvent('edit',record)">编辑</a-button>
          <a-button type="danger" style="margin-left: 5px;" @click="doEvent('delete',record)">删除</a-button>
        </template>
      </a-table>
      <a-pagination
          v-model="current"
          :page-size-options="pageSizeOptions"
          :total="total"
          show-size-changer
          :page-size="pageSize"
          @showSizeChange="onShowSizeChange"
        >
          <template slot="buildOptionText" slot-scope="props">
            <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
            <span v-if="props.value === '50'">全部</span>
          </template>
        </a-pagination>
  </div>
</template>
 
<script>
import axios from 'axios';
import { showTitle } from '@/libs/util';
import { mapState } from 'vuex';
import { Modal,message} from "ant-design-vue";
import Create from './create.vue';
import customBreadCrumb from '@/components/main2/components/header-bar/custom-bread-crumb'
import Edit from './edit.vue';

export default {
  components: {
        Create,
        Edit,
        customBreadCrumb
    },
    computed: {
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      pageSizeOptions: ['10', '20', '30', '40', '50'],
      current: 1,
      pageSize: 10,
      total: 50,

      columns: [
        {
          title: '用户名',
          dataIndex: 'user.userName',
          width: '20%',
          align:'center',
          customHeaderCell: () => {
            return {
              style: {
                backgroundColor: '#E2EBFC',
              }
            };
          },
        },
        {
          title: '角色',
          dataIndex: 'role.name',
          width: '20%',
          align:'center',
          customHeaderCell: () => {
            return {
              style: {
                backgroundColor: '#E2EBFC',
              }
            };
          },
        },
        {
          title: '权限',
          dataIndex: 'permissions',
          width: '20%',
          align:'center',
          customHeaderCell: () => {
            return {
              style: {
                backgroundColor: '#E2EBFC',
              }
            };
          },
        },
        {
          title: '创建时间',
          dataIndex: 'user.createTime',
          width: '20%',
          align:'center',
          customHeaderCell: () => {
            return {
              style: {
                backgroundColor: '#E2EBFC',
              }
            };
          },
        },
        {
          title: '操作',
          key: 'operation',
          width: '20%',
          align:'center',
          scopedSlots: { customRender: 'operation'},
          customHeaderCell: () => {
            return {
              style: {
                backgroundColor: '#E2EBFC',
              }
            };
          },
        }
      ],
      dataSource: [],
      loading: false,
    };
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    createFinish(){
      this.fetchData()
    },
    editFinish(){
      this.fetchData()
    },
    async queryData(params) {
      return axios.get('/hdapi/auth/user/page', {
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
          this.total = res.data.data.total
        })
        .finally(() => {
          this.loading = false;
        });
    },
    doEvent(event,item){
            switch (event) {
                case 'create':
                    this.$refs.create.show()
                    break;
                case 'delete':
                    this.delUser(item)
                    break;
                case 'edit':
                    this.$refs.edit.show(item)
                    break;
                default:
                    break;
            }
        },
    delUser(item){
      const url = `/hdapi/auth/user/delUser?id=${item.user.id}`;
            Modal.confirm({
                title: `请确认`,
                content: `是否删除用户【${item.user.userName}】?`,
                onOk: () => {
                  axios.delete(url)
                        .then(() => {
                            message.info(`删除成功`);
                            this.fetchData()
                        });
                },
                onCancel() {}
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
          this.total = this.dataSource.length
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
<style scoped>
.mtitle{
  margin-left: 20px;
}
</style>