import os
import sys
from osgeo import gdal, osr, gdalnumeric
from osgeo.gdalconst import *
import numpy as np


if __name__ == '__main__':
    # 获取tif遥感影像的数据与投影信息
    tifPath = sys.argv[1]
    dataset1 = gdal.Open(tifPath, GA_Update) #200907221.tif
    # im_geotrans = dataset1.GetGeoTransform()
    # im_proj = dataset1.GetProjection()
    proj_template = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AXIS["Latitude",NORTH],AXIS["Longitude",EAST],AUTHORITY["EPSG","4326"]]'
    dataset1.SetProjection(proj_template)
    print("ok")