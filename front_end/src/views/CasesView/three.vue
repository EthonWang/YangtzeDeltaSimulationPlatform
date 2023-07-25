<template>
  <div id="container"></div>
</template>

<script setup>
import * as THREE from "three";
import Terrain from "three-terrain";
// import "three.terrain.js/build/THREE.Terrain.js";
import { Scene } from "three/src/scenes/Scene.js";
import { backUrl, backUrl_backup } from "./../../../public/backURL/backurl";
console.log(THREE.Terrain);
let scene = new Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
// 创建渲染器
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 加载DEM数据
const terrain = new Terrain({
  width: 640,
  height: 255,
  depth: 640,
  maps: {
    colorRGBheightAlpha: "/terrain.png",
    /*
      colorRGB: colormap from image RGB
      colorRGBheightAlpha: colormap from image RGB + heightmap from alpha channel
      colorRGBheightRGB: colormap from RGB + heightmap from RGB grayscale
      heightAlpha: heightmap from image alpha channel
      heightR: heightmap from image red channel
      heightRGB: heightmap from image RGB grayscale
    */
  },
});
let terrainLoader = terrain.TIFFLoader();
terrainLoader.load(backUrl + "/store/data/dem90m.tif", function (data) {
  // 将DEM数据转换为高度图
  let heightmap = THREE.Terrain.TIFFParser.parse(data);

  // 创建地形
  let terrain = new THREE.Terrain({
    // 设置高度图
    heightmap: heightmap,
    // 设置纹理
    material: new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(backUrl + "/store/data/dog.jpg"),
      shininess: 0,
      side: THREE.DoubleSide,
    }),
    // 设置地形大小和细节级别
    // 这里使用了默认值
    amplitude: 2,
    frequency: 1,
    // 设置地形行为
    // 这里使用了默认值
    easing: THREE.Terrain.Linear,
    // 设置地形网格的分段数
    // 这里使用了默认值
    // 如果您想要更高的精度，请增加分段数
    // 但是这也会影响性能
    segmentMultiplier: 16,
  });
  // 将地形添加到场景中
  scene.add(terrain);
});

// 渲染场景
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
</script>

<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>