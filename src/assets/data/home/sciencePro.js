const colors = ['hsl(208,100%,65%)', 'hsl(218,100%,65%)', '#EA5151', '#CC3F57', '#9A2555'];

const nature = {
  name: '自然',
  itemStyle: {
    color: colors[0]
  },
  children: [
    {
      name: '灾害响应\n与治理',

      children: [
        {
          name: '5☆',
          children: [
            {
              name: '台风\n风暴潮',
            }
          ],


        },
        {
          name: '4☆',
          children: [
            {
              name: '洪涝\n水环境灾害',
            }
          ],

        },
        {
          name: '3☆',
          children: [
            {
              name: '湿地保护',
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '地质灾害',
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '大气污染',
            }
          ],
        },
      ]
    },
    {
      name: '全球变化与\n区域环境演化',
      
      children: [
        {
          name: '5☆',
          children: [
            {
              name: '海岸带变迁',
            }
          ],
        },
        {
          name: '4☆',
          children: [
            {
              name: '河口海岸水动力',
            }
          ],

        },
        {
          name: '3☆',
          children: [
            {
              name: '湖泊碳循环',
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '土壤碳氮循环',
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '土壤氮转化过程\n及其环境效应',
            }
          ],
        },
      ]
    },
    {
      name: '流域水循环\n及其驱动机制',

      children: [
        {
          name: '5☆',
          children: [
            {
              name: '流域生态环境\n演变',
            }
          ],
        },

        {
          name: '4☆',
          children: [
            {
              name: '流域碳水耦合循环',
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '地表地下水耦合',
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '湖泊水环境监测',
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
      name: '城市化\n与人地关系\n协调发展',

      children: [
        {
          name: '5☆',
          children: [
            {
              name: '城市扩张',
            }
          ],
        },

        {
          name: '4☆',
          children: [
            {
              name: '农业生态',
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '人地关系',
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '城市水问题',
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '自然遗产',
            }
          ],
        },
        {
          name: '4☆',
          children: [
            {
              name: '城市群发展',
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
