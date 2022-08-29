import { Encrypt,Decrypt } from "@/util/codeUtil"
export var relation=require("./relation.json")
export const initRelation=()=>{
  relation=JSON.parse(Decrypt(localStorage.getItem("relation")))//Topbar配合
  console.log(relation)
}