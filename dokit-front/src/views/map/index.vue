<template>
  <div class="app-main">
    <div id="mapViewDiv" class="map" style="float:left;" />
    <div class="map-control" @mouseover="mapControlAcitve" @mouseleave="mapControlDisAcitve">
      <div v-if="mapControlYxIsShow" class="map-control-layer layer-yx" @click="mapLayerChange('yx')">
        <div class="layer-name">影像图</div>
      </div>
      <div v-if="mapControlGhIsShow" class="map-control-layer layer-xz" @click="mapLayerChange('gh')">
        <div class="layer-name">规划图</div>
      </div>
      <div v-if="mapControlXzIsShow" class="map-control-layer layer-gh" @click="mapLayerChange('xz')">
        <div class="layer-name">现状图</div>
      </div>
    </div>
    <div v-if="showArchivePandel" class="archive">
      <div class="archive-head">
        <div class="archive-head-title">档案材料列表</div>
        <div class="archive-head-close" @click="colseArchivePandelClick"><i class="el-icon-close" /></div>
      </div>
      <div v-scrollBar class="archive-tree">
        <el-tree
          ref="archiveTree"
          :data="dataTree"
          node-key="id"
          :props="defaultProps"
          :default-expanded-keys="['2报验材料']"
          draggable
          accordion
          highlight-current
          @node-click="archiveTreeHandleNodeClick"
        />
      </div>
    </div>
    <el-dialog title="档案预览" :visible.sync="pdfDialogVisible" width="80%" center>
      <iframe :src="getPdfFileUrl" :headers="headers" height="730" width="100%" />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import config from '../../../public/config/config'
import { count } from '@/api/visits'
import { loadCss, loadModules } from 'esri-loader'
import { getToken } from '@/utils/auth'

// import {
//   arcgisToGeoJSON,
//   geojsonToArcGIS
// } from '@esri/arcgis-to-geojson-utils'
import parser from 'terraformer-arcgis-parser'
/**
   * 记录访问，只有页面刷新或者第一次加载才会记录
   */
