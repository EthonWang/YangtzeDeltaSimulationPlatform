# 输入geojson面数据、栅格tif数据进行裁剪，输出裁剪后的tif数据
import json
from osgeo import ogr
from osgeo import gdal
from osgeo import osr
import sys

args = sys.argv[1:]
inputJson = args[0]
inputRaster = args[1]
outputRaster = args[2]

def create_polygon(coords):
    ring = ogr.Geometry(ogr.wkbLinearRing)
    for coord in coords:
        for xy in coord:
            ring.AddPoint(xy[0], xy[1])

            poly = ogr.Geometry(ogr.wkbPolygon)
            poly.AddGeometry(ring)
    return poly.ExportToWkt()


def create_shp_with_geoJson(json, shpFile):
    gdal.SetConfigOption("GDAL_FILENAME_IS_UTF8", "YES")
    gdal.SetConfigOption("SHAPE_ENCODING", "GBK")
    driver = ogr.GetDriverByName("ESRI Shapefile")
    polygon_data_source = driver.CreateDataSource(shpFile)
    polygon_layer = polygon_data_source.CreateLayer("Vector", geom_type=ogr.wkbPolygon)
    field_testfield = ogr.FieldDefn("polygon", ogr.OFTString)
    field_testfield.SetWidth(254)
    polygon_layer.CreateField(field_testfield)

    '''
    polygon_data_source = driver.CreateDataSource(shpFile)
    point_layer = polygon_data_source.CreateLayer("Point", geom_type=ogr.wkbPoint)
    field_testfield = ogr.FieldDefn("point", ogr.OFTString)
    field_testfield.SetWidth(254)
    point_layer.CreateField(field_testfield)
    polygon_data_source = driver.CreateDataSource(shpFile)
    polyline_layer = polygon_data_source.CreateLayer("Line", geom_type=ogr.wkbLineString)
    field_testfield = ogr.FieldDefn("polyline", ogr.OFTString)
    field_testfield.SetWidth(254)
    polyline_layer.CreateField(field_testfield)
    '''

    if(json['type'] == 'FeatureCollection'):
        for i in json['features']:
            geo = i.get("geometry")
            geo_type = geo.get('type')

            if geo_type == 'Polygon':
                # Polygon

                polygonCOOR = geo.get('coordinates')
                poly = create_polygon(polygonCOOR)
                if poly:
                    feature = ogr.Feature(polygon_layer.GetLayerDefn())
                    feature.SetField('polygon', 'polygon')
                    area = ogr.CreateGeometryFromWkt(poly)
                    feature.SetGeometry(area)
                    polygon_layer.CreateFeature(feature)
                    feature = None
            elif geo_type == "MultiPolygon":
                # 简单操作
                feature = ogr.Feature(polygon_layer.GetLayerDefn())
                feature.SetField('polygon', "polygon")

                gjson = ogr.CreateGeometryFromJson(str(geo))
                if gjson:
                    feature.SetGeometry(gjson)
                    polygon_layer.CreateFeature(feature)
                    feature = None
            '''
            elif geo_type == "Point":
                # Point
                feature = ogr.Feature(point_layer.GetLayerDefn())
                feature.SetField('point', "point")
                point_geo = ogr.CreateGeometryFromJson(str(geo))
                if point_geo:
                    feature.SetGeometry(point_geo)
                    point_layer.CreateFeature(feature)
                    feature = None
                pass
            elif geo_type == "LineString":
                # line
                feature = ogr.Feature(polyline_layer.GetLayerDefn())
                feature.SetField('polyline', "polyline")
                line_geo = ogr.CreateGeometryFromJson(str(geo))
                if line_geo:
                    feature.SetGeometry(line_geo)
                    polyline_layer.CreateFeature(feature)
                    feature = None
                pass
            else:
                print('Could not discern geometry')
            '''
    elif(json['type'] == 'GeometryCollection'):
        for i in json['geometries']:
            geo = i
            geo_type = geo.get('type')

            if geo_type == 'Polygon':
                # Polygon

                polygonCOOR = geo.get('coordinates')
                poly = create_polygon(polygonCOOR)
                if poly:
                    feature = ogr.Feature(polygon_layer.GetLayerDefn())
                    feature.SetField('polygon', 'polygon')
                    area = ogr.CreateGeometryFromWkt(poly)
                    feature.SetGeometry(area)
                    polygon_layer.CreateFeature(feature)
                    feature = None
            elif geo_type == "MultiPolygon":
                # 简单操作
                feature = ogr.Feature(polygon_layer.GetLayerDefn())
                feature.SetField('polygon', "polygon")

                gjson = ogr.CreateGeometryFromJson(str(geo))
                if gjson:
                    feature.SetGeometry(gjson)
                    polygon_layer.CreateFeature(feature)
                    feature = None
            '''
            elif geo_type == "Point":
                # Point
                feature = ogr.Feature(point_layer.GetLayerDefn())
                feature.SetField('point', "point")
                point_geo = ogr.CreateGeometryFromJson(str(geo))
                if point_geo:
                    feature.SetGeometry(point_geo)
                    point_layer.CreateFeature(feature)
                    feature = None
                pass
            elif geo_type == "LineString":
                # line
                feature = ogr.Feature(polyline_layer.GetLayerDefn())
                feature.SetField('polyline', "polyline")
                line_geo = ogr.CreateGeometryFromJson(str(geo))
                if line_geo:
                    feature.SetGeometry(line_geo)
                    polyline_layer.CreateFeature(feature)
                    feature = None
                pass
            else:
                print('Could not discern geometry')
            '''

#
# geojson to shp
fg = inputJson #'D:\zym\opengms\yangtzeRiver\geojson2shpTest\Ytest.json'
fs = fg.replace(".json",".shp") #'D:\zym\opengms\yangtzeRiver\geojson2shpTest\Yout2.shp'
with open(fg, 'r') as ff:
    temp = json.loads(ff.read())
    create_shp_with_geoJson(temp, fs)

# shp define projection
##gdal的GetProjection()返回的是wkt字符串，需要ImportFromWkt
proj = osr.SpatialReference()
proj.ImportFromEPSG(4326)
##或 proj.ImportFromProj4(proj4str)等其他的来源
wkt = proj.ExportToWkt()
##写出prj文件
f = open(fs.replace(".shp",".prj"), 'w')
f.write(wkt)
f.close()


# clip raster
shp = fs
raster = inputRaster #"D:\zym\opengms\yangtzeRiver\yangtzeRiver_landuse.tif"
output = outputRaster #"D:\zym\opengms\yangtzeRiver\geojson2shpTest\landuse_out.tif"
result = gdal.Warp(output, raster, cutlineDSName=shp)
result.FlushCache()
del result