window.ApplicationConfig = {
    arcgisApiUrl: "127.0.0.1:8082/arcgis_js_api/library/4.9/"
};
const mapConfig = {
    arcgisApiUrl: "127.0.0.1:8082/arcgis_js_api/library/4.9/",
    proxyConfig: {
        //代理服务器地址
        proxyUrl: "http://127.0.0.1:8082/Java/proxy.jsp",
        //需要代理的地图服务服务器地址
        prefixUrl: ["http://127.0.0.1:6080", "http://58.215.235.42:6080"]
    },
    geometryServerConfig: 'http://127.0.0.1:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer',
    layers: [
        {
            title: "基础地理",
            titltEN: "JCDL",
            expand: true,
            children: [
            {
                checked: true,
                title: "行政区划",
                layerType: "dynamic",
                url: "http://127.0.0.1:6080/arcgis/rest/services/jz/xzqh_jz/MapServer",
                identyUrl: "http://127.0.0.1:6080/arcgis/rest/services/jz/xzqh_jz/MapServer/0",
                id: "XZQH",
                serverType: "esri",
                index: 2,
                identify: false,
                identifyOpt: {
                    title: "FKXX",
                    subtitle: [{
                            field: "TownName",
                            cnname: "乡镇名称"
                        },
                        {
                            field: "Shape_Area",
                            cnname: "面积大小"
                        }
                    ],
                }
            },
            {
                checked: true,
                title: "复垦范围线",
                layerType: "dynamic",
                url: "http://127.0.0.1:6080/arcgis/rest/services/jz/PCFWX_JZ/MapServer",
                identyUrl: "http://127.0.0.1:6080/arcgis/rest/services/jz/PCFWX_JZ/MapServer/0",
                id: "fkfwx",
                serverType: "esri",
                index: 1,
                identify: true,
                identifyOpt: {
                    title: "PCXX",
                    subtitle: [
                        {
                            field: "Source",
                            cnname: "图件名"
                        },
                        {
                            field: "SSXZ",
                            cnname: "所属乡镇"
                        }
                    ],
                    poupFields: [
                        {
                            field: "Source",
                            cnname: "图件名"
                        },
                        {
                            field: "PCXX",
                            cnname: "批次信息"
                        },
                        {
                            field: "FKNF",
                            cnname: "复垦年份"
                        },
                        {
                            field: "SSXZ",
                            cnname: "所属乡镇"
                        }
                    ]
                }
            },
            {
                checked: true,
                title: "影像图2015",
                layerType: "tiled",
                url: "http://127.0.0.1:6080/arcgis/rest/services/jz/ygyx_jz/MapServer",
                id: "YX2015",
                serverType: "esri",
                index: 0,
                identify: false
            },
            {
                checked: false,
                title: "土地利用现状",
                layerType: "tiled",
                url: "http://127.0.0.1:6080/arcgis/rest/services/jz/TDLYXZ2017_jz/MapServer",
                id: "tdlyxz",
                serverType: "esri",
                index: 0,
                identify: false
            }
        ]
        }
    ],
    gpConfig: [{
        id: "GeometryServer",
        url: "http://127.0.0.1:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer"
    }],
    legendConfig: [
        {
            layerId: 'fkfwx'
        },
        {
            layerId: 'tdlyxz'
        }
    ],
    extent: {
        xmin: 3.930523792331559E7,
        ymin: 3433758.0305129476,
        xmax: 3.9462136153778724E7,
        ymax:  3528479.053288324,
        spatialReference: {
            wkid: 2363
        }
    },
}

export default mapConfig