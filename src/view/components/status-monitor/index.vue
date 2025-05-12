<template>
  <div id="screen"
    :style="{ 'width': `${style.width}px`, 'height': `${style.height}px`, 'transform': `${style.transform}` }">
    <div id="container" @mouseenter="onMouseDblclick">

      <div class="modelMask" v-if="percentageBool">
        <div class="marg">
          <p>loading 3D model</p>
          <div class="elPro">
            <a-progress :percent="percentage" />
          </div>
        </div>
      </div>
      <bubble style="z-index: 1;" ref="Bubble" @selectDevice="handleSelectDevice" />
      <!-- 左 -->
      <div class="statusCode">
        <div class="codeText" v-if="changeInfo === 'SM' || changeInfo === 'FD'">数据更新时间：{{ codeTime }}</div>
        <div v-if="(changeInfo === 'SM' || changeInfo === 'FD') && statusCode != '200'" class="codeText">状态：{{
      statusCode }}
        </div>
      </div>
      <div class="back" @click="back">
                <img style="margin-right: -25px;" src="@/assets/back.svg">
                返回
              </div>
      <div class="buttons">
        <button style="background-color: transparent; border: none;" @click="clickSM">
          <dv-border-box-10 class="titleButton">
            <div class="titleFont" :style="{ color: changeInfo === 'SM' ? 'rgb(0, 186, 255)' : 'white' }">状态监测</div>
          </dv-border-box-10>
        </button>
        <button style="background-color: transparent; border: none;" @click="clickFD">
          <dv-border-box-10 class="titleButton">
            <div class="titleFont" :style="{ color: changeInfo === 'FD' ? 'rgb(0, 186, 255)' : 'white' }">故障监测</div>
          </dv-border-box-10>
        </button>
        <button style="background-color: transparent; border: none;" @click="clickLD">
          <dv-border-box-10 class="titleButton">
            <div class="titleFont" :style="{ color: changeInfo === 'LD' ? 'rgb(0, 186, 255)' : 'white' }">寿命预测</div>
          </dv-border-box-10>
        </button>
        <button style="background-color: transparent; border: none;" @click="clickMD">
          <dv-border-box-10 class="titleButton">
            <div class="titleFont" :style="{ color: changeInfo === 'MD' ? 'rgb(0, 186, 255)' : 'white' }">维修决策</div>
          </dv-border-box-10>
        </button>
      </div>
      <div
        style="background-color: rgb(58, 87, 114);margin-top:20px;margin-left: 900px; position:absolute;display: flex;z-index: 2000;">
        <a-select ref="select" v-model="curShipCode" style="width: 110px;" @change="shipChange">
          <a-select-option v-for="item in shipCodes" :value="item.shipCode" :key="item.shipCode">{{ item.message
            }}</a-select-option>
        </a-select>
      </div>
      <div class="topLeft">
        <dv-decoration-10 class="dv-dec-10" />
        <div class="topCenter">
          <dv-decoration-8 class="dv-dec-8" />
          <div class="topTitle">
            <span class="title-text" v-if="changeInfo === 'SM'">状态监测</span>
            <span class="title-text" v-if="changeInfo === 'FD'">故障监测</span>
            <span class="title-text" v-if="changeInfo === 'LD'">寿命预测</span>
            <span class="title-text" v-if="changeInfo === 'MD'">维修决策</span>
            <dv-decoration-6 class="dv-dec-6" />
          </div>
          <div class="topTitle" style="color: white;margin-top: 10px;font-size: large;" v-show="showPartTitle">NO.{{
      this.showDevice }}缸</div>

          <dv-decoration-8 class="dv-dec-8-s" />
        </div>
        <dv-decoration-10 class="dv-dec-10-s" />
      </div>
      <!-- 状态检测 -->
      <div class="large-left" v-show="changeInfo === 'SM'">
        <gradinfor ref="gradinfor" :wsdata="wsdata" @deviceChange="deviceChange"></gradinfor><!-- 左上角 -->
        <operationalstatus ref="operationalstatus" :wsdata="wsdata"></operationalstatus>
        <shipInfo ref="shipInfo"></shipInfo>
        <faultinfor ref="faultinfor"></faultinfor><!-- 右上角 -->
      </div>
      <!-- 故障监测 -->
      <div class="large-left" v-show="changeInfo === 'FD'">
        <WarningData ref="warningdata"></WarningData>
        <pie ref="pie"></pie>
        <warning ref="warning"></warning><!-- 右上角 -->
      </div>
      <!-- 寿命预测 -->
      <div class="large-left" v-show="changeInfo === 'LD'">
        <lifedata ref="lifedata" :curShipCode="curShipCode"></lifedata>
      </div>
      <!-- 维修决策 -->
      <div class="large-left" v-show="changeInfo === 'MD'">
        <sparedecision :curShipCode="curShipCode" ref="sparedecision"></sparedecision>
        <maintainsuggestion :curShipCode="curShipCode" ref="maintainsuggestion"></maintainsuggestion>
      </div>
      <!-- <div v-if='innerVisible' class="moveText"
       :style="{top:dragTop+'px',left:dragLeft+'px'}">
       <p align="center">运行信息</p>
      <p>名称: {{imfor.name}}</p>
      <p>ID: {{imfor.uuid}}</p>
      <p>x: {{imfor.x}}</p>
      <p>y: {{imfor.y}}</p>
    </div> -->
      <!-- <button @click="changemodel()" type="button" class="b-two">更换模型</button> -->
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gradinfor from '../bigscreen/GradInfor.vue'
import pie from '../bigscreen/Pie.vue'
import operationalstatus from '../bigscreen/OperationalStatus.vue'
import faultinfor from '../bigscreen/FaultInfor.vue'
import bubble from '../bigscreen/bubble.vue'
import warning from '../bigscreen/Warning.vue'
import WarningData from '../bigscreen/WarningData.vue'
import { sendWebsocket, closeWebsocket } from '/websocket.js'
import lifedata from '../bigscreen/LifeData.vue'
import sparedecision from '../bigscreen/sparedecision.vue'
import maintainsuggestion from '../bigscreen/maintainsuggestion.vue'
import ShipInfo from '../bigscreen/ShipInfo.vue'
import axios from 'axios';
export default {
  data() {
    return {
      showDevice: '',
      curShipCode: 'M016',
      wsdata: {},
      fddata: {},
      codeTime: '',
      statusCode: '200',
      clock: new THREE.Clock(),
      publicPath: process.env.BASE_URL,
      mesh: null,
      currentTime: 0,
      camera: null,
      selected: false,
      scene: null,
      renderer: null,
      controls: null,
      token: null,
      showPartTitle: false,
      animations: [],
      stats: {},
      vehicles: {},
      changeInfo: 'SM',
      percentage: 0,
      percentageBool: true,
      highlightedObject: null,
      style: {
        width: "1920",
        height: "1080",
        transform: "scaleY(1) scaleX(1) translate(-50%, -50%)"
      },

      imfor: {
        name: '',
        uuid: '',
        x: '',
        y: '',
      },
      dragTop: -100,
      dragLeft: -200,
      innerVisible: true,
      dialogVisible: false,
      // vehicleGroup : new THREE.Group(),
      // selVehicleGroup : new THREE.Group(),
      shipCodes: [],
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler(newRoute) {
        this.changeInfo = newRoute.meta.changeInfo;
      }
    }
  },
  components: {
    gradinfor,
    pie,
    bubble,
    operationalstatus,
    faultinfor,
    warning,
    WarningData,
    lifedata,
    sparedecision,
    maintainsuggestion,
    ShipInfo
  },
  created() {
  },
  mounted() {
    this.init()
    // window.addEventListener('click', this.onMouseDblclick)
    window.addEventListener('resize', this.setScale);
    let that = this;
    that.setScale();
    this.getShipCodes()
    this.getShipInfo();
    this.getToken()
    this.mountedHook()
  },
  beforeDestroy() {
    // 在组件销毁前移除窗口大小调整事件监听器
    closeWebsocket()
    window.removeEventListener('resize');
    window.removeEventListener('click');
    window.removeEventListener('dblclick');
    // window.removeEventListener('mousemove');
  },
  methods: {
    deviceChange(curDevice) {
      this.showDevice = curDevice;
    },
    getToken() {
      const token = sessionStorage.getItem('hdToken')
      if (token) {
        this.token = token
      } else {
        const hashPart = window.location.hash.slice(1);

        // 找到查询字符串部分
        const queryStringStart = hashPart.indexOf('?');
        if (queryStringStart !== -1) {
          const queryString = hashPart.slice(queryStringStart + 1);

          // 使用URLSearchParams解析查询字符串
          const hashParams = new URLSearchParams(queryString);
          const tokenValue = hashParams.get('token'); // 假设token是查询参数之一
          const shipCodeValue = hashParams.get('shipcode');
          if (tokenValue) { this.token = tokenValue; }
          if (shipCodeValue) { this.curShipCode = shipCodeValue; }
          sessionStorage.setItem('hdToken', this.token)
        }
      }
    },
    mountedHook() {
      // 生成一个动态的值，这里使用随机数作为示例
      const dynamicValue = Math.floor(Math.random() * 100);
      // 使用生成的动态值构建 WebSocket URL
      const websocketUrl = `/hdws/websocket/ws/${dynamicValue}?Authorization=${this.token}`;
      // 通过动态生成的 URL 建立 WebSocket 连接
      sendWebsocket(websocketUrl, this.wsMessage, this.token);
      // 初始化 WebSocket 消息处理
      this.wsMessage();
    },
    shipChange() {
      this.wsdata = {}
      this.fddata = {}
      this.mountedHook()
      this.$refs.lifedata.mountedHook()
      this.$refs.warning.handleTimePick()
      this.$refs.pie.handleTimePick()
      this.$nextTick(() => {
        this.$refs.sparedecision.mountedHook()
        this.$refs.maintainsuggestion.mountedHook()
      })
    },
    // 初始化
    init() {
      this.createScene() // 创建场景
      this.loadGLTF() // 加载GLTF模型
      this.createLight() // 创建光源
      this.createCamera() // 创建相机
      this.createRender() // 创建渲染器
      this.createControls() // 创建控件对象
      // this.initStats()
      this.animation()
      this.render()
    },
    handleSelectDevice(name) {
      this.deviceName = name
      this.$refs.lifedata.getDeviceName(this.deviceName)
      this.$refs.maintainsuggestion.getDeviceName(this.deviceName)
      this.$refs.sparedecision.getDeviceName(this.deviceName)
    },
    wsMessage(wsdata) {
      if (wsdata && wsdata.code) {
        this.statusCode = wsdata.code
        this.codeTime = wsdata.time
      }
      if (wsdata && wsdata.msg === 'statusMonitor' && wsdata.shipCode === this.curShipCode) {
        // if (this.curShipCode === 'test_01') {
        //   localStorage.setItem('wsdata1', JSON.stringify(wsdata))
        // } else if (this.curShipCode === 'test_02') {
        //   localStorage.setItem('wsdata2', JSON.stringify(wsdata))
        // }
        // 延迟执行
        this.wsdata = wsdata;
        if (this.$refs.operationalstatus && typeof this.$refs.operationalstatus.clickaa === 'function') {
          setTimeout(() => {
            this.$refs.operationalstatus.clickaa();
          }, 0);
        }
        if (this.$refs.gradinfor && typeof this.$refs.gradinfor.clickss === 'function') {
          setTimeout(() => {
            this.$refs.gradinfor.clickss();
          }, 0);
        }

      } else if (wsdata && wsdata.msg === 'faultDetection' && wsdata.shipCode === this.curShipCode) {

        // if (this.curShipCode === 'test_01') {
        //   localStorage.setItem('fddata1', JSON.stringify(wsdata))
        // } else if (this.curShipCode === 'test_02') {
        //   localStorage.setItem('fddata2', JSON.stringify(wsdata))
        // }
        setTimeout(() => {  // 延迟执行
          this.fddata = wsdata;
          if (this.$refs.warningdata && typeof this.$refs.warningdata.clickaa === 'function') {
            this.$refs.warningdata.clickaa(this.fddata);
          }
        }, 0);
      }
    },
    async queryData(url, params) {
      return axios.get(url, {
        params,
      });
    },
    getShipCodes() {
      this.queryData('/hdapi/server/ShipInfo/Page', {
        current: '1',
        size: '20'
      }).then(res => {
        // console.log('shipcode', res.data.data.list);
        this.shipCodes = res.data.data.list
      })
    },
    getShipInfo() {
      const url = `/hdapi/RULserver/ship/find`
      const datae = {
        shipCode: this.curShipCode,
      }
      this.$axios({
        url: url,
        method: "post",
        data: datae
      }).then((res) => {
        this.shipInfo = res.data
        this.$refs.shipInfo.getShipInfo(this.shipInfo);
      })
    },
    changemodel() {
      this.dialogVisible = true;
    },
    getScale() {
      const w = window.innerWidth / this.style.width;
      const h = window.innerHeight / this.style.height;
      return { x: w, y: h };
    },
    setScale() {
      let scale = this.getScale();
      this.style.transform = "scaleY(" + scale.y + ") scaleX(" + scale.x + ") translate(-50%, -50%)";
    },
    back() {
      if (window.parent) {
        window.parent.postMessage({ showbigScreen: false }, '*')
      } else {
        this.$router.push('/home')
      }
    },
    // 创建场景
    createScene() {
      window.THREE = THREE
      this.scene = new THREE.Scene()
      Window.Scene = this.scene
      // this.scene.background = new THREE.Color( 0x000000 );
    },
    // 加载GLTF模型
    loadGLTF() {
      const THIS = this
      const loader = new GLTFLoader()
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      this.model = {}
      this.box = {}

      loader.load(`${THIS.publicPath}combustion.glb`, gltf => {
        const model = gltf.scene;
        model.rotation.x = -Math.PI / 2;
        model.rotation.z = Math.PI / 4;
        model.scale.set(7, 7, 7);
        this.scene.add(model);

        // 保存原始颜色以便在鼠标离开时恢复
        const originalColors = {};

        // 强制更新所有 mesh 的包围盒
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              // 创建材质的副本
              child.material = child.material.clone();
              // 设置其他必要的属性
              child.material.needsUpdate = true;
            }
            child.geometry.computeBoundingBox(); // 计算包围盒
            child.geometry.computeBoundingSphere(); // 计算包围球（可选）
            originalColors[child.id] = child.material.color.clone(); // 保存原始颜色
          }
        });
        const targetMeshes = [[
          model.children[0].children[66],
          model.children[0].children[67],
          model.children[0].children[68],
          model.children[0].children[69]
        ],
        [
          model.children[0].children[62],
          model.children[0].children[63],
          model.children[0].children[64],
          model.children[0].children[65]
        ],
        [
          model.children[0].children[58],
          model.children[0].children[59],
          model.children[0].children[60],
          model.children[0].children[61]
        ],
        [
          model.children[0].children[54],
          model.children[0].children[55],
          model.children[0].children[56],
          model.children[0].children[57]
        ],
        [
          model.children[0].children[50],
          model.children[0].children[51],
          model.children[0].children[52],
          model.children[0].children[53]
        ],
        [
          model.children[0].children[45],
          model.children[0].children[46],
          model.children[0].children[47],
          model.children[0].children[48]
        ]]
        // console.log(model.children[0].children[49]);
        // 监听鼠标移动事件
        // window.addEventListener('mousemove', (event) => {
        //   pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        //   pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //   raycaster.setFromCamera(pointer, this.camera);

        //   // 进行射线检测
        //   const intersects = raycaster.intersectObjects(model.children[0].children, true);
        //   const objects = intersects.map(object => object.object);
        //   if (intersects.length > 0) {
        //     // 如果有对象被检测到，变色
        //     for (let i = 0; i < 6; i++) {


        //       if (targetMeshes[i].includes(objects[0])) {
        //         targetMeshes[i].forEach(mesh => {
        //           mesh.material.color.set(0xff0000);// 变成红色
        //         });
        //         this.showDevice = i + 1;
        //       } else {
        //         //   // 恢复原始颜色
        //         targetMeshes[i].forEach(mesh => {
        //           mesh.material.color.copy(originalColors[mesh.id]); // 恢复原始颜色
        //         });
        //       }
        //     }
        //     this.showPart();
        //     // this.$refs.Bubble.show();
        //   } else {
        //     //   // 恢复原始颜色
        //     for (let i = 0; i < 6; i++) {
        //       targetMeshes[i].forEach(mesh => {
        //         mesh.material.color.copy(originalColors[mesh.id]); // 恢复原始颜色
        //       });
        //     }
        //     this.hidePart();
        //   }

        // });
        window.addEventListener('dblclick', (event) => {
          if (!this.$refs.Bubble.$el.contains(event.target)) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(pointer, this.camera);

            // 进行射线检测
            const intersects = raycaster.intersectObjects(model.children[0].children, true);
            const objects = intersects.map(object => object.object);
            if (intersects.length > 0) {
              this.selected = false
              for (let i = 0; i < 6; i++) {
                if (targetMeshes[i].includes(objects[0])) {
                  targetMeshes[i].forEach(mesh => {
                    mesh.material.color.set('rgb(61,251,255)');
                  });
                  this.showPart()
                  for (let j = 0; j < 6; j++) {
                    if (j != i) {
                      targetMeshes[j].forEach(mesh => {
                        mesh.material.color.copy(originalColors[mesh.id]); // 恢复原始颜色
                      });
                    }
                  }
                  this.showDevice = i + 1;
                  this.$refs.gradinfor.deviceChoose(this.showDevice)
                  this.$refs.faultinfor.getDeviceId(this.showDevice)
                  this.$refs.lifedata.getDeviceId(this.showDevice)
                  this.$refs.maintainsuggestion.getDeviceId(this.showDevice)
                  this.$refs.Bubble.show(this.showDevice);
                  this.selected = true;
                }
              }
              if (!this.selected) {
                const showDevice = null
                this.$refs.faultinfor.getDeviceId(showDevice)
                this.$refs.lifedata.getDeviceId(showDevice)
                this.$refs.maintainsuggestion.getDeviceId(showDevice)
                for (let i = 0; i < 6; i++) {
                  targetMeshes[i].forEach(mesh => {
                    mesh.material.color.copy(originalColors[mesh.id])
                  });
                }
                this.showPartTitle = false;
              }
            }
            else {
            }

          }
        });
        window.addEventListener('click', (event) => {
          if (!this.$refs.Bubble.$el.contains(event.target)) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(pointer, this.camera);

            // 进行射线检测
            const intersects = raycaster.intersectObjects(model.children[0].children, true);
            const objects = intersects.map(object => object.object);
            if (intersects.length > 0) {
              this.selected = false
              for (let i = 0; i < 6; i++) {
                if (targetMeshes[i].includes(objects[0])) {
                  targetMeshes[i].forEach(mesh => {
                    mesh.material.color.set('rgb(61,251,255)');
                  });
                  this.showPart()
                  for (let j = 0; j < 6; j++) {
                    if (j != i) {
                      targetMeshes[j].forEach(mesh => {
                        mesh.material.color.copy(originalColors[mesh.id]); // 恢复原始颜色
                      });
                    }
                  }
                  this.showDevice = i + 1;
                  this.$refs.gradinfor.deviceChoose(this.showDevice)
                  this.$refs.faultinfor.getDeviceId(this.showDevice)
                  this.$refs.lifedata.getDeviceId(this.showDevice)
                  this.$refs.maintainsuggestion.getDeviceId(this.showDevice)
                  // this.$refs.Bubble.show(this.showDevice);
                  this.selected = true;
                }
              }
              if (!this.selected) {
                const showDevice = null
                this.$refs.faultinfor.getDeviceId(showDevice)
                this.$refs.lifedata.getDeviceId(showDevice)
                this.$refs.maintainsuggestion.getDeviceId(showDevice)
                for (let i = 0; i < 6; i++) {
                  targetMeshes[i].forEach(mesh => {
                    mesh.material.color.copy(originalColors[mesh.id])
                  });
                }
                this.showPartTitle = false;
              }
            }
            else {
            }

          }
        })
        this.mixer = new THREE.AnimationMixer(model)
        // const clip = model.animations[0]
        // var action = this.mixer.clipAction(model)
        // this.action.paused = true;
        this.mixer.timeScale = 0.5
        // action.setDuration(2).play()
        // action.play()
        for (var i = 0; i < model.animations.length; i++) {
          this.mixer.clipAction(model.animations[i]).play();
        }
        // document.querySelector('.large-left').innerHTML = 'sssssssssssss'
        // console.log(this.scene)
        this.model.geometry = this.scene.children[3].children[0].geometry;
        this.percentageBool = false;

        // console.log(this.scene.children[0].geometry)
        this.vehicleGroup = new THREE.Group();
        this.selVehicleGroup = new THREE.Group();

        this.model.geometry.computeBoundingBox();
        const box3 = new THREE.Box3().copy(this.model.geometry.boundingBox);
        // console.log(box3)
        const boxSize = box3.getSize(new THREE.Vector3());
        const boxCenter = box3.getCenter(new THREE.Vector3());
        const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z);

        boxGeometry.translate(boxCenter.x, boxCenter.y, boxCenter.z);
        const boxMaterial = new THREE.MeshBasicMaterial();
        this.box = new THREE.Mesh(boxGeometry, boxMaterial);
        // console.log(this.box)
      },
        function (xhr) {
          THIS.percentage = Math.floor(xhr.loaded / xhr.total * 100);
          // console.log(xhr.total)
        },
        function (err) {
          console.error('An error happened');
        }
      )
    },

    showPart() {
      this.showPartTitle = true;
    },
    hidePart() {
      this.showPartTitle = false;
    },
    clickSM() {
      this.changeInfo = 'SM';
      const path = 'SM'
      this.mountedHook()
      this.$router.push({ name: path })
    },
    clickFD() {
      this.changeInfo = 'FD';
      const path = 'FD'
      this.$router.push({ name: path })
    },
    clickLD() {
      this.changeInfo = 'LD';
      const path = 'LP'
      this.$refs.lifedata.mountedHook()
      this.$router.push({ name: path })
    },
    clickMD() {
      this.changeInfo = 'MD';
      const path = 'MD'
      this.$router.push({ name: path })
    },
    // 创建光源
    createLight() {
      // 环境光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5) // 创建环境光
      this.scene.add(ambientLight) // 将环境光添加到场景

      const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
      spotLight.position.set(0, 80, 20)
      spotLight.castShadow = true
      this.scene.add(spotLight)
    },

    pause() {
      if (this.action.paused) {
        // 如果是播放状态，设置为暂停状态
        this.action.paused = false;
      } else {
        // 如果是暂停状态，设置为播放状态
        this.action.paused = true;
      }
    },

    // 创建相机
    createCamera() {
      const element = document.getElementById('container')
      const width = element.clientWidth // 窗口宽度
      const height = element.clientHeight // 窗口高度
      const k = width / height // 窗口宽高比
      // PerspectiveCamera( fov, aspect, near, far )
      this.camera = new THREE.PerspectiveCamera(45, k, 0.1, 2000)
      this.camera.position.set(150, 150, 150) // 设置相机位置

      this.camera.lookAt(new THREE.Vector3(20, 40, 0)) // 设置相机方向
      this.scene.add(this.camera)
    },
    // 创建渲染器
    createRender() {
      const element = document.getElementById('container')
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setClearAlpha(0.2);
      this.renderer.setSize(element.clientWidth, element.clientHeight) // 设置渲染区域尺寸
      this.renderer.shadowMap.enabled = false // 显示阴影
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      // this.renderer.setClearColor(0xffffff, 1) // 设置背景颜色
      element.appendChild(this.renderer.domElement)
    },

    // initStats() {
    //           this.stats = new this.ThreeStats.Stats();
    //           //这里说一下所有这种放到dom的对象都可以进行样式操作
    //           document.body.appendChild(this.stats.dom)
    //       },

    /**
* 将屏幕坐标转换为3d 坐标
*/
    getIntersects(event) {
      event.preventDefault();
      // console.log("event.clientX:" + event.clientX)
      // console.log("event.clientY:" + event.clientY)
      // const selBoxMesh = this.box.clone();
      // console.log(selBoxMesh);
      // this.vehicles.selBoxMesh = selBoxMesh;
      // this.selVehicleGroup.add(this.vehicles.selBoxMesh);

      // console.log(this.selVehicleGroup)
      // 声明 raycaster 和 mouse 变量
      var raycaster = new THREE.Raycaster();
      var mouse = new THREE.Vector2();
      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      //通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, this.camera);

      // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      var intersects = raycaster.intersectObjects(this.scene.children, true);


      //返回选中的对象
      // console.log(intersects)
      return intersects;
    },

    // showObject (obj,event) {
    //   // console.log(obj.name)
    //   // console.log("event.clientX:" + event.clientX)
    //   this.dragTop = event.clientY - 50
    //   this.dragLeft = event.clientX - 50
    //   this.imfor.name = obj.name
    //   this.imfor.uuid = obj.uuid
    //   this.imfor.x = event.clientX
    //   this.imfor.y = event.clientY
    //   },

    onMouseDblclick(event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      let intersects = this.getIntersects(event);
      if (intersects.length != 0 && intersects[0].object instanceof THREE.Mesh) {
        const selectedObject = intersects[0].object;
        //   if(this.highlightedObject){
        //     this.highlightedObject.material.emissive.setHex(0x000000);
        //     this.innerVisible = false
        //   }
        //   // if(selectedObject.userData.modelnum === 'model1'){
        //   //     this.innerVisible = true
        //   //   }
        //   // this.showObject (selectObject,event)
        //   selectedObject.material.emissive.setHex(0xD6CCCC);
        //   this.highlightedObject = selectedObject;
        //   this.innerVisible = true
        // }
        // else{
        //   this.innerVisible = false
        //   if (this.highlightedObject){
        //     this.highlightedObject.material.emissive.setHex(0x000000);
        //     this.highlightedObject = null;
        //   }
      }
    },

    // changeMaterial(object) {
    //   let material = new THREE.MeshLambertMaterial({
    //     color: 0xfff5f2,
    //     transparent: object.material.transparent ? false : true,
    //   });
    //   object.material = material;
    //   },

    render() {
      if (this.mixer) {
        const delta = this.clock.getDelta() // 获取自上次调用的时间差
        this.mixer.update(delta)
      }
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(this.render)
    },
    animation() {
      this.controls.update()
      requestAnimationFrame(this.animation)
      this.renderer.render(this.scene, this.camera)
      // this.stats.update()
    },
    // 创建控件对象
    createControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    }
  }
}
</script>
<style scoped>
#container {
  /* position: absolute; */
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url("../../../assets/images/bg.jpg");
  background-size: cover;
  background-position: center center;
}

