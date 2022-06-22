export var relation=require("./relation.json")
export const initRelation=()=>{
  relation=JSON.parse(localStorage.getItem("relation"))//Topbar配合
  console.log(relation)
}