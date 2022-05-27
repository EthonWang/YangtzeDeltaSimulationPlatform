export const cases_config = [    
    {
        name:"汾湖高新区城市雨洪管网模拟系统",
        img_path:require("../img/cases/swmm.png"),
        path:"swmm",
        description:" 本案例基于SWMM模型实现，主要用于模拟汾湖高新区降水事件的模拟，分别依照当地官方量化的五年一遇、十年一遇、二十年一遇、三十年一遇、五十年一遇的五个降雨量级下，二十四小时内下的城市排水管网与管点的水流情况。",
        component:() => import( "views/CasesView/SWMM.vue")
    },
    {
        name:"SAGA1",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA2",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA3",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"PROBLEM",//唯一
        img_path:require("../img/cases/problem.jpg"),//本地路径加上require（），网址不用加
        path:"saga",//唯一
        description:" SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。",
        component:() => import( "views/CasesView/SAGA.vue")//位置
    },
    {
        name:"SAGA4",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA5",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA6",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA7",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA8",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },

]
