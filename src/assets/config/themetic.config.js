import { cases_config } from '@/assets/config/cases.config';
import { sciencePro } from '../data/home/sciencePro';
export const themeticData = [
   
]
let example={
    name: "流域生态环境演变",
    introduction: "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
        "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。",
    classification: "自然",
    relatedCases: [
        {
            name: "SWMM",
            path: "SWMM",
            thumbnail: "http://localhost:3030/img/swmm.2f8c8c5d.png",
            description: "SWMM（暴雨洪水管理模型）是一个动态的降水-径流模拟模型，主要用于模拟城市某一单一降水事件或长期的水量和水质模拟。其径流模块部分综合处理各子流域所发生的降水，径流和污染负荷。其汇流模块部分则通过管网、渠道、蓄水和处理设施、水泵、调节闸等进行水量传输。"
        }, 
    ],
    relatedData: [
        {
            name: "shanghai DEM",
            thumbnail: "http://localhost:3030/img/map_1_3697_8171.ca8e9f30.jpg"
        }, 
    ],
    description: [
        {
            type: "text",
            value: "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
                "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。" + "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
                "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"
        },
        {
            type: "image",
            value: "http://localhost:3030/img/%E6%B5%81%E5%9F%9F%E7%94%9F%E6%80%81%E7%8E%AF%E5%A2%83%E6%BC%94%E5%8F%98.ed4630ac.png"
        },
        {
            type: "text",
            value: "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
                "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
                "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。" + "随着生态环境问题的日益突出,流域生态环境演变研究成为生态环境研究领域的热点。流域生态环境由流域生物群落及非生物自然因素组成的各种生态系统所构成的整体，" +
                "是“对人类生存和发展有影响的流域中自然因子的综合”。在自然因素与人为因素的共同作用下，生态环境以不同的时间尺度在发展演变。"
        },
    ]
}
for(let i in sciencePro){
    for(let j in sciencePro[i].children)
        {
            let themetic={
                    name: sciencePro[i].children[j].name.replace("\n", ""),
                    introduction: "",
                    classification: "",
                    relatedCases: [
            
                    ],
                    relatedData: [
            
                    ],
                    description: [
                        {
                            type: "text",
                            value: sciencePro[i].children[j].description
                        },
                        {
                            type: "image",
                            value: require("@/"+sciencePro[i].children[j].path)
                        },
                    ]
                
            }
            let name=themetic.name
            for(let k in cases_config){
                if(name==cases_config[k].problem){
                    themetic.relatedCases.push(cases_config[k])
                }
            }
            themeticData.push(themetic)
        }
}
console.log(themeticData)