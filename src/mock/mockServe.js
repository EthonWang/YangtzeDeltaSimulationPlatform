import Mock from "mockjs"
import banner from "../../public/case/sustainable/json/themeData.json"
import excel from "../../public/case/sustainable/json/EcoData.json"

Mock.mock("/mock/banner",{code: 200, data:banner});

Mock.mock("/mock/excel",{code: 300, data:excel});