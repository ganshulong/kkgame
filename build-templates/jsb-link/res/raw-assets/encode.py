# -*- coding:UTF-8 -*-
#该脚本用于加密png图片 使用python3以上版本解释执行
#C:\CocosCreator\resources\cocos2d-x\cocos\platform\CCImage.cpp
#C:\CocosCreator\resources\cocos2d-x\cocos\platform\CCImage.h
 
import os
import time
CUR_DIR = os.getcwd();
print("cur_dir:",CUR_DIR)
_KEY = 'kkgameskey' #指定加密秘钥,英文
_ENCRYSIG = 'kkgames'
_PNGSIG = bytes([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a])
_PNGIEND = bytes([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82])
 #获取filesig是否是png
def isPNGSig(bytes_8):
    return bytes_8 == _PNGSIG
 
def isPNG(absPath):#判断是否是PNG图片
    """
    :param absPath: 文件的绝对路径
    :return: {Bool}
    """
    isFile = os.path.isfile(absPath)
    hasPNGSig = False
    fileExt = os.path.splitext(absPath)[1]
    isPngExt = (fileExt == ".png" or fileExt == ".PNG")
    if isFile and isPngExt:
        with open(absPath,"rb") as file:
            hasPNGSig = isPNGSig(file.read(8)[:8])
    return isFile and isPngExt and hasPNGSig
 
def preProcessPng(pngData):#预处理图片数据
    """
    剪掉png的signature(8bytes),IEND(12Bytes)
    :param pngData:
    :return:
    """
    assert type(pngData) == bytes
    lostHeadData = pngData[8:]
    iendData = lostHeadData[-12:]
    if iendData == _PNGIEND:#防止Png已经进行过外部软件的压缩,丢掉了IEND
        return lostHeadData[:-12]
    else:
        return lostHeadData
 
def encryption(fileData,key):#加密操作 ascii占一个字节
    """
    加密png数据
    :param fileData:{bytes}预处理后的png数据
    :param key:{str}秘钥
    :return:{bytes}加密后的数据
    """
    assert type(key) is str
    k = bytes(key,"utf8")
    klen= len(k)
    kindex = 0
    fileData = bytearray(fileData)
    for i,v in enumerate(fileData):
        if kindex >= klen:
            kindex = 0
        fileData[i] = v ^ k[kindex]#加密
        kindex = kindex + 1
    return bytes(_ENCRYSIG,"utf8") + fileData
 
#处理图片
def processPNG(filePath):
    global filenum
    fileData = None
    with open(filePath,'rb') as file:
        fileData = encryption(preProcessPng(file.read()),_KEY)
    os.remove(filePath)
    with open(filePath,'wb') as file: #覆盖新文件
        file.write(fileData)
    filenum = filenum + 1
 
 
 
def traverseDir(absDir):#遍历当前目录以及递归的子目录，找到所有的png图片
    """
    :param absDir: 要遍历的路径
    :return: None
    """
    assert (os.path.isdir(absDir) and os.path.isabs(absDir))
    dirName = absDir
    for fileName in os.listdir(absDir):
        absFileName = os.path.join(dirName,fileName)
        print("isPNG:",absFileName)
        if os.path.isdir(absFileName):#递归查找文件夹
            print("absFileName:",absFileName)
            traverseDir(absFileName)
        elif isPNG(absFileName):
            print("isPNG:",absFileName)
            processPNG(absFileName)
        else:
            pass
 
 
 #------------------- 主函数-------------------------#
filenum = 0
traverseDir(CUR_DIR)
print("encrypt %d Png Pictures"%filenum)