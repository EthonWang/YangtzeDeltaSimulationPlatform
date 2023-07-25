import sys
from osgeo import gdal

def func(inputShp,raster,output):
    result = gdal.Warp(output, raster, cutlineDSName=inputShp)
    result.FlushCache()
    del result

if __name__ == '__main__':
    func(sys.argv[1],sys.argv[2],sys.argv[3])