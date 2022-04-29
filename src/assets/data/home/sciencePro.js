const colors = ['hsl(208,100%,65%)', 'hsl(218,100%,65%)', '#EA5151', '#CC3F57', '#9A2555'];

const nature = {
  name: '自然',
  itemStyle: {
    color: colors[0]
  },
  children: [
    {
      name: '灾害响应\n与\n治理',

      children: [
        {
          name: '5☆',
          children: [
            {
              name: '台风\n风暴潮',
              path:'assets/problem/台风、风暴潮.png'
            }
          ],


        },
        {
          name: '4☆',
          children: [
            {
              name: '洪涝\n水环境灾害',
              path:'assets/problem/洪涝、水环境灾害.png'
            }
          ],

        },
        {
          name: '3☆',
          children: [
            {
              name: '湿地保护',
              path:'assets/problem/湿地保护.png'
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '地质灾害',
              path:'assets/problem/地质灾害.png'
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '大气污染',
              path:'assets/problem/大气污染.png'
            }
          ],
        },
      ]
    },
    {
      name: '全球变化\n与\n区域环境演化',
      
      children: [
        {
          name: '5☆',
          children: [
            {
              name: '海岸带变迁',
              path:'assets/problem/海岸带变迁.png'
            }
          ],
        },
        {
          name: '4☆',
          children: [
            {
              name: '河口海岸水动力',
              path:'assets/problem/河口海岸水动力.png'
            }
          ],

        },
        {
          name: '3☆',
          children: [
            {
              name: '湖泊碳循环',
              path:'assets/problem/湖泊碳循环.png'
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '土壤碳氮循环',
              path:'assets/problem/土壤碳氮循环.png'
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '土壤氮转化过程\n及其环境效应',
              path:'assets/problem/土壤氮转化过程及其环境效应.png'
            }
          ],
        },
      ]
    },
    {
      name: '流域水循环\n及\n驱动机制',

      children: [
        {
          name: '5☆',
          children: [
            {
              name: '流域生态环境\n演变',
              path:'assets/problem/流域生态环境演变.png'
            }
          ],
        },

        {
          name: '4☆',
          children: [
            {
              name: '流域碳水耦合循环',
              path:'assets/problem/流域碳水耦合循环.png'
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '地表地下水耦合',
              path:'assets/problem/地表地下水耦合.png'
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '湖泊水环境监测',
              path:'assets/problem/湖泊水环境监测.png'
            }
          ],
        },
      ]
    }
  ]
}
const human = {
  name: '人文',
  itemStyle: {
    color: colors[1]
  },
  children: [
    {
      name: '城市化\n与\n人地关系\n协调发展',

      children: [
        {
          name: '5☆',
          children: [
            {
              name: '城市扩张',
              path:'assets/problem/城市扩张.png'
            }
          ],
        },

        {
          name: '4☆',
          children: [
            {
              name: '农业生态',
              path:'assets/problem/农业生态.png'
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '人地关系',
              path:'assets/problem/人地关系.png'
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '城市水问题',
              path:'assets/problem/城市水问题.png'
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '自然遗产',
              path:'assets/problem/自然遗产.png'
            }
          ],
        },
        {
          name: '4☆',
          children: [
            {
              name: '城市群发展',
              path:'assets/problem/城市群发展.png'
            }
          ],
        },
      ]
    }
  ]
}
export const sciencePro = [
  
      nature,
      human,

    
];
