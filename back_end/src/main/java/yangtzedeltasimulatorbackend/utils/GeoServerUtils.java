package yangtzedeltasimulatorbackend.utils;

import it.geosolutions.geoserver.rest.GeoServerRESTManager;
import it.geosolutions.geoserver.rest.GeoServerRESTPublisher;
import it.geosolutions.geoserver.rest.GeoServerRESTReader;
import it.geosolutions.geoserver.rest.decoder.RESTDataStore;
import it.geosolutions.geoserver.rest.decoder.RESTLayer;
import it.geosolutions.geoserver.rest.encoder.GSAbstractStoreEncoder;
import it.geosolutions.geoserver.rest.encoder.GSLayerEncoder;
import it.geosolutions.geoserver.rest.encoder.GSResourceEncoder;
import it.geosolutions.geoserver.rest.encoder.datastore.*;
import it.geosolutions.geoserver.rest.encoder.feature.GSFeatureTypeEncoder;
import it.geosolutions.geoserver.rest.manager.GeoServerRESTAbstractManager;
import it.geosolutions.geoserver.rest.manager.GeoServerRESTStoreManager;

import javax.swing.plaf.synth.SynthEditorPaneUI;
import java.io.File;
import java.io.FileNotFoundException;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.List;

/**
 * Created by HYQ on 2021/8/16 11:17
 **/
public class GeoServerUtils {
    /**
     * @param workSpace: 工作空间名称
     * @param storeName: 存储库名称
     * @param tiffPath:  tiff文件路径
     * @return void
     * @description 将tiff文件发布为GeoServer服务
     * @author HYQ
     * @date 2021/8/16 19:44
     */
    public static void PublishTiff(String workSpace, String storeName, String tiffPath) throws MalformedURLException, FileNotFoundException {
        /**Geoserver 连接配置**/
        String url = "http://172.21.213.92:8089/geoserver";
        String username = "admin";
        String passWord = "geoserver";

        /**Geoserver 连接配置**/
//        判断workspace是否存在，不存在创建
        GeoServerRESTManager manager = new GeoServerRESTManager(new URL(url), username, passWord);
        GeoServerRESTPublisher publisher = manager.getPublisher();
        List<String> workSpaces = manager.getReader().getNamespaceNames();
        if (!workSpaces.contains(workSpace)) {
            boolean createws = publisher.createWorkspace(workSpace);
            System.out.println("create workspace: " + createws);
        } else {
            System.out.println("workspace已经存在了,workspace:" + workSpace);
        }
//        判断数据存储是否存在，不存在创建
        RESTDataStore restDataStore = manager.getReader().getDatastore(workSpace, storeName);
        if (restDataStore == null) {
            GSGeoTIFFDatastoreEncoder gsGeoTIFFDatastoreEncoder = new GSGeoTIFFDatastoreEncoder(storeName);
            gsGeoTIFFDatastoreEncoder.setWorkspaceName(workSpace);
            gsGeoTIFFDatastoreEncoder.setUrl(new URL("file:" + tiffPath));

//            创建数据存储
            boolean creatStore = manager.getStoreManager().create(workSpace, gsGeoTIFFDatastoreEncoder);
            System.out.println("create TiFFStore : " + creatStore);
//            发布图层
            boolean publish = publisher.publishGeoTIFF(workSpace, storeName, new File(tiffPath));
            System.out.println("publish TIFF : " + publish);
        } else {
            System.out.println("数据存储已经存在了,store:" + storeName);
        }
    }

    /**
     * @param workSpace: 工作区
     * @param storeName: 数据存储名称
     * @param layerName: 图层名
     * @param styleName: 样式名
     * @param shapePath: 发布的shape路径
     * @return void
     * @description 发布Shapfile文件为Geoserver服务
     * @author HYQ
     * @date 2021/9/16 10:49
     */
    public static boolean PublishShape(String workSpace, String storeName, String layerName, String styleName, String shapePath) {
        /**Geoserver 连接配置**/
        String url = "http://172.21.213.92:8089/geoserver";
        String username = "admin";
        String passWord = "geoserver";
        /**Geoserver 连接配置**/
//        判断workspace是否存在，不存在创建
        GeoServerRESTManager manager = null;
        try {
            manager = new GeoServerRESTManager(new URL(url), username, passWord);
        } catch (MalformedURLException e) {
            e.printStackTrace();
            System.out.println("Geoserver连接失败！");
            return false;
        }
        GeoServerRESTPublisher publisher = manager.getPublisher();
        GeoServerRESTReader restReader = manager.getReader();
        List<String> workSpaces = restReader.getNamespaceNames();
        if (!workSpaces.contains(workSpace)) {
            boolean createws = publisher.createWorkspace(workSpace);
            System.out.println("workspace:" + createws + " 创建成功!");
        } else {
            System.out.println("workspace:" + workSpace + " 已经存在了!");
        }
//        判断数据存储是否存在，不存在创建
        RESTDataStore restDataStore = manager.getReader().getDatastore(workSpace, storeName);

        if (restDataStore == null) {
            GSShapefileDatastoreEncoder gsShapefileDatastoreEncoder = null;
            try {
                String newShapePath = "F:/YangtzeDataStore/resourceData/" + shapePath.split("/resourceData/")[1];
                gsShapefileDatastoreEncoder = new GSShapefileDatastoreEncoder(storeName, new URL("file:" + newShapePath));
            } catch (MalformedURLException e) {
                e.printStackTrace();
                System.out.println("数据存储创建失败！");
                return false;
            }
            gsShapefileDatastoreEncoder.setCharset(Charset.forName("GBK"));

//            创建数据存储
            manager.getStoreManager().create(workSpace, gsShapefileDatastoreEncoder);

//            发布图层
            if (!restReader.existsLayer(workSpace, layerName)) {
                GSFeatureTypeEncoder gsFeatureTypeEncoder = new GSFeatureTypeEncoder();
                gsFeatureTypeEncoder.setTitle(layerName);
                gsFeatureTypeEncoder.setName(layerName);
                gsFeatureTypeEncoder.setSRS(GeoServerRESTPublisher.DEFAULT_CRS);

                GSLayerEncoder gsLayerEncoder = new GSLayerEncoder();
                if(styleName != null){
                    gsLayerEncoder.setDefaultStyle(workSpace, styleName);
                }

                boolean layer = publisher.publishDBLayer(workSpace, storeName, gsFeatureTypeEncoder, gsLayerEncoder);
                if (layer) {
                    System.out.println("图层: " + layerName + " 发布成功！");
                }

            } else {
                System.out.println("图层:" + layerName + " 已经存在了!");
            }
        } else {
            System.out.println("数据存储:" + storeName + " 已经存在了!");
        }
        return true;
    }

