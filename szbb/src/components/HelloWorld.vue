<script setup lang="ts">
import { onMounted } from "vue";

//设置基准点
function setBaseCenter() {
  let jsonData = {
    originLon: 103.06139138456,
    originLat: 38.31785896953,
    originHeight: 0,
  };
  window.appInstance.uniCall("setBaseCenter", jsonData, (result) => {
    console.log(result, "设置基准点");
  });
}

onMounted(() => {
  window.appInstance = new TGApp.App();
  window.appInstance.initService({
    container: document.getElementById("container"),
    mode: "streaming",
    url: "",
    token: "9wNuaoa6",
    isShareToken: false,
  });
  window.appInstance.uniCall("addEventListener", {
    eventName: "onServiceInit",
    callback: (res) => {
      console.log(res, "场景初始化完成");
      setBaseCenter();
      addGISMap();
    },
  });
});

function addGISMap() {
 
}
</script>

<template>
  <div
    id="container"
    style="height: 100%; width: 100%; position: absolute"
  ></div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
