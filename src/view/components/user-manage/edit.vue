<template>
    <a-modal :visible="visible" @cancel="Oncancel">
        <template #title>
            <span class="modal-title">新增用户</span>
        </template>
        <a-form
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            style="margin-right: 15%;"
        >
            <a-form-item
            label="用户名"
            name="username"
            :rules="[{ required: true, message: 'Please input your username!' }]"
            >
            <a-input :placeholder="user.userName" v-model="user.userName" />
            </a-form-item>

            <a-form-item
            label="密码"
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
            >
            <a-input v-model="user.password" />
            </a-form-item>

            <a-form-item
            label="角色"
            name="role"
            >
            <a-select v-model="role.name">
                <a-select-option value="admin">
                    管理员
                </a-select-option>
                <a-select-option value="user">
                    用户
                </a-select-option>
            </a-select>
            </a-form-item>

            <a-form-item
                label="权限"
                name="privilege"
                style="display: flex; align-items: center;"
            >
                <div style="display: flex; flex-wrap: wrap;">
                    <div v-for="item in privilegeName" :key="item.id" style="display: flex; align-items: center; margin-right: 16px;">
                        <span style="margin-right: 8px;">{{ item.name }}</span>
                        <a-checkbox v-model="privilege[item.key]"/>
                    </div>
                </div>
            </a-form-item>
            
            <a-form-item
            label="是否启用"
            name="status"
            >
                <a-select v-model="user.enabled">
                    <a-select-option :value='0'>
                        禁用
                    </a-select-option>
                    <a-select-option :value='1'>
                        启用
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <template slot="footer">
            <a-button  key="cancel" @click="Oncancel">取消</a-button>
            <a-button  key="submit" @click="Onsubmit" type="primary">确定</a-button>
        </template>
    </a-modal>
  </template>
  
<script>
import { message } from 'ant-design-vue';
export default {
    data() {
    return {
        visible:false,
        privilegeName:[
        {id:1,name:'增',key:'add'},
        {id:2,name:'删',key:'del'},
        {id:3,name:'改',key:'edit'},
        {id:4,name:'查',key:'check'}
      ],
        user:{
            userName: '',
            password: '',
            enabled:1
        },
        role:{name:'admin'},
        privilege:{
            add:false,
            del:false,
            edit:false,
            check:false
        }
      }
    },
  methods: {
    show(item){
        this.visible=true
        if (item) {
        this.user.userName = item.user.userName;
        this.user.id = item.user.id
      }
    },
    Onsubmit() {
        const permisson =[{ description: 'query', name: 'query' }];
        const datae = {
            id: this.user.id,
            permisson: permisson,
            role: this.role,
            user: this.user
        };
        this.$axios({
          url: "/hdapi/auth/user/updateUser",
          method: "put",
          data: datae
        }).then(()=>{
            message.info('修改成功！')
            this.$emit('editFinish')
            this.visible=false
        })
    },
    Oncancel(){
        this.visible=false
    }
  },
};
  </script>
  
  <style scoped>
 
  </style>