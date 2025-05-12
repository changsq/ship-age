<template>
  <div class="global-component" v-show="available">
    <div class="dv-border">
      <dv-border-box-1>
        <button @click="hide()" type="button" class="b-one"></button>
        <div class="title">
          <dv-decoration-7>NO.{{ id }}缸部件</dv-decoration-7>
        </div>
        <div class="items-container">
          <div class="test"></div>
          <!-- 模型展示 -->
          <!-- <div v-for="(model, index) in models" :key="'model-' + index" class="model-item">
            <div class="part-name">{{ nameMapping[model.path] || '未定义名称' }}</div>
            <div class="three-container" :id="'three-container-' + index"></div>
          </div> -->
          <!-- 图片展示 -->
          <div @click="selectDevice(item.name)" v-for="item in imagePaths" :key="item.name" class="image-item">
            <div class="part-name">{{ nameMapping[item.path] || '未定义名称' }}</div>
            <div class="image-container">
              <img :src="item.path" :alt="nameMapping[item.path]" class="item-image" />
            </div>
          </div>
        </div>
      </dv-border-box-1>
    </div>
    <div class="global-component-footer"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const publicPath = process.env.BASE_URL
export default {
  data() {
    return {
      id: 1,
      publicPath: process.env.BASE_URL,
      available: false,

      // 定义图片路径数组
      imagePaths: [
        {
          name: '高压油泵',
          path: `${publicPath}高压油泵.jpg`
        },
        {
          name: '缸头排气阀',
          path: `${publicPath}缸头排气阀.png`
        },
        {
          name: '缸盖总体',
          path: `${publicPath}缸盖总体.png`
        },
        {
          name: '缸套',
          path: `${publicPath}缸套.png`
        },
        {
          name: '活塞组件',
          path: `${publicPath}活塞组件.jpg`
        },
        {
          name: '喷油器',
          path: `${publicPath}喷油器.png`
        },
        {
          name: '缸头起动阀',
          path: `${publicPath}缸头起动阀.png`
        },
      ],
      // 定义模型路径数组
      modelPaths: [
        // `${publicPath}paiqifa.glb`, `${publicPath}ganggai.glb`, `${publicPath}gangtao.glb`, 
        // `${publicPath}huosai.glb`, `${publicPath}penyouzui.glb`,  `${publicPath}qidongfa.glb`, 
        `${publicPath}youbeng.glb`,
      ],
      models: [],
      // 模型名称映射表
      nameMapping: {
        // [`${publicPath}paiqifa.glb`]: "缸头排气阀",
        // [`${publicPath}ganggai.glb`]: "缸盖总体",
        // [`${publicPath}gangtao.glb`]: "缸套",
        // [`${publicPath}huosai.glb`]: "活塞组件",
        // [`${publicPath}penyouzui.glb`]: "喷油器",
        // [`${publicPath}youbeng.glb`]: "高压油泵",
        // [`${publicPath}qidongfa.glb`]: "缸头起动阀",

        [`${publicPath}高压油泵.jpg`]: "高压油泵",
        [`${publicPath}缸头排气阀.png`]: "缸头排气阀",
        [`${publicPath}缸盖总体.png`]: "缸盖总体",
        [`${publicPath}缸套.png`]: "缸套",
        [`${publicPath}活塞组件.jpg`]: "活塞组件",
        [`${publicPath}喷油器.png`]: "喷油器",
        [`${publicPath}缸头起动阀.png`]: "缸头起动阀",
      },
    };
  },

  mounted() {
    this.loadModels(this.modelPaths);
  },

  methods: {
    show(id) {
      this.available = true;
      this.id = id
    },
    selectDevice(name) {
      this.$emit('selectDevice', name)
    },
    hide() {
      this.available = false;
      const name = ''
      this.$emit('selectDevice', name)
    },
    loadModels(modelPaths) {
      const loader = new GLTFLoader();
      this.models = [];
      const loadPromises = modelPaths.map((modelPath, index) => {
        return new Promise((resolve) => {
          loader.load(modelPath, (gltf) => {
            const model = gltf.scene;
            this.models.push({ path: modelPath, model: model }); // 存储路径和模型
            resolve(model);
          }, undefined, (error) => {
            console.error('Error loading model:', modelPath, error);
            this.models.push({ path: modelPath, model: null }); // 存储路径和空模型
            resolve(null);
          });
        });
      });
      // 等待所有模型加载完成后调用 createThreeScene
      Promise.all(loadPromises).then(() => {
        this.$nextTick(() => { // 确保在所有模型加载后再调用
          this.models.forEach((item, index) => {
            this.createThreeScene(item, index);
          });
        });
      });
    },

    createThreeScene(item, index) {
      this.$nextTick(() => {
        const container = document.getElementById(`three-container-${index}`);

        // 创建场景
        const scene = new THREE.Scene();
        // 创建相机
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
        camera.position.set(0, 0, 180);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(camera);

        // 创建渲染器
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearAlpha(0.2);
        // renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x00008B, 0);  // 0x00008B 是深蓝色，1 表示完全不透明
        renderer.setSize(150, 150);
        container && container.appendChild(renderer.domElement);

        // 添加光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, 80, 20);
        spotLight.castShadow = true;
        scene.add(spotLight);

        // 添加模型
        item.model.scale.set(4, 4, 4);
        item.model.rotation.y = Math.PI / 2; // 旋转模型
        scene.add(item.model);

        // 循环渲染
        const animate = () => {
          requestAnimationFrame(animate);
          // item.model.rotation.y += 0.03; // 控制每个模型的旋转速度
          renderer.render(scene, camera);
        };
        animate();

      });
    },
  }
}
</script>