count().then(res => {
})
export default {
  name: 'OneMap',
  components: {
  },
  data() {
    return {
      token: getToken(),
      headers: {
        'Authorization': getToken()
      },
      gisInst: {}, // gis 实例
      gisModules: [
        'esri/config',
        'esri/core/urlUtils',
        'esri/widgets/Legend',
        'esri/views/MapView',
        'esri/WebMap',
        'esri/views/2d/draw/Draw',
        'esri/widgets/Zoom',
        'esri/geometry/Extent',
        'esri/layers/MapImageLayer',
        'esri/layers/FeatureLayer',
        'esri/layers/TileLayer',
        'esri/layers/GraphicsLayer',
        'esri/widgets/Sketch/SketchViewModel',
        'esri/Graphic',
        'esri/symbols/FillSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/geometry/Polygon',
        'esri/geometry/Polyline',
        'esri/tasks/QueryTask',
        'esri/tasks/support/Query',
        'esri/geometry/Geometry',
        'esri/geometry/geometryEngine',
        'esri/tasks/GeometryService',
        'esri/tasks/support/BufferParameters',
        'esri/PopupTemplate',
        'dojo/promise/all',
        'esri/Map',
        'esri/Color',
        'esri/geometry/SpatialReference',
        'esri/geometry/Point',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/TextSymbol',
        'esri/symbols/Font',
        'esri/renderers/ClassBreaksRenderer'
      ],
      config: config,
      layers: config.layers,
      mapView: {},
      activePanel: '',
      mapControlYxIsShow: true,
      mapControlXzIsShow: false,
      mapControlGhIsShow: false,
      theShowMapLayer: 'yx',
      activeMapFunc: 'identify',
      idenyLayerGroupIndex: 0,
      idenyLayerIndex: 0,
      identifyResult: [],
      showArchivePandel: false,
      dataTree: [
        {
          label: '材料类型',
          id: '材料类型',
          expand: true,
          children: [
            {
              label: '呈报材料',
              id: '1呈报材料',
              expand: true,
              children: [
                {
                  label: '勘测定界图',
                  id: '1勘测定界图'
                },
                {
                  label: '勘测定界图界址点成果表',
                  id: '2勘测定界图界址点成果表'
                },
                {
                  label: '呈报文本材料',
                  id: '3呈报文本材料',
                  children: [
                    {
                      label: '项目呈报表',
                      id: '1项目呈报表'
                    },
                    {
                      label: '地类权属调查表',
                      id: '2地类权属调查表'
                    },
                    {
                      label: '民意调查表',
                      id: '3民意调查表'
                    },
                    {
                      label: '土地权属证明',
                      id: '4土地权属证明'
                    },
                    {
                      label: '项目规划设计报告论证意见',
                      id: '5项目规划设计报告论证意见'
                    },
                    {
                      label: '复垦方案相关部门意见',
                      id: '6复垦方案相关部门意见'
                    },
                    {
                      label: '项目实施规划公告',
                      id: '7项目实施规划公告'
                    },
                    {
                      label: '听证纪要',
                      id: '8听证纪要'
                    },
                    {
                      label: '项目拆迁安置明细表',
                      id: '9项目拆迁安置明细表'
                    },
                    {
                      label: '项目耕地质量等级报告',
                      id: '10项目耕地质量等级报告'
                    },
                    {
                      label: '土地整治规划图',
                      id: '11土地整治规划图'
                    },
                    {
                      label: '土地利用现状图',
                      id: '12土地利用现状图'
                    },
                    {
                      label: '耕地质量评定图',
                      id: '13耕地质量评定图'
                    }
                  ]
                },
                {
                  label: '土地复垦方案及预算',
                  id: '4土地复垦方案及预算'
                },
                {
                  label: '国土局对实施方案的批复文件',
                  id: '5国土局对实施方案的批复文件'
                }
              ]
            },
            {
              label: '报验材料',
              id: '2报验材料',
              expand: true,
              children: [
                {
                  label: '竣工图',
                  id: '1竣工图'
                },
                {
                  label: '竣工图界址点成果表',
                  id: '2竣工图界址点成果表'
                },
                {
                  label: '规划图',
                  id: '3规划图'
                },
                {
                  label: '验收申报材料',
                  id: '4验收申报材料',
                  expand: true,
                  children: [
                    {
                      label: '项目验收报告书',
                      id: '1项目验收报告书'
                    },
                    {
                      label: '初验报告',
                      id: '2初验报告'
                    },
                    {
                      label: '竣工报告',
                      id: '3竣工报告'
                    },
                    {
                      label: '土地权属证明材料',
                      id: '4土地权属证明材料'
                    },
                    {
                      label: '耕地质量等别评定报告',
                      id: '5耕地质量等别评定报告'
                    },
                    {
                      label: '实地验收确认表',
                      id: '6实地验收确认表'
                    },
                    {
                      label: '耕地质量评定图',
                      id: '7耕地质量评定图'
                    },
                    {
                      label: '土地利用变更图',
                      id: '8土地利用变更图'
                    }
                  ]
                },
                {
                  label: '乡镇验收申请文件',
                  id: '5乡镇验收申请文件'
                },
                {
                  label: '政府同意验收的批复文件',
                  id: '6政府同意验收的批复文件'
                },
                {
                  label: '官网上验收公告截图',
                  id: '7官网上验收公告截图'
                },
                {
                  label: '省厅备案申请文件',
                  id: '8省厅备案申请文件'
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedArchiveTreekey: '',
      checkedArchiveTreeList: [],
      pcName: null,
      tjxx: null,
      fkNf: null,
      getPdfFileUrl: '勘测定界图',
      pdfDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'pdfReadeApi'
    ])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const that = this
      const arcgisCssUrl = 'http://' + config.arcgisApiUrl + 'esri/css/main.css'
      const arcgisJsUrl = 'http://' + config.arcgisApiUrl + 'init.js'
      const gisJsOption = { url: arcgisJsUrl }
      loadCss(arcgisCssUrl)
      loadModules(this.gisModules, gisJsOption)
        .then(([
          esriConfig,
          urlUtils,
          Legend,
          MapView,
          WebMap,
          Draw,
          Zoom,
          Extent,
          MapImageLayer,
          FeatureLayer,
          TileLayer,
          GraphicsLayer,
          SketchViewModel,
          Graphic,
          FillSymbol,
          SimpleFillSymbol,
          Polygon,
          Polyline,
          QueryTask,
          Query,
          Geometry,
          geometryEngine,
          GeometryService,
          BufferParameters,
          PopupTemplate,
          all,
          Map,
          Color,
          SpatialReference,
          Point,
          SimpleMarkerSymbol,
          SimpleLineSymbol,
          TextSymbol,
          Font,
          ClassBreaksRenderer
        ]) => {
          esriConfig.request.proxyUrl = config.proxyConfig.proxyUrl
          esriConfig.request.useProxy = true
          debugger
          config.proxyConfig.prefixUrl.forEach(url => {
            if (url !== undefined && url !== '') {
              urlUtils.addProxyRule({
                urlPrefix: url,
                proxyUrl: config.proxyConfig.proxyUrl
              })
            }
          })
          const geometryService = new GeometryService(
            config.geometryServerConfig
          )
          that.gisInst.webmap = new WebMap({})
          that.gisInst.symbol = {}
          that.gisInst.symbol.polygon = new SimpleFillSymbol({
            outline: { color: [76, 230, 0, 1] },
            color: [163, 255, 115, 0.25]
          })
          // 加载图层
          that.gisInst.webmap.load().then(function() {
            const layersConfig = that.config.layers
            layersConfig.forEach(item => {
              if (item.children) {
                item.children.forEach(item => {
                  if (item.id !== 'tdt_dt' && item.id !== 'tdt_image') {
                    let lyr
                    if (item.layerType === 'dynamic') {
                      lyr = new MapImageLayer({
                        url: item.url,
                        visible: item.checked,
                        id: item.id
                      })
                    } else if (item.layerType === 'tiled') {
                      lyr = new TileLayer({
                        url: item.url,
                        visible: item.checked,
                        id: item.id
                      })
                    }
                    if (lyr !== undefined) {
                      if (
                        undefined !== typeof item.index ||
                          item.index !== ''
                      ) {
                        that.gisInst.webmap.add(lyr, item.index)
                      } else {
                        debugger
                        that.gisInst.webmap.add(lyr)
                      }
                    }
                  }
                })
              }
            })
          })
          that.gisInst.mapView = new MapView({
            map: this.gisInst.webmap,
            // eslint-disable-next-line no-undef
            container: mapViewDiv,
            popup: {
              actions: [],
              dockEnabled: false,
              dockOptions: {
                buttonEnabled: true,
                breakpoint: false
              }
            }
          })
          // 用于去除地图上默认的缩放按钮
          that.gisInst.mapView.ui._removeComponents(['attribution', 'zoom'])
          that.gisInst.mapView.when(
            function() {
              const extent = new Extent(that.config.extent)
              that.gisInst.mapView.goTo(extent)
              const zoom = new Zoom({
                view: that.gisInst.mapView
              })
              that.gisInst.mapView.ui.add(zoom, 'bottom-right')
              // 加载图例
              try {
                if (
                  that.config.legendConfig !== undefined &&
                  that.config.legendConfig.length > 0
                ) {
                  // eslint-disable-next-line prefer-const
                  let layerInfos = []
                  that.config.legendConfig.forEach(layerLengendConfig => {
                    if (layerLengendConfig.layerId !== undefined) {
                      const featureLayer = that.gisInst.webmap.findLayerById(
                        layerLengendConfig.layerId
                      )
                      let title = ''
                      if (layerLengendConfig.title !== undefined) {
                        title = layerLengendConfig.title
                      }
                      // eslint-disable-next-line no-new-object
                      const layerInfo = new Object()
                      layerInfo.title = title
                      layerInfo.layer = featureLayer
                      layerInfos.push(layerInfo)
                    }
                  })
                  const legend = new Legend({
                    view: that.gisInst.mapView,
                    layerInfos: layerInfos,
                    container: 'legendContainer'
                  })
                  legend.style = 'classic'
                  that.gisInst.mapView.ui.add(legend, 'bottom-right')
                }
              } catch (error) {
                console(error)
              }

              that.gisInst.mapView.on('click', mapViewOnClick)
              function mapViewOnClick(e) {
                that.mapClickPoint = e.mapPoint
                if (that.activeMapFunc === 'identify') {
                  that.identifyResult = []
                  if (
                    that.config.layers != null &&
                    that.config.layers.length > 0
                  ) {
                    that.idenyLayerGroupIndex = 0
                    if (that.config.layers[0].children.length > 0) {
                      that.idenyLayerIndex = 0
                      that.spinShow = true
                      identify(that.config.layers[0].children[0])
                    }
                  }
                }
              }
            },
            function(error) {
              that.$Message.error(error)
            }
          )
          function identify(identyconfig) {
            if (identyconfig.identify) {
              const layer = that.gisInst.webmap.findLayerById(identyconfig.id)
              let isGoQuery = true
              const url = identyconfig.identyUrl
              if (
                typeof layer === 'undefined' ||
                typeof url === 'undefined'
              ) {
                that.$Message.info(
                  identyconfig.id + '加载异常或者未配置查询url,请联系技术人员'
                )
                isGoQuery = false
              }
              if (identyconfig.identify && isGoQuery && layer.visible) {
                const queryTask = new QueryTask(url)
                const outfields = ['*']
                const query = new Query()
                query.outFields = outfields
                query.returnGeometry = true
                query.geometry = that.mapClickPoint
                queryTask
                  .execute(query)
                  .then(afteridentyquery)
                  .catch(identyErrback)
              } else {
                that.idenyLayerIndex++
                isLoopIdenty()
              }
            } else {
              that.idenyLayerIndex++
              isLoopIdenty()
            }
          }
          function isLoopIdenty() {
            if (
              that.idenyLayerGroupIndex > -1 &&
                that.idenyLayerGroupIndex < that.config.layers.length
            ) {
              if (
                that.idenyLayerIndex > -1 &&
                that.idenyLayerIndex <
                  that.config.layers[that.idenyLayerGroupIndex].children
                    .length
              ) {
                identify(
                  that.config.layers[that.idenyLayerGroupIndex].children[
                    that.idenyLayerIndex
                  ]
                )
              } else {
                that.idenyLayerGroupIndex++
                that.idenyLayerIndex = 0
                isLoopIdenty()
              }
            }
          }
          function afteridentyquery(result) {
            const layerconfig =
                that.config.layers[that.idenyLayerGroupIndex].children[
                  that.idenyLayerIndex
                ]
            that.spinShow = false
            const features = result.features
            features.forEach(feature => {
              const attr = feature.attributes
              // eslint-disable-next-line prefer-const
              let obj = {}
              obj.attributes = attr
              obj.geometry = feature.geometry
              obj.geojson = parser.parse(feature.geometry)
              if (layerconfig.identifyOpt) {
                const opt = layerconfig.identifyOpt
                obj.title = layerconfig.title
                obj.subtitle = []
                opt.subtitle.forEach(sub => {
                  obj.subtitle.push({
                    cnname: sub.cnname,
                    value: attr[sub.field]
                  })
                })
                obj.poupFields = layerconfig.identifyOpt.poupFields
                obj.layerID = layerconfig.id
                obj.isContainerLife = layerconfig.isContainerLife
                obj.layConfig = layerconfig
                that.pcName = obj.attributes.PCname
                that.tjxx = obj.attributes.TJXX
                that.fkNf = obj.attributes.FKNF
                that.identifyResult.push(obj)
                that.gisInst.dolocate(obj, true)
              }
            })
            that.idenyLayerIndex++
            isLoopIdenty()
          }
          function identyErrback(error) {
            const layerName =
                that.config.layers[that.idenyLayerGroupIndex].children[
                  that.idenyLayerIndex
                ].title
            that.$Message.error(
              '图层' +
                  layerName +
                  '识别出错，请联系技术人员！报错信息为：' +
                  error
            )
            that.idenyLayerIndex++
            isLoopIdenty()
          }
          // 地图定位功能
          that.gisInst.dolocate = function(item, isShowAttr) {
            that.gisInst.mapView.graphics.removeAll()
            if (typeof item !== undefined) {
              const geometry = item.geometry
              const bufferParameters = new BufferParameters({
                distances: [0.4],
                unit: 'kilometers',
                geodesic: true,
                bufferSpatialReference: that.gisInst.mapView.SpatialReference,
                outSpatialReference: that.gisInst.mapView.SpatialReference,
                geometries: [geometry]
              })
              geometryService
                .buffer(bufferParameters)
                .then(function(results) {
                  that.gisInst.mapView.extent = results[0].extent
                })
              const polygonSymbol = new SimpleFillSymbol({
                outline: { width: 1.25, color: [230, 0, 0, 1] },
                color: [0, 169, 230, 0.5]
              })
              const graphic = new Graphic({
                geometry: geometry,
                symbol: polygonSymbol
              })
              const point = geometry.extent.center
              that.gisInst.mapView.graphics.add(graphic)
              if (isShowAttr === true) {
                that.showArchivePandel = true
                that.gisInst.mapView.popup.open({
                  title: '地块属性信息详情',
                  location: point,
                  content: setContentInfo(item)
                })
              }
            }
          }
          function setContentInfo(item) {
            var objtable = document.createElement('table')
            objtable.setAttribute('class', 'identify-table')
            var thead = document.createElement('thead')
            objtable.appendChild(thead)
            var hdTr = document.createElement('tr')
            thead.appendChild(hdTr)
            var th1 = document.createElement('th')
            hdTr.appendChild(th1)
            th1.appendChild(document.createTextNode('序号'))
            var th2 = document.createElement('th')
            hdTr.appendChild(th2)
            th2.appendChild(document.createTextNode('字段名'))
            var th3 = document.createElement('th')
            hdTr.appendChild(th3)
            th3.appendChild(document.createTextNode('字段值'))
            const poupFields = item.poupFields
            if (typeof poupFields !== undefined && poupFields.length > 0) {
              for (let i = 0; i < poupFields.length; i++) {
                var tr = document.createElement('tr') // 创建行
                for (let j = 0; j < 3; j++) {
                  var td = document.createElement('td') // 创建列
                  if (j === 0) {
                    td.innerText = i + 1
                    tr.appendChild(td) // 向行中添加子节点列
                  } else if (j === 1) {
                    td.innerText = poupFields[i].cnname
                    tr.appendChild(td) // 向行中添加子节点列
                  } else {
                    const field = poupFields[i].field
                    if (item.attributes[field] === undefined) {
                      td.innerText = ''
                    } else {
                      td.innerText = item.attributes[field]
                    }
                    tr.appendChild(td) // 向行中添加子节点列
                  }
                }
                objtable.appendChild(tr) // 添加子节点tr
              }
            }
            return objtable
          }
        })
    },
    mapControlAcitve() {
      this.mapControlYxIsShow = true
      this.mapControlXzIsShow = true
      this.mapControlGhIsShow = true
    },
    mapControlDisAcitve() {
      if (this.theShowMapLayer === 'yx') {
        this.mapControlYxIsShow = true
        this.mapControlXzIsShow = false
        this.mapControlGhIsShow = false
      }
      if (this.theShowMapLayer === 'gh') {
        this.mapControlYxIsShow = false
        this.mapControlXzIsShow = false
        this.mapControlGhIsShow = true
      }
      if (this.theShowMapLayer === 'xz') {
        this.mapControlYxIsShow = false
        this.mapControlXzIsShow = true
        this.mapControlGhIsShow = false
      }
    },
    mapLayerChange(type) {
      this.theShowMapLayer = type
      const yxLayer = this.gisInst.webmap.findLayerById('YX2015')
      const xzlayer = this.gisInst.webmap.findLayerById('tdlyxz')
      if (type === 'yx') {
        yxLayer.visible = true
        xzlayer.visible = false
      }
      if (type === 'gh') {
      // const box = document.getElementById(type)
      // const layer = this.gisInst.webmap.findLayerById(type)
      // layer.visible = box.checked
      }
      if (type === 'xz') {
        yxLayer.visible = false
        xzlayer.visible = true
      }
    },
    colseArchivePandelClick() {
      this.showArchivePandel = false
    },
    archiveTreeHandleNodeClick(data) {
      const that = this
      const pdfFileName = data.label
      const tree = this.$refs.archiveTree
      this.checkedArchiveTreekey = ''
      this.checkedArchiveTreeList = []
      if (!data.groups) {
        tree.getChildNodes
        const node = tree.getNode(data.id)
        // 如果不是叶子节点则结束执行
        if (node.childNodes !== null && node.childNodes.length > 0) {
          return
        }
        this.getTreeNode(node)
        this.checkedArchiveTreekey = data.id
      }
      console.log(data)
      let path = that.pcName
      this.checkedArchiveTreeList.splice(this.checkedArchiveTreeList.indexOf('材料类型'), 1)
      for (let i = 0; i < this.checkedArchiveTreeList.length; i++) {
        path += '/' + this.checkedArchiveTreeList[i]
      }
      console.log(pdfFileName)
      const curWwwPath = window.document.location.href
      const pathName = window.document.location.pathname
      const pos = curWwwPath.indexOf(pathName)
      const localhostPath = curWwwPath.substring(0, pos)
      that.getPdfFileUrl = localhostPath +
        '/pdf/web/viewer.html?file=' + that.pdfReadeApi + '?fileName%3D' +
        pdfFileName +
        '.pdf%26path%3D' +
        path +
        '%26tjxx%3D' +
        that.tjxx +
        '%26fkNf%3D' +
        that.fkNf +
        '&role=领导'
      console.log(that.getPdfFileUrl)
      that.pdfDialogVisible = true
    },
    // 获取当前树节点和其父级节点
    getTreeNode(node) {
      if (node) {
        if (node.key !== undefined) {
          // 在数组头部添加元素
          this.checkedArchiveTreeList.unshift(node.key)
          // 递归
          this.getTreeNode(node.parent)
        }
      }
    }
  }
}
</script>

<style rel='stylesheet/scss' lang='scss' scoped>
@import '../../assets/styles/onemap';
  .app-main {
    /* 50= navbar  50  */
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .map {
    min-height: calc(100vh - 84px);
    width: 100%;
  }
  .map-control {
    height:70px;
    width:70px;
    z-index: 80;
    top: 20px;
    right: 20px;
    box-sizing: border-box;
    position: absolute;
    border-radius: 4px;
    box-shadow:#a3a3a3 0px 0px 10px
  }
  .map-control-layer {
    height:70px;
    width:70px;
    position: relative;
    padding-top: 4px;
    border-radius: 4px;
    border:1px solid #ffffff;
  }
  .map-control-layer:active {
   border:2px solid rgba(51,133,255,1);
  }
  .layer-yx {
    background-image: url('../../images/yx-icon.png');
  }
  .layer-xz {
    background-image: url('../../images/tdlyxz-icon.png');
  }
  .layer-gh {
    background-image: url('../../images/tdlygh-icon.png');
  }
  .layer-name {
    text-align:center;
    background:rgba(51,133,255,0.7);
    color:#ffffff;
    bottom:0;
    position: absolute;
    padding:2px;
    width:100%;
    font-size: 12px;
    font-weight: 100;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .archive {
    z-index: 80;
    top: 20px;
    left: 20px;
    width: 340px;
    height: calc(100vh - 124px);
    box-sizing: border-box;
    position: absolute;
    border-radius: 3px;
    border: #cccccc solid 1px;
    box-shadow:#a3a3a3 0px 0px 8px;
    background: #ffffff;
  }
  .archive-head {
    height:40px;
  }
  .archive-head-title {
    float:left;
    padding:11px;
  }
  .archive-head-close {
    float:right;
    padding:11px
  }
  .archive-tree {
    position:relative;
    height: calc(100vh - 184px);
  }
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
<style>
.identify-table {
  width: 100%;
  font-family: verdana, arial, sans-serif;
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #e8eaec;
  border-collapse: collapse;
}
.identify-table tr {
  width: 100%;
}

.identify-table th {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #e8eaec;
  background-color: #f8f8f9;
}
.identify-table td {
  border-width: 1px;
  padding: 8px;
  border-style: solid;
  border-color: #e8eaec;
  background-color: #ffffff;
}
.ivu-modal-footer {
  padding: 0 0 !important;
  border-top: 0 !important;
}
.ivu-modal-body {
  padding: 8px !important;
}
</style>
