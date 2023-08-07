<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';

import { lookupRegion, LookupRegionRequestData, LookupRegionResponse } from '@googlemaps/region-lookup';
import { useLocalStorage } from '@vueuse/core'

const gMap = ref();
let loaderInstance: any = null;
let featureLayer;
let heightPlaceId: any;

const language = useLocalStorage('gmp-language', 'zh-CN')
const refreshMode = ref("refresh")

const lookup = async () => {
  const headers: any = {
    'X-Goog-Api-Key': 'AIzaSyBZudBCA75rzDba08NM7XhKpS5ndbAQPIc',
  };

  const data: LookupRegionRequestData = {
    identifiers: [
      {
        place: 'newark',
        place_type: 'locality',
        region_code: 'us',
        language_code: language.value || 'zh-CN',
      },
    ],
  };

  try {
    const response: LookupRegionResponse = await lookupRegion({ headers, data });
    // console.log(response.data);
    heightPlaceId = response.data.matches[0].matchedPlaceId;
  } catch (e: any) {
    console.log(e.response);
    throw e;
  }
};

const initMap = async () => {
  loaderInstance = new Loader({
    apiKey: 'AIzaSyBZudBCA75rzDba08NM7XhKpS5ndbAQPIc',
    version: 'weekly',
    libraries: ['places'],
    language: language.value || 'zh-CN',
  });
  const { Map } = await loaderInstance.importLibrary('maps');
  const map = new Map(gMap.value, {
    center: { lat: 40.73528963762624, lng: -74.17278899348678 },
    zoom: 12,
    // In the cloud console, configure this Map ID with a style that enables the
    // "Locality" feature layer.
    mapId: 'a3efe1c035bad51b',
  });
  //@ts-ignore
  featureLayer = map.getFeatureLayer('LOCALITY');

  // Define a style with purple fill and border.
  //@ts-ignore
  const featureStyleOptions = {
    strokeColor: '#810FCB',
    strokeOpacity: 1.0,
    strokeWeight: 3.0,
    fillColor: '#810FCB',
    fillOpacity: 0.5,
  };

  // Apply the style to a single boundary.
  //@ts-ignore
  featureLayer.style = (options) => {
    if (options.feature.placeId == heightPlaceId) {
      // Hana, HI
      return featureStyleOptions;
    }
  };
};

const setLanguages = (lang: string) => {
  language.value = lang
  window.location = window.location
}

const setLanguageWithoutRefresh = (lang: string) => {
  loaderInstance.reset()
  // @ts-ignore
  delete window.google;
  // @ts-ignore
  Loader.instance = undefined
  language.value = lang
  initMap()
}

watch(language, () => {
  if (refreshMode.value === 'refresh') {
    setLanguages(language.value)
    return
  }
  setLanguageWithoutRefresh(language.value)
})

onMounted(async () => {
  await lookup();
  await initMap();
});
</script>

<template>
  <div>
    <a-space size="large">
      <a-radio-group v-model="language">
        <a-radio value="zh-CN">中文</a-radio>
        <a-radio value="en">English</a-radio>
        <a-radio value="ja">日本語</a-radio>
      </a-radio-group>
    </a-space>
    <div></div>
    <a-space size="large">
      <a-radio-group v-model="refreshMode">
        <a-radio value="refresh">刷新页面</a-radio>
        <a-radio value="reset">重置变量</a-radio>
      </a-radio-group>
    </a-space>
    <div></div>
    <a-input></a-input>
    <div style="height: 10px;"></div>
    <div ref="gMap" class="map_container"></div>
  </div>
</template>

<style scoped>
.map_container {
  height: 800px;
  width: 800px;
}
</style>
