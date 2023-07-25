import sys
import time

def func(outFilePath):

    with open(outFilePath, 'w+') as f:
        f.write(time.asctime( time.localtime(time.time())))
        f.write("测试成功")

if __name__ == '__main__':
    print("测试执行脚本")
    func(sys.argv[1])