.dialog {
  position: absolute;
}

#screen {
  transform-origin: 0 0;
  position: fixed;
  left: 50%;
  top: 50%;
  transition: 0.3s;
}

.topLeft {
  width: 500px;
  height: 50px;
  position: absolute;
  top: 50px;
}

.topCenter {
  width: 200px;
  height: 50px;
  position: absolute;
  /* top: 10px; */
}

.topTitle {
  position: relative;
  width: 300px;
  height: 10px;
  top: 80px;
  left: 800px;
  text-align: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.title-text {
  font-size: 24px;
  position: absolute;
  left: 100px;
  top: -40px;
  color: #fff
    /* transform: translate(-50%); */
}

.dv-dec-6 {
  width: 300px;
  height: 5px;
  text-align: center;
  position: absolute;
}

.dv-dec-10 {
  /* width: 50px; */
  width: 700px;
  height: 5px;
  top: 25px;
  position: absolute;
}

.dv-dec-8 {
  height: 5px;
  top: 50px;
  left: 600px;
  position: absolute;
  color: decorationColor
}

.dv-dec-10-s {
  /* transform: rotateY(180deg); */
  height: 5px;
  top: 25px;
  position: absolute;
  left: 1400px;
}

.dv-dec-8-s {
  transform: rotateY(180deg);
  top: 50px;
  height: 5px;
  position: absolute;
  left: 1100px;
}

.large-left {
  position: absolute;
  height: calc(100% - 80px);
  width: calc(40% - 80px);
  top: 50px;
}

.modelMask {
  position: absolute;
  left: 0;
  top: -100px;
  width: 100%;
  height: 100%;
  background: transparent;
  background-size: 100% 100%;
  z-index: 1;
  display: flex
}

.modelMask .marg {
  width: 300px;
  height: 60px;
  margin: auto;
  text-align: center;
}


.moveText {
  position: absolute;
  padding: 20px;
  background: rgba(30, 111, 155, 0.8);

}

.modelMask .elPro {
  width: 100%;
  margin-top: 10px;
}

.modelMask p {
  color: #e2e2e2;
  font-size: 13px;
}

.p {
  font-size: 20px;
  text-align: left;
  color: #fff;
}

.back {
  z-index: 1001;
  color: #3775FF;
  display: flex;
  align-items: center;
  position: absolute;
  margin-left: 95%;
  margin-top: 25px;
  cursor: pointer;
}

.titleButton {
  width: 200px;
  height: 50px;

}

.titleFont {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}

.b-two {
  height: 30px;
  width: 60px;
  position: absolute;
  left: 750px;
  top: 200px;
}

.buttons {
  position: absolute;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  padding: 0 150px;
  margin-top: 10px;
  color: white;
  font-size: large;
}

.statusCode {
  margin: 5%;
  position: absolute;
}

.codeText {
  color: white;
  font-size: large;
}

/* .stats {
width: 100%;
height: 50px;
position: relative;
} */
</style>