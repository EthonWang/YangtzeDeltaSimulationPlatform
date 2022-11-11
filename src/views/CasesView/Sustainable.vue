<template>
  <div style="height: 100%; width: 100%">
    <div class="background">
      <el-image
        style="width: 100%; height: 100%"
        :src="backgroundUrl"
      ></el-image>
    </div>
    <div style="height: 100%; width: 100%">
      <el-header style="height: 10%; width: 100%"> </el-header>
      <el-main style="height: 80%; width: 100%">
        <el-col
          style="
            height: 100%;
            width: 40%;
            padding-left: 120px;
            padding-top: 40px;
          "
        >
         <el-row> <h1 class="Title">可持续发展长三角系统</h1></el-row>
          <el-row style="height: 40%; width: 100%" :gutter="20" type="flex">
            <el-card class="CardStyle">
              <router-link  to="Sustainable_in" class="ButtonTitle">
                                可持续指标体系浏览
                                <el-image
                                        class="ImageStyle"
                                        :src="DingZhiUrl"
                                        :fit="full"
                                ></el-image>
                            </router-link>

                            <!-- 镶嵌到页面中的弹出表格写法 -->
                            <!-- 镶嵌到页面中的弹出表格写法 -->
                            <!-- 镶嵌到页面中的弹出表格写法 -->
            <!-- <div @click="dialogVisible = true"   class="ButtonTitle">
                可持续指标体系浏览
                <el-image
                  class="ImageStyle"
                  :src="DingZhiUrl"
                  :fit="full"
                ></el-image>
            </div> -->
              <!-- <el-dialog title="长三角可持续发展评价指标体系" v-model="dialogVisible" width="60%" > -->
                <!-- 内容存储位置 -->
                <!-- :span-method是传递的一个合并行的方法，max-height是限定表格的长度（超出就滚动条），border边框，stripe斑马纹 -->
                <!-- <el-table :data="gridData" :span-method="arraySpanMethod" max-height="400" border stripe> -->
                    <!-- 这里写了宽度的就是确定的，不写就独揽剩下的空间 -->
                    <!-- <el-table-column property="dimension" label="维度" width="200"></el-table-column>
                    <el-table-column property="index" label="指标" ></el-table-column>
                    <el-table-column property="value" label="值" width="150"></el-table-column>
                </el-table>
                <slot name="footer" class="dialog-footer">
                  <el-button type="primary" @click="dialogVisible = false"
                    >确 定</el-button
                  >
                </slot>
              </el-dialog> -->
            </el-card>
            <el-card class="CardStyle">
              <router-link to="Sustainable_vi" class="ButtonTitle">
                可持续指标体系构建
                <el-image
                  class="ImageStyle"
                  :src="JiSuanUrl"
                  :fit="full"
                ></el-image>
              </router-link>
            </el-card>
            <el-card class="CardStyle">
              <router-link to="Sustainable_vi" class="ButtonTitle">
                可持续指标体系分析
                <el-image
                  class="ImageStyle"
                  :src="FenxiUrl"
                  :fit="full"
                ></el-image>
              </router-link>
            </el-card>
          </el-row>
          <!--                    <el-row style="height: 12%;width: 100%;padding-top: 20px" :gutter="20" type="flex">-->
          <!--                        <el-col :offset="1" >-->
          <!--                            <el-button style="height: 90%" type="primary">-->
          <!--                                <router-link  to="/SdgPlatform/Home" class="ButtonTitle">-->
          <!--                                    开始探索-->
          <!--                                </router-link>-->
          <!--                            </el-button>-->
          <!--                        </el-col>-->
          <!--                    </el-row>-->
        </el-col>

        <el-col style="height: 100%; width: 50%; padding-left: 200px">
          <div class="hero-browser">
            <div class="bubble-3 is-revealing">
              <svg
                width="300"
                height="186"
                viewBox="0 0 427 286"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <path
                    d="M213.5 286C331.413 286 427 190.413 427 72.5S304.221 16.45 186.309 16.45C68.396 16.45 0-45.414 0 72.5S95.587 286 213.5 286z"
                    id="bubble-3-a"
                  />
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <mask id="bubble-3-b" fill="#fff">
                    <use xlink:href="#bubble-3-a" />
                  </mask>
                  <use fill="#4E8FF8" xlink:href="#bubble-3-a" />
                  <path
                    d="M64.5 129.77c117.913 0 213.5-95.588 213.5-213.5 0-117.914-122.779-56.052-240.691-56.052C-80.604-139.782-149-201.644-149-83.73c0 117.913 95.587 213.5 213.5 213.5z"
                    fill="#1274ED"
                    mask="url(#bubble-3-b)"
                  />
                  <path
                    d="M381.5 501.77c117.913 0 213.5-95.588 213.5-213.5 0-117.914-122.779-56.052-240.691-56.052C236.396 232.218 168 170.356 168 288.27c0 117.913 95.587 213.5 213.5 213.5z"
                    fill="#75ABF3"
                    mask="url(#bubble-3-b)"
                  />
                </g>
              </svg>
            </div>
            <div class="bubble-4 is-revealing">
              <svg
                width="230"
                height="235"
                viewBox="0 0 230 235"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <path
                    d="M196.605 234.11C256.252 234.11 216 167.646 216 108 216 48.353 167.647 0 108 0S0 48.353 0 108s136.959 126.11 196.605 126.11z"
                    id="bubble-4-a"
                  />
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <mask id="bubble-4-b" fill="#fff">
                    <use xlink:href="#bubble-4-a" />
                  </mask>
                  <use fill="#7CE8DD" xlink:href="#bubble-4-a" />
                  <circle
                    fill="#3BDDCC"
                    mask="url(#bubble-4-b)"
                    cx="30"
                    cy="108"
                    r="108"
                  />
                  <circle
                    fill="#B1F1EA"
                    opacity=".7"
                    mask="url(#bubble-4-b)"
                    cx="265"
                    cy="88"
                    r="108"
                  />
                </g>
              </svg>
            </div>
            <div class="hero-browser-inner is-revealing">
              <!--修改高度-->
              <svg
                width="800"
                height="450"
                viewBox="0 0 800 450"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <linearGradient
                    x1="50%"
                    y1="0%"
                    x2="50%"
                    y2="100%"
                    id="browser-a"
                  >
                    <stop stop-color="#F6F8FA" stop-opacity=".48" offset="0%" />
                    <stop stop-color="#F6F8FA" offset="100%" />
                  </linearGradient>
                  <linearGradient
                    x1="50%"
                    y1="100%"
                    x2="50%"
                    y2="0%"
                    id="browser-b"
                  >
                    <stop stop-color="#F6F8FA" stop-opacity=".48" offset="0%" />
                    <stop stop-color="#F6F8FA" offset="100%" />
                  </linearGradient>
                  <linearGradient
                    x1="100%"
                    y1="-12.816%"
                    x2="0%"
                    y2="-12.816%"
                    id="browser-c"
                  >
                    <stop stop-color="#F6F8FA" stop-opacity="0" offset="0%" />
                    <stop stop-color="#E3E7EB" offset="50.045%" />
                    <stop stop-color="#F6F8FA" stop-opacity="0" offset="100%" />
                  </linearGradient>
                  <filter
                    x="-500%"
                    y="-500%"
                    width="1000%"
                    height="1000%"
                    filterUnits="objectBoundingBox"
                    id="dropshadow-1"
                  >
                    <feOffset
                      dy="16"
                      in="SourceAlpha"
                      result="shadowOffsetOuter"
                    />
                    <feGaussianBlur
                      stdDeviation="24"
                      in="shadowOffsetOuter"
                      result="shadowBlurOuter"
                    />
                    <feColorMatrix
                      values="0 0 0 0 0.12 0 0 0 0 0.17 0 0 0 0 0.21 0 0 0 0.2 0"
                      in="shadowBlurOuter"
                    />
                  </filter>
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <rect
                    width="800"
                    height="450"
                    rx="4"
                    fill="#FFF"
                    style="mix-blend-mode: multiply; filter: url(#dropshadow-1)"
                  />
                  <rect width="800" height="450" rx="4" fill="#FFF" />
                  <g fill="url(#browser-a)" transform="translate(47 67)">
                    <path
                      d="M146 0h122v122H146zM0 0h122v122H0zM292 0h122v122H292zM438 0h122v122H438zM584 0h122v122H584z"
                    />
                  </g>
                  <g transform="translate(47 239)" fill="url(#browser-b)">
                    <path
                      d="M146 0h122v122H146zM0 0h122v122H0zM292 0h122v122H292zM438 0h122v122H438zM584 0h122v122H584z"
                    />
                  </g>
                  <path
                    fill="url(#browser-c)"
                    d="M0 146h706v2H0z"
                    transform="translate(47 67)"
                  />
                  <g transform="translate(0 12)">
                    <circle fill="#FF6D8B" cx="36" cy="4" r="4" />
                    <circle fill="#FFCB4F" cx="52" cy="4" r="4" />
                    <circle fill="#7CE8DD" cx="68" cy="4" r="4" />
                    <path fill="url(#browser-c)" d="M0 20h800v2H0z" />
                    <path fill="#E3E7EB" d="M742 2h24v4h-24z" />
                  </g>
                  <g>
                    <path fill="#F6F8FA" d="M47 385h706v32H47z" />
                    <path fill="#E3E7EB" d="M356 399h88v4h-88z" />
                  </g>
                </g>
              </svg>
            </div>
            <div class="bubble-1 is-revealing">
              <svg
                width="61"
                height="52"
                viewBox="0 0 61 52"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <path
                    d="M32 43.992c17.673 0 28.05 17.673 28.05 0S49.674 0 32 0C14.327 0 0 14.327 0 32c0 17.673 14.327 11.992 32 11.992z"
                    id="bubble-1-a"
                  />
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <mask id="bubble-1-b" fill="#fff">
                    <use xlink:href="#bubble-1-a" />
                  </mask>
                  <use fill="#FF6D8B" xlink:href="#bubble-1-a" />
                  <path
                    d="M2 43.992c17.673 0 28.05 17.673 28.05 0S19.674 0 2 0c-17.673 0-32 14.327-32 32 0 17.673 14.327 11.992 32 11.992z"
                    fill="#FF4F73"
                    mask="url(#bubble-1-b)"
                  />
                  <path
                    d="M74 30.992c17.673 0 28.05 17.673 28.05 0S91.674-13 74-13C56.327-13 42 1.327 42 19c0 17.673 14.327 11.992 32 11.992z"
                    fill-opacity=".8"
                    fill="#FFA3B5"
                    mask="url(#bubble-1-b)"
                  />
                </g>
              </svg>
            </div>
            <div class="bubble-2 is-revealing">
              <svg
                width="179"
                height="126"
                viewBox="0 0 179 126"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <defs>
                  <path
                    d="M104.697 125.661c41.034 0 74.298-33.264 74.298-74.298s-43.231-7.425-84.265-7.425S0-28.44 0 12.593c0 41.034 63.663 113.068 104.697 113.068z"
                    id="bubble-2-a"
                  />
                </defs>
                <g fill="none" fill-rule="evenodd">
                  <mask id="bubble-2-b" fill="#fff">
                    <use xlink:href="#bubble-2-a" />
                  </mask>
                  <use fill="#838DEA" xlink:href="#bubble-2-a" />
                  <path
                    d="M202.697 211.661c41.034 0 74.298-33.264 74.298-74.298s-43.231-7.425-84.265-7.425S98 57.56 98 98.593c0 41.034 63.663 113.068 104.697 113.068z"
                    fill="#626CD5"
                    mask="url(#bubble-2-b)"
                  />
                  <path
                    d="M43.697 56.661c41.034 0 74.298-33.264 74.298-74.298s-43.231-7.425-84.265-7.425S-61-97.44-61-56.407C-61-15.373 2.663 56.661 43.697 56.661z"
                    fill="#B1B6F1"
                    opacity=".64"
                    mask="url(#bubble-2-b)"
                  />
                </g>
              </svg>
            </div>
          </div>
        </el-col>
      </el-main>
      <el-footer style="height: 10%; width: 100%"> </el-footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Sustainable",
  data() {
    return {
      //返回的一些图标数据
      backgroundUrl: require("../../../public/case/sustainable/background.jpg"),
      DingZhiUrl: require("../../../public/case/sustainable/DingZhi.png"),
      JiSuanUrl: require("../../../public/case/sustainable/JiSuan.png"),
      FenxiUrl: require("../../../public/case/sustainable/FenXi.png"), 
    };
  },
  methods: {
    }
};
</script>

<style scoped>
@import "../../css/sustainable/WebsiteStyle.css";
@import "../../css/sustainable/MyStyle.css";
.CardStyle {
  margin: 0.8vw;
  height: 100%;
  width: 28%;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  background-color: hsla(0, 0%, 100%, 0.2);
}

.ButtonTitle {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
}

.ImageStyle {
  padding-top: 30px;
  height: 50%;
  width: 50%;
}

</style>