    /**
     * @param workSpace: 工作空间名称
     * @param storeName: 存储库名称
     * @param ascPath:  tiff文件路径
     * @return void
     * @description 将asc文件发布为GeoServer服务
     * @author zym
     * @date 2022/7/26 10:00
     */
    public static void PublishArcGrid(String workSpace, String storeName, String ascPath) throws MalformedURLException, FileNotFoundException {
        /**Geoserver 连接配置**/
        String url = "http://172.21.213.92:8089/geoserver";
        String username = "admin";
        String passWord = "geoserver";

        /**Geoserver 连接配置**/
//        判断workspace是否存在，不存在创建
        GeoServerRESTManager manager = new GeoServerRESTManager(new URL(url), username, passWord);
        GeoServerRESTPublisher publisher = manager.getPublisher();
        List<String> workSpaces = manager.getReader().getNamespaceNames();
        if (!workSpaces.contains(workSpace)) {
            boolean createws = publisher.createWorkspace(workSpace);
            System.out.println("create workspace: " + createws);
        } else {
            System.out.println("workspace已经存在了,workspace:" + workSpace);
        }
//        判断数据存储是否存在，不存在创建
        RESTDataStore restDataStore = manager.getReader().getDatastore(workSpace, storeName);
        if (restDataStore == null) {
            // TODO: 2022-7-26  找不到合适的ArcGridEncoder库
            GSGeoTIFFDatastoreEncoder gsGeoTIFFDatastoreEncoder = new GSGeoTIFFDatastoreEncoder(storeName);
            gsGeoTIFFDatastoreEncoder.setWorkspaceName(workSpace);
            gsGeoTIFFDatastoreEncoder.setUrl(new URL("file:" + ascPath));
            
//            创建数据存储
            boolean creatStore = manager.getStoreManager().create(workSpace, gsGeoTIFFDatastoreEncoder);
            System.out.println("create ArcGridStore : " + creatStore);
//            发布图层
            boolean publish = publisher.publishArcGrid(workSpace, storeName, new File(ascPath));
            System.out.println("publish ArcGrid : " + publish);
        } else {
            System.out.println("数据存储已经存在了,store:" + storeName);
        }
    }
    /**
     * @param workSpace: 工作区
     * @param storeType: 数据类型：[“Image”,“Shape”]
     * @param storeName: 数据存储名称
     * @return boolean
     * @description 删除指定工作空间下的数据存储
     * @author HYQ
     * @date 2021/12/2 16:13
     */
    public static boolean removeStore(String workSpace, String storeType, String storeName) {
        /**Geoserver 连接配置**/
        String url = "http://172.21.213.92:8089/geoserver";
        String username = "admin";
        String passWord = "geoserver";

//        判断workspace是否存在，不存在创建
        GeoServerRESTManager manager = null;
        try {
            manager = new GeoServerRESTManager(new URL(url), username, passWord);
        } catch (MalformedURLException e) {
            e.printStackTrace();
            System.out.println("Geoserver连接失败！");
            return false;
        }

        GeoServerRESTReader restReader = manager.getReader();
        List<String> workSpaces = restReader.getNamespaceNames();
        if (!workSpaces.contains(workSpace)) {
            System.out.println("workspace:" + workSpace + " 不存在!");
            return false;
        }

//        删除数据存储
        GeoServerRESTStoreManager storeManager = manager.getStoreManager();
        GSAbstractStoreEncoder gsAbstractStoreEncoder;
        try {
            boolean removeResult;
            switch (storeType) {
                case "Shape":
                    gsAbstractStoreEncoder = new GSAbstractStoreEncoder(GeoServerRESTPublisher.StoreType.DATASTORES, storeName) {
                        @Override
                        protected String getValidType() {
                            return null;
                        }
                    };
                    gsAbstractStoreEncoder.setName(storeName);
                    removeResult = storeManager.remove(workSpace, gsAbstractStoreEncoder, true);
                    break;
                case "Image":
                    gsAbstractStoreEncoder = new GSAbstractStoreEncoder(GeoServerRESTPublisher.StoreType.COVERAGESTORES, storeName) {
                        @Override
                        protected String getValidType() {
                            return null;
                        }
                    };
                    gsAbstractStoreEncoder.setName(storeName);
                    removeResult = storeManager.remove(workSpace, gsAbstractStoreEncoder, true);

                    break;

                default:
                    throw new IllegalStateException("Unexpected value: " + storeType);
            }
            if (removeResult){
                System.out.println("数据存储：" + workSpace + ":" + storeName + "删除成功！");
            }
            return removeResult;

        } catch (MalformedURLException e) {
            System.out.println("数据存储：" + workSpace + ":" + storeName + "删除失败！");
            e.printStackTrace();
        }

        return false;
    }



}
