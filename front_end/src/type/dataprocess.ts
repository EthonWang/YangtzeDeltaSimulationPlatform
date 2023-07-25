export interface SerchInt {
    asc: string;
    categoryName: string;
    curQueryField: string;
    page: number;
    pageSize: number;
    searchText: string;
    sortField: string;
}



export class searchParam implements SerchInt {
    asc: string;
    categoryName: string;
    curQueryField: string;
    page: number;
    pageSize: number;
    searchText: string;
    sortField: string;
    constructor() {
        this.asc = "false";
        this.categoryName = "6117767e61ce444130b1a276";
        this.curQueryField = "Name";
        this.page = 1;
        this.pageSize = 10;
        this.searchText = "";
        this.sortField = "ViewCount";
    }
}
export interface invokeServicesInt {
    serviceId: string;
    reqUsrOid: string;
    contributor: string;
    token: string;
    name: string;
    dataIds: string[];
    metaDetail: string;
    method: string;
    cacheUrl: string;
    time: string;
    isPortal: string;
    onlineStatus: string;
}
export interface DataMethodItem {
    description: string;
    author_name: string;
    name: string;
    invokeServices: invokeServicesInt[];
}
export class DataMetnod {
    total = 0;
    list: DataMethodItem[] = [];
}

export interface optionData {
    value: string;
    label: string
}

export class options {
    serchOption: optionData[] = [{
        value: "Name",
        label: "名称",
    },
    {
        value: "Keyword",
        label: "关键字",
    },
    {
        value: "Content",
        label: "内容",
    },
    {
        value: "Contributor",
        label: "贡献值",
    },];
    sortascOption: optionData[] = [
        {
            value: "true",
            label: "升序",
        },
        {
            value: "false",
            label: "降序",
        },
    ];
    sortlabelOption: optionData[] = [
        {
            value: "ViewCount",
            label: "点击量",
        },
        {
            value: "Name",
            label: "名称",
        },
        {
            value: "CreateTime",
            label: "创建时间",
        },
    ]
}
export class invokeService implements invokeServicesInt {
    serviceId: string = "";
    reqUsrOid: string = "";
    contributor: string = "";
    token: string = "";
    name: string = "";
    dataIds: string[];
    metaDetail: string = "";
    method: string = "";
    cacheUrl: string = "";
    time: string = "";
    isPortal: string = "";
    onlineStatus: string = "";
}
export class drawboxparam {
    title: string = "";
    show: boolean = false;
}

export interface metaDetailDependency {
    name: string;
    url: string;
}
export interface metaDetailInputInt {
    description: string;
    name: string;
    type: string;
    loadName: string;
    url: string;
}
export class metaDetailInput {
    description: string;
    name: string;
    type: string;
    loadName: string
}
export interface metaDetailOutputInt {
    description: string;
    name: string;
    type: string
}
export interface metaDetailParameter {
    description: string;
    name: string;
    type: string;
    value: string;
}
export class metaDetail {
    dependency: metaDetailDependency[];
    description: string;
    input: metaDetailInputInt[];
    output: metaDetailOutputInt[];
    parameter: metaDetailParameter[];
}

export interface testDataInt {
    oid: string;
    path: string;
    url: string;
    distributeId: string;
    token: string;
    label: string;
}

export interface applicationInt {
    id: string;
    method: string;
    invokeCount: number;
}

export class testData {
    list: testDataInt[] = []
}

export class applicationData implements applicationInt {
    id: string = "";
    method: string = "";
    invokeCount: number = 0;
}

export class resultData {
    name: string;
    url: string;
    visualUrl: string;
}

export interface outPutDataInt {
    statename: any;
    event: any;
    url: string;
    visualUrl: string;
    urls: any;
    tag: string;
    suffix: string;
    templateId: any;
    children: any;
    multiple: false;
    visual: any;
}

export class outputData {
    list: outPutDataInt[] = []
}

export class visualData {
    visualization: boolean = false
    visualPath: string = ''
}
