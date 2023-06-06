<template>
  <div ref="mapRef" id="map" class="common-t-map"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TMap } from "./Map";

const mapRef = ref(null);

onMounted(() => {
  if (mapRef.value) {
    const viewer = new TMap("map", {});
  }
});
</script>

<style lang="less" scoped>
.common-t-map {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
