from subprocess import run
import os
import sys
from osgeo import gdal
import numpy as np


if __name__ == '__main__':
    asc_path=sys.argv[1]
    output_path=sys.argv[2]
    cmd_str ="C:\\Users\\871029038\\AppData\\Local\\Programs\\Python\\Python39\\Lib\\site-packages\\osgeo\\gdal_translate.exe" + " " + asc_path + " " + output_path
    # print('\n执行cmd指令="{}"'.format(cmd_str))
    run(cmd_str, shell=True)