<style scoped>
.global-component {
  /* position: fixed; */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hide;
  position: absolute;
  /* background-image: url("../../../assets/images/line.png"); */
  background: url(../../../assets/images/line.png) rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(25, 186, 139, 0.17);
  background-size: cover;
  background-position: center center;
  padding: 1px;
}

.global-component::before {
  position: absolute;
  left: 0;
  top: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}

.global-component::after {
  position: absolute;
  right: 0;
  top: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-top: 2px solid #02a6b5;
  content: "";
}

.global-component .global-component-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.global-component .global-component-footer::before {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-left: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}

.global-component .global-component-footer::after {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  border-right: 2px solid #02a6b5;
  border-bottom: 2px solid #02a6b5;
  content: "";
}

.title {
  display: flex;
  justify-content: center;
}

.dv-border {
  padding-top: 10px;
  width: 720px;
  /* 设置宽度 */
  height: auto;
  /* 改为自动高度 */
  max-height: 600px;
  /* 设置最大高度 */
  font-size: large;
  color: white;
  /* overflow: hidden; 避免溢出 */
}

.b-one {
  height: 30px;
  width: 60px;
  margin-left: 94%;
  position: absolute;
  background-color: transparent;
  border-style: none;
  background-image: url('../../../assets/close.png');
  background-size: 30px;
  background-repeat: no-repeat;
}

.items-container {
  display: flex;
  flex-wrap: wrap;
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-grow: 1;
  margin: 10px;
  /* border: 2px solid blue;  */
}

.image-item,
.model-item {
  width: 100%;
  /* 使项宽度自适应 */
  max-width: 150px;
  /* 限制最大宽度 */
  margin: 10px;
  text-align: center;
}

.part-name {
  min-height: 30px;
  /* 设置最小高度，保持占位 */
  font-size: large;
  /* 增加字体大小 */
  color: white;
  /* 设置字体颜色为白色 */
  margin-top: 5px;
  /* 增加上边距 */

}

.item-image {
  /* width: 150px;
  height: auto;
  border: 1px solid #ddd;
  border-radius: 5px; */
  width: 100%;
  /* 使图片自适应容器 */
  max-width: 115px;
  height: auto;
  border-radius: 5px;

}

.image-container,
.three-container {
  height: 220px;
  /* 设置固定高度 */
  /* width: 150px; 设置固定宽度 */
  width: 100%;
  max-width: 150px;
  /* 保持一致的最大宽度 */
  background-color: rgb(3, 169, 244);
  /*设置背景颜色为灰色*/
  /* position: relative; 确保能够设置内容的尺寸 */
  /* background-image: url("../../../assets/images/bg.jpg"); */
  background-size: cover;
  background-position: center center;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
}

.test {
  height: 0px;
  /* 设置固定高度 */
  width: 100%;
  /* 设置固定宽度 */
  background-color: #d3d3d3;
  /* 设置背景颜色为灰色 */
}
</style>
