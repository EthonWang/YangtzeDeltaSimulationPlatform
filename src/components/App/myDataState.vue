<template>
  <el-row>
    <el-col :span="24">
      <div>
        <p class="state-name">{{state.name}}</p>
        <p class="state-desc"> {{state.desc}}</p>
      </div>
      <el-divider/>
      <div>
        <el-card class="config-card">
          <template v-for="modelInEvent in inEventList(state)" :key="modelInEvent.eventId">
              <!-- event名称 -->
            <el-row>
              <el-col :span="11">
                <span class="event-name" :title="modelInEvent.eventName">
                        <span v-show="!modelInEvent.optional" style="color:red">*</span>
                          {{modelInEvent.eventName}}
                </span>
              </el-col>
              <!-- 输入框 -->

            </el-row>
          </template>
        </el-card>
          <el-card class="config-card" shadow="hover">
            <template v-for="modelOutEvent in outEventList(state)" :key="modelOutEvent.eventId">
              <el-row>
                <el-col :span="11">
                    <span class="event-name" :title="modelOutEvent.eventName">
                        {{modelOutEvent.eventName}}
                    </span>
                </el-col>
              </el-row>
            </template>
          </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import {defineProps} from "vue";
const props = defineProps({
  state:{}
})
const inEventList = (state) => {
  return state.event.filter(value => {
    return value.eventType === "response";
  });

}
const outEventList = (state) => {
  return state.event.filter(value => {
    return value.eventType === "noresponse";
  });
}

</script>

<style scoped>
.state-name{
  font-size: 17px;
  font-weight: bold;
}
.config-card{
  background-color: #EFEFEF;
  /*width: 90vh;*/
}
</style>
