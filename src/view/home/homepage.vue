<template >
  <div class="login1">
      <div class="mtitle1">
          船舶备件预测性维护保养系统
      </div>
      <div class="div1">
        <Button class="hbutton1" type="primary" size="large" @click="showSM">状态监测</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showFD">故障数据</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showLP">寿命数据</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showMD">维修决策</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showLM">日志管理</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showSpare">备件管理</Button>
        <Button class="hbutton1" type="primary" size="large" @click="showUser">用户管理</Button>
      </div>
  </div>
</template>

<script>
import LoginForm from '@/components/login-form'
import { Button } from 'ant-design-vue'
export default {
  components: {
    LoginForm,
    Button
  },
  computed: {
    userAvatar () {
      return 'https://bpic.588ku.com/element_origin_min_pic/01/48/78/4157443e37c196f.jpg'
    }
  },
  methods: {
    showSM () {
      const status_monitor_main = 'status_monitor_main'
      this.$router.push({ name: status_monitor_main })
    },
    showFD () {
      const fault_data = 'fault_data'
      this.$router.push({ name: fault_data})
    },
    showLP () {
      const life_data = 'life_data'
      this.$router.push({ name: life_data })
    },
    showMD () {
      const mainten_decision = 'mainten_decision'
      this.$router.push({ name: mainten_decision })
    },
    showLM () {
      const log_manage = 'log_manage'
      this.$router.push({ name: log_manage })
    },
    showSpare () {
      const spare_manage = 'spare_manage'
      this.$router.push({ name: spare_manage })
    },
    showUser () {
      const user_manage = 'user_manage'
      this.$router.push({ name: user_manage })
    }
  }
}
</script>
<style scoped>
.login1 {
    height: 89vh;
    background-image: url('../../assets/images/login-bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
}
.div1{
    margin-top: 25%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
}
.mtitle1{
    text-align: center;
    padding-top: 5%;
    font-size: xx-large;
    font-weight: 1000;
}
.hbutton1{
    font-size: large;
}
</style>
