<template>
    <a-modal
      :visible="visible"
      :width="1000"
      @cancel="Oncancel"
    >
      <template #title>
        <span class="modal-title">备件建议</span>
      </template>
            <TableList
                  :fixHeight="true"
                  ref="listView"
                  url="/sys/log/operation/page"
                  :columns="columns"
                  :paramsHandler="(params)=>{
                      if(params.beginTime)
                          params.beginTime = params.beginTime.format('YYYY-MM-DD HH:mm:ss')
                      if(params.endTime)
                          params.endTime = params.endTime.format('YYYY-MM-DD HH:mm:ss')
                      return params;
                  }"
              >
                  <template slot="column-operation" slot-scope="child">
                      {{ child.value }}
                  </template>
                  <template slot="column-module" slot-scope="child">
                      {{ child.value }}
                  </template>
                  <template slot="column-requestUri" slot-scope="child">
                      {{ child.value }}
                  </template>
                  <template slot="column-requestMethod" slot-scope="child">
                      {{ child.value }}
                  </template>
                  <template slot="column-ip" slot-scope="child">
                      {{ child.value }}
                  </template>
                  <template slot="column-creatorName" slot-scope="child">
                      {{ child.value }}
                  </template>
                  <template slot="column-createDate" slot-scope="child">
                      {{ child.value }}
                  </template>
            </TableList>
      <template slot="footer">
        <a-button v-show="false" key="cancel" @click="Oncancel">取消</a-button>
        <a-button v-show="false" key="submit" type="primary">生成备件建议</a-button>
      </template>
    </a-modal>
  </template>
  
  <script>
  import TableList from '../TableList.vue';
  const columns = {
    spareName: {
        title: "备件名称",
        align:'center',
        width: 50,
        titleAlign: "left",
        sortOrder:false,
        sorter:true,
    },
    spareNum: {
        title: "备件数目",
        align:'center',
        width: 50,
        titleAlign: "left",
        sortOrder:false,
        sorter:true,
    },
    spareFee: {
        title: "备件成本",
        align:'center',
        width: 50,
        titleAlign: "left",
        sortOrder:false,
        sorter:true,
    },
};

  export default {
    components:{
        TableList
    },
    data() {
      return {
        columns,
        visible: false,
        formData: {
          waters: '',
          speed: null,
          tonnage: null,
          budget: null,
          shipType: '',
          blockCoefficient: null,
          hullEfficiency: null,
          depth: null
        },
        items: [
          { label: '经济性', isEditable: false, value: null },
          { label: '排放性', isEditable: false, value: null },
          { label: '安全性', isEditable: false, value: null },
          { label: '燃料可供性', isEditable: false, value: null },
          { label: '技术成熟度', isEditable: false, value: null },
        ]
      }
    },
    methods: {
      handleClick() {
        this.checkedValue = !this.checkedValue;
      },
      show() {
        this.visible = true;
      },
      selectAll() {
        this.items.forEach(item => {
          item.isEditable = true;
        });
      },
      Oncancel(){
        this.visible=false
      },
      handleClear() {
        // 重置所有表单项的值
        this.formData = {
          waters: '',
          speed: null,
          tonnage: null,
          budget: null,
          shipType: '',
          blockCoefficient: null,
          hullEfficiency: null,
          depth: null
        };
        this.items.forEach(item => {
          item.isEditable = false;
          item.value = null;
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .div1 {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .div2 {
    display: flex;
    align-items: center;
    margin-left: 20px;
    margin-right: 20px;
  }
  
  .select1 {
    width: 150px !important;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 16px !important;
  }
  
  .switch-input-container {
    display: flex;
    align-items: center;
  }
  
  .switch {
    margin-right: 10px;
  }
  
  .form-item {
    margin-left: 20px;
  }
  
  .label-text {
    margin-right: 10px;
  }
  
  .error {
    color: red;
    margin-top: 5px;
  }
  </style>