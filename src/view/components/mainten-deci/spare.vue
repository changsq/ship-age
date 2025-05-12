<template>
    <content>
    <Advise ref="advise"/>
    <a-modal
      :visible="visible"
      :width="1100"
      @cancel="Oncancel"
    >
      <template #title>
        <span class="modal-title">成本设置</span>
      </template>
      <a-card  title="监测成本" style="width: 90%; margin: auto;margin-bottom: 20px; background-color: #fbfbfb;">
        <a-form ref="form" class="div1">
          <a-form-item label="告警检测成本（元/次）" class="div2">
            <a-input-number v-model="formData.speed" id="inputNumber" />
          </a-form-item>
          <a-form-item label="检测成本（元/次）" class="div2">
            <a-input-number v-model="formData.tonnage" id="inputNumber" />
          </a-form-item>
        </a-form>
      </a-card>
      <a-card  title="维修成本" style="width: 90%; margin: auto;margin-bottom: 20px; background-color: #fbfbfb;">
        <a-form ref="form" class="div1">
          <a-form-item label="预防性维修成本（元/次）" class="div2">
            <a-input-number v-model="formData.speed" id="inputNumber" />
          </a-form-item>
          <a-form-item label="时候维修成本（元/次）" class="div2">
            <a-input-number v-model="formData.tonnage" id="inputNumber" />
          </a-form-item>
          <a-form-item label="大修成本（元/次）" class="div2">
            <a-input-number v-model="formData.budget" id="inputNumber" />
          </a-form-item>
          <a-form-item label="小修成本（元/次）" class="div2">
            <a-input-number v-model="formData.speed" id="inputNumber" />
          </a-form-item>
          <a-form-item label="计划维修时间（小时/次）" class="div2">
            <a-input-number v-model="formData.tonnage" id="inputNumber" />
          </a-form-item>
          <a-form-item label="事后维修时间（小时/次）" class="div2">
            <a-input-number v-model="formData.budget" id="inputNumber" />
          </a-form-item>
          <a-form-item label="大修时间（小时/次）" class="div2">
            <a-input-number v-model="formData.speed" id="inputNumber" />
          </a-form-item>
          <a-form-item label="小修时间（小时/次）" class="div2">
            <a-input-number v-model="formData.tonnage" id="inputNumber" />
          </a-form-item>
        </a-form>
      </a-card>
      <a-card style="width: 90%; margin: auto;margin-bottom: 20px; background-color: #fbfbfb;">
        <a-form ref="form" class="div1">
          <a-form-item label="质量损失成本" class="div2">
            <a-input-number v-model="formData.speed" id="inputNumber" />
          </a-form-item>
        </a-form>
      </a-card>
      <template slot="footer">
        <a-button  key="cancel" @click="Oncancel">取消</a-button>
        <a-button  key="submit" type="primary" @click="handleAdvise">生成备件建议</a-button>
      </template>
    </a-modal>
    </content>
  </template>
  
  <script>
import Advise from './advise.vue';

  export default {
    components: {
    Advise
  },
    data() {
      return {
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
      handleAdvise(){
        this.$refs.advise.show()
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