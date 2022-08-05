export const cases_config = [
    {
        problem:"城市水问题",
        name:"汾湖高新区城市雨洪管网模拟系统",
        img_path:require("../img/cases/swmm.png"),
        data:"",
        path:"swmm",
        description:" 本案例基于SWMM模型实现，主要用于模拟汾湖高新区降水事件的模拟，分别依照当地官方量化的五年一遇、十年一遇、二十年一遇、三十年一遇、五十年一遇的五个降雨量级下，二十四小时内下的城市排水管网与管点的水流情况。",
        component:() => import( "views/CasesView/SWMM.vue")
    },
    {
        problem:"洪涝水环境灾害",
        name:"长三角降雨预报专题",
        data:"",
        img_path:require("../img/cases/rainForecast.png"),
        path:"rainForecast",
        description:" 长三角降雨预报专题",
        component:() => import( "views/CasesView/RainForecast.vue")
    },
    {
        problem:"长三角区域创新专题",
        path: "RegionInnovation",
        component:() => import("views/CasesView/RegionInnovation.vue")
    },
    {
        problem:"长三角科学创新空间",
        path: "ScientificInnovation",
        component:() => import("views/CasesView/ScientificInnovation.vue")
    },
    {
        problem:"长三角工业创新环境",
        path: "IndustrialInnovation",
        component:() => import("views/CasesView/IndustrialInnovation.vue")
    },
    {
        problem:"小流域山洪灾害在线模拟",
        path: "watershedFlood",
        component:() => import("views/CasesView/watershedFlood.vue")
    },
    {
        problem:"滇池三维水动力模拟系统",
        path: "Dianchi",
        component:() => import("views/CasesView/Dianchi.vue")
    },
    {
        problem:"太湖水污染扩散模拟",
        path: "Taihu",
        component:() => import("views/CasesView/Taihu.vue")
    },
    {
        problem:"夹江水污染扩散模拟",
        path: "Jiajiang",
        component:() => import("views/CasesView/Jiajiang.vue")
    },
    {
        problem:"长三角经济运行",
        path: "EconomicRun",
        component:() => import("views/CasesView/EconomicRun.vue")
    },
    {
        problem:"长三角新冠疫情",
        path: "Covid19",
        component:() => import("views/CasesView/Covid19.vue")
    },
    {
        problem:"长三角风暴潮模拟",
        path: "stormSurge",
        component:() => import("views/CasesView/stormSurge.vue")
    },
    {
        problem:"长三角风暴潮模拟",
        path: "stormSurge2",
        component:() => import("views/CasesView/stromSurge2.vue")
    },
    {
        problem:"南京地面淹没模拟系统",
        path: "SUFS",
        component:() => import("views/CasesView/SUFS.vue")
    }
    // {
    //     problem:"湖泊水环境监测",
    //     name:"滇池模型-富营养化水质参数",
    //     data:require("@/assets/video/滇池模型-富营养化水质参数.mp4"),
    //     img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
    //     path:"dian_water",
    //     description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    //     component:() => import( "@/views/CasesView/Video.vue")
    // },
    // {
    //     problem:"湖泊水环境监测",
    //     name:"滇池模型-水华",
    //     data:require("@/assets/video/滇池模型-水华.mp4"),
    //     img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
    //     path:"dian_shuihua",
    //     description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    //     component:() => import( "@/views/CasesView/Video.vue")
    // },
    // {
    //     problem:"湖泊水环境监测",
    //     name:"太湖流场20141021",
    //     data:require("@/assets/video/太湖流场.avi"),
    //     img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
    //     path:"taihu_liuchang20141021",
    //     description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    //     component:() => import( "@/views/CasesView/Video.vue")
    // },
    // {
    //     problem:"湖泊水环境监测",
    //     name:"太湖水污染扩散系统演示",
    //     data:require("@/assets/video/太湖水污染扩散系统演示.mp4"),
    //     img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
    //     path:"taihu_pollution",
    //     description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    //     component:() => import( "@/views/CasesView/Video.vue")
    // },
    // {
    //     problem:"洪涝水环境灾害",
    //     name:"流域洪涝模拟视频",
    //     data:require("@/assets/video/流域洪涝模拟视频-短-有配音.mp4"),
    //     img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
    //     path:"river_flood",
    //     description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    //     component:() => import( "@/views/CasesView/Video.vue")
    // },
    // {
    //     problem:"湖泊水环境监测",
    //     name:"应急响应-非溶于水",
    //     data:require("@/assets/video/应急响应-非溶于水.mp4"),
    //     img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
    //     path:"emergency_nowater",
    //     description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    //     component:() => import( "@/views/CasesView/Video.vue")
    // },{
    //     problem:"湖泊水环境监测",
    //     name:"应急响应-污染扩散",
    //     data:require("@/assets/video/应急响应-污染扩散.mp4"),
    //     img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
    //     path:"emergency_spread",
    //     description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
    //     component:() => import( "@/views/CasesView/Video.vue")
    // },

]
