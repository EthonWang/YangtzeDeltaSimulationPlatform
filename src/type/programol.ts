import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import LabelCollection from "cesium/Source/Scene/LabelCollection";

export interface Tree {
    id: string;
    label: string;
    type: string;
    filePath: string;
    children?: Tree[];
}

export interface CMConfigInt {
    disabled: boolean,
    indentWithTab: boolean,
    tabSize: number,
    autofocus: boolean,
    placeholder: string,
    backgroundColor: string,
    language: string,
    theme: string,
    phrases: string,
}

// export class configData {
//     disabled: boolean = false
//     indentWithTab: boolean = true
//     tabSize: number = 4
//     autofocus: boolean = true
//     placeholder: string = "input..."
//     backgroundColor: string = "red"
//     language: string = "python"
//     theme: string = "oneDark"
//     phrases: string = "en-us"
// }

export class CMData {
    themes: any = { oneDark }
    languages: any = { python: python() }
    CMConfig: CMConfigInt = {
        disabled: false,
        indentWithTab: true,
        tabSize: 4,
        autofocus: true,
        placeholder: "input...",
        backgroundColor: "red",
        language: "python",
        theme: "oneDark",
        phrases: "en-us",
    }
}

export class projectData {
    projectName: string = ''
    projectDirectory: Tree[] = [
    ]
    defaultProps = {
        label: "label",
        children: "children"
    }
    currentnode: string = '';
    isrunning: boolean = false;
    isdownloading: boolean = false;
    containerStatus: boolean = false;
}
export interface optionItemInt {
    value: string,
    label: string,
}

// export class projectSelectionData {
//     options: optionItemInt[] = [
//         {
//             value: "Option1",
//             label: "Option1",
//         },
//     ]
//     projectSel: string = ''
// }

export interface tabItemInt {
    title: string,
    name: string,
}
export class CodeData {
    codeMap: Map<string, string> = new Map<string, string>()
    code: string
}
export class TabData {
    tabIndex: number = 0
    editableTabs: tabItemInt[] = [
    ]
    editableTabsValue: string = ''
}

export class menuContextData {
    foldervisible: boolean = false
    filevisible: boolean = false
}

export class FolderCreateData {
    folderCreateDialogShow: boolean = false
    folderName: string
}

export class FileCreateData {
    fileCreateDialogShow: boolean = false
    fileName: string
}

export class NodeContextData {
    nodeElement: any
    nodeData: any
    nodeEvent: any
    currentNodeFolder: string
    currentNodeFile: string
    currentNodeId: string
}

export class ProjectDeleteData {
    projectDeleteDialogShow: boolean = false
}

export class ProjectCreateData {
    projectCreateDialogShow: boolean = false
    projectName: string
    pythonOptions: optionItemInt[] = [
        {
            value: "python:3.9",
            label: "python39",
        },
        {
            value: "python:3.8",
            label: "python38",
        },
        {
            value: "python:3.6",
            label: "python36",
        },
        {
            value: "python2.7",
            label: "python27",
        },
    ]
    pythonValue: ''
}

export class Project {
    projectName: string = '';
    userId: string = ''
    pythonVersion: string = 'python:3.9'
    workspace: string = '';
}

export class WorkSpace {
    userName: string = '';
    projectOption: optionItemInt[] = [];
    projectSelId: string = ''
    LastId: string = ''
    loading: boolean = false
}

export class Createfile {
    fileName: string = '';
    filePath: string = '';
    isFolder: boolean = false;
    projectName: string = '';
    userId: string = '';
    parentId: string = '';
}

export class Deletefile {

}
export class FileRenameData {
    fileRenameDialogShow: boolean = false;
    fileName: string = '';
}
export class OutputData {
    output: string = ''
}
