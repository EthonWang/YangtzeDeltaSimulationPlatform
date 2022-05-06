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
              name: '台风与风暴潮',
              path:'assets/problem/台风、风暴潮.png',
              description:"当台风移向陆地，海水向海岸方向强力堆积，潮位猛涨，形成风暴潮，导致沿海水位上升。如果风暴潮与天文大潮高潮位相遇，将在海岸产生强大的破坏力，造成大量人员伤亡与经济损失，严重危害人民生命财产安全。",
            }
          ],


        },
        {
          name: '4☆',
          children: [
            {
              name: '洪涝\n水环境灾害',
              path:'assets/problem/洪涝、水环境灾害.png',
              description:"洪涝灾害具有双重属性，既有自然属性，又有社会经济属性。暴雨形成的洪水是形成洪涝灾害的直接原因。只有当洪水发生在有人类活动的地方才能成灾，受洪水威胁最大的地区往往是江河中下游地区。",
            }
          ],

        },
        {
          name: '3☆',
          children: [
            {
              name: '湿地保护',
              path:'assets/problem/湿地保护.png',
              description:"我国湿地资源面临的问题很多，其中最主要的是对湿地的盲目开垦、环境污染及生物资源的过度利用等。湿地环境污染是中国湿地面临的最严重的威胁之一，包括工业废水、生活污水、农药、化肥。酷渔滥捕的现象也十分严重，导致湿地生物群落结构的改变以及多样性的降低。",
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '地质灾害',
              path:'assets/problem/地质灾害.png',
              description:"地质灾害，是指由于自然产生和人为诱发对人民生命财产安全造成危害的地质现象（地震除外），主要包括崩塌、滑坡、泥石流、地面塌陷、地裂缝、地面沉降等。",
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '大气污染',
              path:'assets/problem/大气污染.png',
              description:"大气污染物由人为源或者天然源进入大气（输入），参与大气的循环过程，经过一定的滞留时间之后，又通过大气中的化学反应、生物活动和物理沉降从大气中去除（输出）。如果输出的速率小于输入的速率，就会在大气中相对集聚，造成大气中某种物质的浓度升高。当浓度升高到一定程度时，就会直接或间接地对人、生物或材料等造成急性、慢性危害。",
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
              path:'assets/problem/海岸带变迁.png',
              description:"海岸由于其特殊的地理位置，其形成演化一直受到来自陆地和海洋两方面的作用的影响。海岸带区域人口密集、开发强度高、生态脆弱，海岸带的可持续地发展是世界各国共同面对的问题，也是当前中国经济发展面临的紧迫问题。加快推进海岸带可持续发展的相关研究是加强我国海洋环境保护、促进海洋经济发展、实现我国经济社会可持续发展的重要保障。",
            }
          ],
        },
        {
          name: '4☆',
          children: [
            {
              name: '河口海岸水动力',
              path:'assets/problem/河口海岸水动力.png',
              description:"海岸河口水深地形条件复杂，岸线多呈不规则状，潮流、波浪等动力条件交织在一起,目前国际上有不少成熟的水动力数学模型，如丹麦水动力研究所DHI的MIKE21系列，荷兰代尔夫特大学的DELFT3D，美国陆军水利工程实验室的SMS系列等，在一些水运工程中被广泛应用，可为工程应用提供完备有效的设计条件和参数。",
            }
          ],

        },
        {
          name: '3☆',
          children: [
            {
              name: '湖泊碳循环',
              path:'assets/problem/湖泊碳循环.png',
              description:"湖泊碳循环是全球碳循环过程中的重要环节,随着全球碳循环研究的不断深入,湖泊碳循环对全球碳循环的影响,以及其对全球气候变化的调节作用越来越受到关注。近期研究表明，具有大面积同步连续观测优势的遥感技术可为全球湖泊碳循环研究提供大面积同步观测数据的支撑，同时由于光谱在物质识别和探测方面的优势,使得遥感技术在有机质类型反演方面与地球化学方法存在结合的可能。",
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '土壤碳氮循环',
              path:'assets/problem/土壤碳氮循环.png',
              description:"土壤是陆地生态系统中的最大碳库，碳固存量是大气的3至4倍，碳、氮通过大气-作物-土壤界面进行周转和协同转化。动物、植物、细菌、真菌在土壤碳氮循环中扮演着重要角色，土壤碳氮循环过程为从生物流向土壤，再从土壤流向大气，影响这一过程的驱动因素有气候、土壤性质、生物生态结构和人为因素。",
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '土壤氮转化过程\n及其环境效应',
              path:'assets/problem/土壤氮转化过程及其环境效应.png',
              description:"土壤氮转化过程是生态系统氮循环的重要组成部分，调控着土壤可利用氮的含量，决定了土壤氮素的存留状况。氮是生物体的基本组成元素，植物和微生物可直接利用的氮素主要来自于土壤微生物的氮转化过程，土壤微生物介导的氮转化过程一方面可以提供生物可直接利用的氮素，另一方面也直接调控生态系统土壤氮损失量。",
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
              path:'assets/problem/流域生态环境演变.png',
              description:"随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。",
            }
          ],
        },

        {
          name: '4☆',
          children: [
            {
              name: '流域碳水耦合循环',
              path:'assets/problem/流域碳水耦合循环.png',
              description:"",
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '地表地下水耦合',
              path:'assets/problem/地表地下水耦合.png',
              description:"",
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '湖泊水环境监测',
              path:'assets/problem/湖泊水环境监测.png',
              description:"",
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
              path:'assets/problem/城市扩张.png',
              description:"",
            }
          ],
        },

        {
          name: '4☆',
          children: [
            {
              name: '农业生态',
              path:'assets/problem/农业生态.png',
              description:"",
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '人地关系',
              path:'assets/problem/人地关系.png',
              description:"",
            }
          ],
        },
        {
          name: '2☆',
          children: [
            {
              name: '城市水问题',
              path:'assets/problem/城市水问题.png',
              description:"",
            }
          ],
        },
        {
          name: '3☆',
          children: [
            {
              name: '自然遗产',
              path:'assets/problem/自然遗产.png',
              description:"",
            }
          ],
        },
        {
          name: '4☆',
          children: [
            {
              name: '城市群发展',
              path:'assets/problem/城市群发展.png',
              description:"",
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
