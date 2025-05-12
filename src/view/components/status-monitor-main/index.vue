<template>
  <div id="screen" :style="{'width':`${style.width}px`,'height':`${style.height}px`,'transform':`${style.transform}`}">
  <div id="container" @mouseenter="onMouseDblclick">
      <!-- 左 -->
      <div class="topLeft">
        <dv-decoration-10 class="dv-dec-10"/>
        <div class="topCenter">
          <dv-decoration-8 class="dv-dec-8"/>
          <div class="topTitle">
              <span class="title-text">状态监测主页</span>
              <dv-decoration-6 class="dv-dec-6"/>
            </div>
          <dv-decoration-8 class="dv-dec-8-s"/>
        </div>
        <dv-decoration-10 class="dv-dec-10-s"/>
      </div>
      <div class="map-container">
        <div class="map-point point1">
          <div style="color: white;width: 100px;">船舶1号</div>
          <img src="@/assets/images/mapPoint.png" alt="Map Point" @click="handleClick">
        </div>
        <div class="map-point point2">
          <div style="color: white;width: 100px;">船舶2号</div>
          <img src="@/assets/images/mapPoint.png" alt="Map Point" @click="handleClick">
        </div>
        <div class="map-point point3">
          <div style="color: white;width: 100px;">船舶3号</div>
          <img src="@/assets/images/mapPoint.png" alt="Map Point" @click="handleClick">
        </div>
      </div>
    <button @click="back()" type="button" class="b-one"></button>
  </div>
</div>
</template>

<script>
import * as THREE from 'three'

export default {
  
  data() {
    return {
      style: {
        width: "1920",
        height: "1080",
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
      },

    }
  },

  mounted() {
    // window.addEventListener('click', this.onMouseDblclick)
    window.addEventListener('resize', this.setScale);
    let that = this;
    that.setScale();
      /*窗口改变事件*/
  },
  beforeDestroy() {
    // 在组件销毁前移除窗口大小调整事件监听器
    window.removeEventListener('resize', this.setScale);
  },
  methods: {
    // 初始化
    handleClick(){
      const status_monitoring = 'SM'
      this.$router.push({ name: status_monitoring })
    },
    getScale() {
      const w = window.innerWidth / this.style.width;
      const h = window.innerHeight / this.style.height;
      return {x:w,y:h};
    },
    setScale() {
      let scale = this.getScale();
      this.style.transform = "scaleY(" + scale.y + ") scaleX(" + scale.x + ") translate(-50%, -50%)";
    },
    back(){
      this.$router.push('/home')
    },


  onMouseDblclick(event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      let intersects = this.getIntersects(event);
      if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
        const selectedObject = intersects[0].object;
      }
    },

  }
}
</script>
<style scoped>

.map-container {
    position: relative;
    width: 1920px; /* 容器宽度 */
    height: 1080px; /* 容器高度 */
  }

  .map-point {
    position: absolute;
    width: 15px; /* 图片宽度 */
    height: auto; /* 图片高度自动适应 */
  }

  .point1{
    width: 100px;
    top: 500px; /* 上偏移量 */
    left: 1000px; /* 左偏移量 */
  }

  .point2 {
    top: 800px; /* 上偏移量 */
    left: 600px; /* 左偏移量 */
  }

  .point3 {
    top: 600px; /* 上偏移量 */
    left: 1600px; /* 左偏移量 */
  }

#container {
  /* position: absolute; */
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url("../../../assets/images/map.png");
  background-size: cover;
  background-position: center center;
}
.dialog{
  position: absolute;
}
#screen{
    z-index: 100;
    transform-origin: 0 0;
    position: fixed;
    left: 50%;
    top: 50%;
    transition: 0.3s;
}
.topLeft{
  width: 500px;
  height: 50px;
  position: absolute;
  top: 10px;
}
.topCenter{
  width:200px;
  height: 50px;
  position: absolute;
  /* top: 10px; */
}
.topTitle{
  position: relative;
  width: 300px;
  height: 10px;
  top: 80px;
  left:800px;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.title-text {
  font-size: 24px;
  position: absolute;
  left: 70px;
  top: -40px;
  color:#fff
  /* transform: translate(-50%); */
}
.dv-dec-6{
  width: 300px;
  height: 5px;
  text-align: center;
  position: absolute;
}
.dv-dec-10{
  /* width: 50px; */
  width: 700px;
  height: 5px;
  top:25px;
  position: absolute;
}
.dv-dec-8{
  height: 5px;
  top:50px;
  left:600px;
  position: absolute;
  color: decorationColor
}
.dv-dec-10-s{
  /* transform: rotateY(180deg); */
  height: 5px;
  top:25px;
  position: absolute;
  left: 1400px;
}
.dv-dec-8-s{
  transform: rotateY(180deg);
  top:50px;
  height: 5px;
  position: absolute;
  left: 1100px;
}


</style>