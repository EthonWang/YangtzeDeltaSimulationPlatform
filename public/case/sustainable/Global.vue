<script>
    const MapClickName=new Array();
    //最后一个页面的展示数据
    const ResultJson='';
    const VisualJson=[];
    const ResultScore=[];
    const RegionScale='';
    const crTableFlag=false;
    const inMapFlag = false;
    const inMapData = {
        city:'',
        tableName:'',
    };
    const viTableName = [];
    const viBarName = [];
    const viSelectedJson = {};
    const SDGUrl='http://121.4.86.81:8080/newsdgplatformbackground-0.0.1-SNAPSHOT';
    // const SDGUrl='http://localhost:8080/newsdgplatformbackground_war';
    // const SDGUrl='http://172.21.213.66:8080/newsdgplatformbackground_war_exploded'
    export default
    {
        ResultJson,
        MapClickName,
        VisualJson,
        SDGUrl,
        ResultScore,
        RegionScale,
        crTableFlag,
        inMapFlag,
        inMapData,
        viTableName,
        viBarName,
        viSelectedJson
    }
</script>