<style lang="less">
  @import './login.less';
</style>

<template>
<div class="login">
  <div class="lhead">
    <div class="lhead-text">统一身份认证</div>
  </div>
    <div class="mtitle">
        船舶备件预测性维护保养系统
    </div>
    <div class="login-con" style="opacity: 0.95;">
      <Card icon="log-in" title="账号登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
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
  data(){
    return{
      username:'',
      password:''
    }
  },
  methods: {
    handleSubmit ({ userName, password }) {
      // this.handleLogin({ userName, password }).then(res => {
      //   this.getUserInfo().then(res => {
          // this.$router.push({
          //   name: this.$config.homeName
          // })
      //   })
      // })
      this.username=userName
      this.password=password

      // this.$axios({
      //     url: "/hdapi/auth/user/login",
      //     method: "post",
      //     data: {
      //       userName: this.username,
      //       password: this.password,
      //     },
      //   })
      //     .then((res) => {
			// console.log(res.data)
        //  if(res.data.code=="200"){
				// sessionStorage.setItem("token",res.data.data.access_token)
				// sessionStorage.setItem('id', res.data.data.id)
				this.$router.push('/home')
 		// 	}
		// 	else{
		// 		alert("账号密码错误！")
		// 	}
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //       });
    }
  }
}
</script>
