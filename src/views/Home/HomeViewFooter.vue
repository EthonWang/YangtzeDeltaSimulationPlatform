<template>
  <div class="footer-home" style="">
    <el-row>
      <el-col :span="2"></el-col>
      <el-col :span="9">
        <h1>开发机构</h1>
        <div style="margin: 2vh"></div>
        <div class="scroll_img1">
          <ul>
            <div style="margin: 3vw;float: left;"></div>
            <img src="@/assets/img/coorporation/NNUGEO.jpg" alt="" />
            <img src="@/assets/img/coorporation/VGE.jpg" alt="" />
            <img src="@/assets/app/logo.png" alt="" />
          </ul>
        </div>
      </el-col>
      <el-col :span="2">
        <el-divider
          direction="vertical"
          style="border-color: black; opacity: 0.75; height: 90%"
        ></el-divider
      ></el-col>

      <el-col :span="11">
        <h1>合作机构</h1>
        <div style="margin: 2vh"></div>
        <div class="scroll_img">
          <ul>
            <img src="@/assets/img/coorporation/logo_datacenter.png" alt="" />
            <img src="@/assets/img/coorporation/logo_hehai.png" alt="" />

            <img src="@/assets/img/coorporation/LZU.png" alt="" />
<img src="@/assets/img/coorporation/chengfang.jpg" alt="" />
            
            <img src="@/assets/img/coorporation/logo_datacenter.png" alt="" />
            <img src="@/assets/img/coorporation/logo_hehai.png" alt="" />

            <img src="@/assets/img/coorporation/LZU.png" alt="" />
            <img src="@/assets/img/coorporation/chengfang.jpg" alt="" />
          </ul>

          <!-- <el-row>
        
      </el-row> -->
        </div>
      </el-col>
      <!-- <el-col :span="4"></el-col> -->
    </el-row>
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
</script>

<style lang="less" scoped>
// 兼容css
h1 {
  font-size: 28px;
  color: hsl(210, 100%, 40%);
}
.footer-home {
  text-align: center;
  padding-top: 4vh;
  background-color: hsl(0, 0, 90%);
}
img {
  margin: 5px;
  //   max-width: 15vw;
  height: 7.5vh;
  object-fit: contain;
}
.scroll_img {
  position: relative;
  height: 9vh;
  margin: 0 2vw 0 2vw;
  width: 40vw;
  overflow-x: hidden;
  ul {
    position: absolute;
    overflow: hidden;
    width: 400%;
    animation: scrll 20s infinite linear;
    @keyframes scrll {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
  }
  img {
    float: left;
  }
}
.scroll_img1 {
  position: relative;
  height: 9vh;
  margin: 0 2vw 0 2vw;
  width: 40vw;
  img {
    float: left;
  }
}
</style>

