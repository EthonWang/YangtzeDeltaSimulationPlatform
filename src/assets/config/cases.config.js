export const cases_config = [
    {
        name:"SAGA",//名字唯一
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")//位置
    },
    {
        name:"SAGA1",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA2",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SAGA3",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"PROBLEM",//唯一
        img_path:require("../img/cases/problem.jpg"),//路径加上require（），网址不用加
        path:"saga",//唯一
        component:() => import( "views/CasesView/SAGA.vue")//位置
    },
    {
        name:"SAGA4",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"saga",
        component:() => import( "views/CasesView/SAGA.vue")
    },
    {
        name:"SWMM",
        img_path:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F113020142315%2F201130142315-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654395485&t=c87aa06645ddff89c99968c1385455eb",
        path:"swmm",
        component:() => import( "views/CasesView/SWMM.vue")
    },

]
