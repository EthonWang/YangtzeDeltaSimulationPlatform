<!-- <script setup lang="ts">
import mapboxgl from "mapbox-gl";
import type { GeoJSONSourceRaw } from "mapbox-gl";
import { onMounted, ref, reactive, toRaw } from "vue";
import * as jenks from "turf-jenks";

interface IState {
  geojson?: GeoJSONSourceRaw;
  map?: mapboxgl.Map | undefined;
}
const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
const state = reactive<IState>({
});

onMounted(() => {
  state.map = new mapboxgl.Map({
    accessToken: accessToken,
    container: 'spasta_map',
    style: 'mapbox://styles/mapbox/light-v11', // style URL
    center: [117.6, 25.5], // starting position
    zoom: 6 // starting zoom
  })

  state.map?.on('load', () => {
    initLoadAllLayer()
  })
})

var map = ref(null)

let layersTableData = ref([
  {
    id: '1',
    name: "福建省资源承载",
    jsonUrl: "src/static/fujian_result/福建省资源承载2.json",
    json: "",
    dataType: "fill",
    show: false
  },
  {
    id: '2',
    name: "福建省环境压力 ",
    jsonUrl: "src/static/fujian_result/福建省环境压力2.json",
    json: "",
    dataType: "fill",
    show: false
  },
  {
    id: '3',
    name: "福建省生态资产",
    jsonUrl: "src/static/fujian_result/福建省生态资产2.json",
    json: "",
    dataType: "fill",
    show: false
  },
  {
    id: '4',
    name: "福建省发展能力",
    jsonUrl: "src/static/fujian_result/福建省发展能力2.json",
    json: "",
    dataType: "fill",
    show: false
  },
  {
    id: '5',
    name: "福建省净碳排放",
    jsonUrl: "src/static/fujian_result/福建省净碳排放2.json",
    json: "",
    dataType: "fill",
    show: false
  },
  {
    id: '6',
    name: "福建省生态文明",
    jsonUrl: "src/static/fujian_result/福建省生态文明2.json",
    json: "",
    dataType: "fill",
    show: false
  },
])

const value = ref(true)

async function initLoadAllLayer() {
  for (let i = 0; i < layersTableData.value.length; i++) {
    let layerInfo = layersTableData.value[i]

    const response = await fetch(layerInfo.jsonUrl);
    layersTableData.value[i].json = await response.json()

    state.map?.addSource(layerInfo.id, {
      type: "geojson",
      data: layersTableData.value[i].json
    });

    if (layerInfo.dataType == "fill") {
      let break_point = jenks((Object as any)(toRaw(layersTableData.value[i].json)), 'value', 5)
      console.log('break_point', break_point)
      // console.log('jenks: ', jenks((Object as any)(toRaw(layersTableData.value[i].json)), 'value', 5))
      state.map?.addLayer({
        id: layerInfo.id,
        source: layerInfo.id,
        type: "fill",
        paint: {
          'fill-color': {
            type: 'exponential',
            property: 'value',
            stops: [
              [break_point[0], '#bdd7e7'],
              [break_point[1], '#92c5de'],
              [break_point[2], '#0571b0'],
              [break_point[3], '#f4a582'],
              [break_point[4], '#ca0020'],
              [break_point[5], '#f00'],
            ],
          },
          'fill-opacity': 0.7,
        }
      });
    } else if (layerInfo.dataType == "line") {
      state.map?.addLayer({
        id: layerInfo.id,
        source: layerInfo.id,
        type: "line",
        paint: {
          "line-color": "#" + Math.random().toString(16).substr(2, 6),
          "line-opacity": 1,
          "line-width": 2
        }
      });
    } else {
      state.map?.addLayer({
        id: layerInfo.id,
        source: layerInfo.id,
        type: "circle",
        paint: {
          "circle-color": "#" + Math.random().toString(16).substr(2, 6),
          "circle-opacity": 0.5
        }
      });
    }

    if (!layerInfo.show) {
      handleLayoutChange(layerInfo.id, "visibility", "none");
    }
  }
}


function handleLayerShowChange(row: any) {
  console.log(row)
  if (row.show) {
    handleLayoutChange(row.id, "visibility", "visible");
  } else {
    handleLayoutChange(row.id, "visibility", "none");
  }
}
//
// function handleAddSource(newSource) {
//   console.log("add new source：", newSource);
//   state.map?.addSource(newSource.sourceName, {
//     type: newSource.sourceType,
//     url: newSource.sourceUrl
//   });
// }

// function handleAddLayer(newLayer) {
//   console.log("add new layer：", newLayer);
//   state.map?.addLayer(newLayer);
// }

function handleRemoveSource(sourceName: string) {
  state.map?.removeSource(sourceName);
}

function handleRemoveLayer(layerName: string) {
  state.map?.removeLayer(layerName);
}

function handleLayoutChange(layerName: string, key: string, value: string) {
  console.log("layout:", layerName, key, value);
  state.map?.setLayoutProperty(layerName, key, value);
}

function handlePaintChange(layerName: string, key: string, value: string) {
  console.log("paint:", layerName, key, value);
  state.map?.setPaintProperty(layerName, key, value);
}

</script>

<template>
  <div style="display: flex; height: 800px;">
    <div style="width: 400px">
      <h3 style="text-align: center">福建省生态文明统计时空立方体</h3>
      <el-table :data="layersTableData" style="width: 100%" height="100%">
        <el-table-column prop="name" label="名称">
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-switch v-model="scope.row.show" @change="handleLayerShowChange(scope.row)" />
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div id="spasta_map" style="width: 100%"></div>
  </div>
</template> -->
