import Mock from "mockjs"
import banner from "../../public/case/sustainable/themeData.json"

Mock.mock("/mock/banner",{code: 200, data:banner});

