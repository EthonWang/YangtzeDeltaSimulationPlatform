import { get, post } from "@/request/request"
import { relation, initRelation } from "@/assets/data/another/relation"

// 上传文件
export default class {
    constructor() {
        this.allOutDegreeEdge = []//出去点的边，上级点位
        this.allInDegreeEdge = []//进入点的边，下级点位
        this.edgeNode = []//边与点的对应
        this.weight = []
    }
    giveRecommend(knownName = []) {
        relation.weight = new Array(relation.nodes.length).fill(0)
        let sourceNodes = []
        for (let i = 0; i < knownName.length; i++) {
            console.log(relation.nodes);
            let firstNode = relation.nodes.findIndex((elment) => {
                return elment.name == knownName[i]
            })
            sourceNodes.push(firstNode)
        }
        console.log(sourceNodes);

        for (let i = 0; i < sourceNodes.length; i++) {
            let willVisit = new Array(relation.nodes.length).fill(true)
            let sourceNode = sourceNodes[i]
            let nextNodeList = []
            let nowNodeList = []
            let nowDoorNum = 0
            let nowWeight = 10
            nowNodeList.push(sourceNode)
            for (let node = nowNodeList.shift(); node != undefined || nowWeight > 0; node = nowNodeList.shift()) {
                if (willVisit[node]) {
                    willVisit[node] = false
                    let outEdge = relation.allOutDegreeEdge[node]
                    let inEdge = relation.allInDegreeEdge[node]
                    for (let j = 0; j < inEdge.length; j++) {
                        if (relation.edgeNode[inEdge[j]][1] == -1 || relation.edgeNode[inEdge[j]][0] == -1) { continue }
                        if (willVisit[relation.edgeNode[inEdge[j]][0]]) {
                            nextNodeList.push(relation.edgeNode[inEdge[j]][0])
                            relation.nodes[relation.edgeNode[inEdge[j]][0]].weight += nowWeight
                        }
                    }
                    for (let j = 0; j < outEdge.length; j++) {
                        if (relation.edgeNode[outEdge[j]][1] == -1 || relation.edgeNode[outEdge[j]][0] == -1) { continue }
                        if (willVisit[relation.edgeNode[outEdge[j]][1]]) {

                            nextNodeList.push(relation.edgeNode[outEdge[j]][1])
                            // console.log(relation.nodes[relation.edgeNode[outEdge[j]][1]])
                            relation.nodes[relation.edgeNode[outEdge[j]][1]].weight += nowWeight
                        }
                    }
                }

                if (nowNodeList.length == 0) {
                    for (let k = 0; k < nextNodeList.length; k++) {
                        nowNodeList.push(nextNodeList[k])
                    }
                    nextNodeList = []

                    nowWeight--
                }
            }
        }
        relation.nodes.sort((a, b) => { return b.weight - a.weight })
        let output = []
        for (let i = 0; i < relation.nodes.length; i++) {
            if (output.length >= 5) { break }
            if ("type" in relation.nodes[i]) {
                if (relation.nodes[i].type == "data") {
                    output.push(relation.nodes[i])
                }
            }
        }
        return output

    }
    getKnowledgeSorce(user_id) {
        return new Promise((resolve, reject) => {
            post("/resource/getUserAllResource?userId=" + user_id,).then((res) => {
                localStorage.setItem("allResourceNum", JSON.stringify({ 
                    privateDataNum: res.data.personalData.length,
                    modelNum:res.data.modelList.length,
                    themeNum:res.data.themeList.length
                }))
                let personalData = res.data.personalData
                let publicData = res.data.publicData
                let modelList = res.data.modelList
                let themeList = res.data.themeList
                initRelation();
                for (let i = 0; i < personalData.length; i++) {
                    let data = personalData[i];

                    if (personalData[i].problemTags[0] != "" && personalData[i].problemTags != []) {
                        personalData[i].problemTags = data.problemTags.split(",");

                    }
                    data['category'] = 0
                    data['weight'] = 0
                    data['symbolSize'] = 10
                    data['value'] = data.description
                    data['type'] = "data"

                    relation.nodes.push(data);
                    relation.links.push({
                        source: data.name,
                        target: "私人",
                        relation: "隐私"
                    });
                    if (data.problemTags.length == 0) {
                        relation.links.push({
                            source: data.name,
                            target: "非面向问题类",
                            relation: "问题归属"
                        });
                    } else {
                        for (let j in data.problemTags) {
                            let problem = data.problemTags[j].replace("\n", "");
                            relation.links.push({
                                source: data.name,
                                target: problem,
                                relation: "问题归属"
                            });
                        }
                    }
                }
                for (let i in publicData) {
                    let data = publicData[i];
                    // data.name = data.name;
                    if (publicData[i].problemTags[0] != "" && publicData[i].problemTags != []) {
                        publicData[i].problemTags = data.problemTags.split(",");
                    }
                    if (publicData[i].normalTags[0] != "" && publicData[i].normalTags != []) {
                        publicData[i].normalTags = data.normalTags.split(",");
                    }
                    relation.nodes.push({
                        name: data.name,
                        category: 0,
                        symbolSize: 10,
                        value: data.description,
                        type: "dataFather",
                        weight: 0
                    });
                    relation.links.push({
                        source: data.name,
                        target: "公开",
                        relation: "隐私"
                    });
                    if (data.problemTags.length == 0) {
                        relation.links.push({
                            source: data.name,
                            target: "非面向问题类",
                            relation: "问题归属"
                        });
                    } else {
                        for (let j in data.problemTags) {
                            let problem = data.problemTags[j].replace("\n", "");
                            relation.links.push({
                                source: data.name,
                                target: problem,
                                relation: "问题归属"
                            });
                        }
                        for (let j in data.normalTags) {
                            let problem = data.normalTags[j].replace("\n", "");
                            relation.links.push({
                                source: data.name,
                                target: problem,
                                relation: "问题归属"
                            });
                        }
                    }
                    let father_name = data.name
                    let lastName = ""

                    for (let j = 0; j < publicData[i].visualDataItems.length; j++) {

                        data = publicData[i].visualDataItems[j];
                        // data.name = data.name.split(".")[0];
                        if (data.name == lastName) {
                            continue
                        }

                        if (publicData[i].visualDataItems[j].problemTags[0] != "" && publicData[i].visualDataItems[j].problemTags != []) {
                            publicData[i].visualDataItems[j].problemTags = data.problemTags.split(",");
                        }
                        if (publicData[i].visualDataItems[j].normalTags[0] != "" && publicData[i].visualDataItems[j].normalTags != []) {
                            publicData[i].visualDataItems[j].normalTags = data.normalTags.split(",");
                        }


                        data['category'] = 0
                        data['weight'] = 0
                        data['symbolSize'] = 10
                        data['value'] = data.description
                        data['type'] = "data"
                        let data1 = JSON.parse(JSON.stringify(data))

                        relation.nodes.push(data1);
                        relation.links.push({
                            source: data.name,
                            target: "公开",
                            relation: "隐私"
                        });
                        relation.links.push({
                            source: data.name,
                            target: father_name,
                            relation: "父类"
                        });
                        if (data.problemTags.length == 0) {
                            relation.links.push({
                                source: data.name,
                                target: "非面向问题类",
                                relation: "问题归属"
                            });
                        } else {
                            for (let j in data.problemTags) {
                                let problem = data.problemTags[j].replace("\n", "");
                                relation.links.push({
                                    source: data.name,
                                    target: problem,
                                    relation: "问题归属"
                                });
                            }
                            for (let j in data.normalTags) {
                                let problem = data.normalTags[j].replace("\n", "");
                                relation.links.push({
                                    source: data.name,
                                    target: problem,
                                    relation: "类别归属"
                                });
                            }
                        }
                        lastName = data.name
                    }
                }
                for (let i in modelList) {
                    let data = modelList[i];

                    relation.nodes.push({
                        name: data.modelName,
                        category: 1,
                        symbolSize: 10,
                        value: data.overview,
                        type: "model",
                        weight: 0
                    });
                    relation.links.push({
                        source: data.modelName,
                        target: "模型",
                        relation: "类型"
                    });
                    for (let j in data.classifications) {
                        relation.links.push({
                            source: data.modelName,
                            target: data.classifications[j],
                            relation: "归类"
                        });

                    }
                }
                let recordName = []
                for (let i in themeList) {
                    let data = themeList[i];
                    let cases = data.relatedCases

                    for (let k in cases) {
                        let acase = cases[k]
                        if (!("name" in acase)) { continue }
                        let ok = true
                        for (let l in recordName) {
                            if (acase.name == recordName[l]) {
                                ok = false
                                console.log(recordName[l]);
                                break
                            }
                        }
                        if (ok) {
                            recordName.push(acase.name)
                            console.log(recordName);
                            relation.nodes.push({
                                name: acase.name + "案例",
                                category: 2,
                                symbolSize: 10,
                                value: acase.description,
                                type: "case",
                                weight: 0
                            });
                            relation.links.push({
                                source: acase.name + "案例",
                                target: "案例",
                                relation: "类型"
                            });
                        }


                        relation.links.push({
                            source: acase.name + "案例",
                            target: data.name,
                            relation: "问题归属"
                        });
                    }

                }
                resolve("ok")
            }).catch((err) => {
                reject("error")
            })
        })

    }
    initGraph(user_id) {
        return new Promise((resolve, reject) => {
            this.getKnowledgeSorce(user_id).then((res) => {
                console.log(relation)
                relation.allInDegreeEdge = []
                relation.allOutDegreeEdge = []
                relation.edgeNode = new Array(relation.links.length).fill(-1).map(item => new Array(2).fill(-1))
                for (let i = 0; i < relation.nodes.length; i++) {
                    let outEdge = []
                    let inEdge = []
                    let node = relation.nodes[i]
                    for (let j = 0; j < relation.links.length; j++) {
                        let link = relation.links[j]
                        if (node.name == link.source) {
                            outEdge.push(j)
                            relation.edgeNode[j][0] = i

                        }
                        if (node.name == link.target) {
                            inEdge.push(j)
                            relation.edgeNode[j][1] = i
                        }
                    }
                    relation.allOutDegreeEdge.push(outEdge)
                    relation.allInDegreeEdge.push(inEdge)
                }
                console.log(relation.edgeNode)
                resolve("ok")
            })
        })
    }
}
