export class searchParam {
    page: number;
    pageSize: number;
    searchText: string;
    asc: boolean;
    sortField: string;
    constructor() {
        this.page = 1;
        this.pageSize = 10;
        this.searchText = "";
        this.asc = false;
        this.sortField = "createTime"
    }
}

export class DataMethod {
    total = 0;
    list: DataMethodItem[] = [];
}

export interface DataMethodItem {
    description: string;
    author: string;
    name: string;
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

export class uploadData {
    uploaddialogVisible: boolean = false
    dataMethod: DataMethodItem = {
        description: '',
        author: '',
        name: '',
    }
    formdata = new FormData()
}

export class manageData {
    manageDialogVisible: boolean = false
    list: DataMethodItem[] = [];
    total = 0;
}

export class deleteData {
    deleteDialogVisible: boolean = false
    deleteId: string
}

export class modifyData {
    modifyDialogVisible: boolean = false
    modifyId: string
    dataMethod: DataMethodItem = {
        description: '',
        author: '',
        name: '',
    }
    formdata = new FormData()
}
export interface invokeItemInt {
    default: string;
    description: string;
    name: string;
    option: string;
    type: string;
    value: string;
}
export interface fileinvokeItemInt extends invokeItemInt {
    loadName: string
    url: string
    userDataId: string
}
export class invokeInfoData {
    id: string
    AttributeSet: invokeItemInt[] = []
    Parameters: fileinvokeItemInt[] = []
    PythonLibs: invokeItemInt[] = []
    PythonVersion: invokeItemInt[] = []
    Result: invokeItemInt[] = []
    InputData: fileinvokeItemInt[] = []
    OutputData: invokeItemInt[] = []
}

export class drawboxData {
    drawerVisible: boolean = false
    drawerTitle: string = ''
}
export class resultData {
    name: string;
    dataContainerUrl: string;
    visualUrl: string;
}

export interface outPutDataInt {
    fileName: string
    filePath: string
    dataContainerUrl: string
}

export class outputData {
    list: outPutDataInt[] = []
}


