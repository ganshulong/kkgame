# -*- coding:utf-8 -*-
import codecs, os, shutil, base64, json

dst_tmp_name   = "" #保存文件的临时目录
copy_file_list = [] #需要copy过去的文件

def copyfiles():
    """
    将多层嵌套的目录直接copy过去
    """
    if len(copy_file_list) > 0 :
        for i in range(len(copy_file_list)):
            src_file = copy_file_list[i]
            src_file = src_file.replace('\\','/')
            tmp = src_file.split('/')[5:-1]
            dst_file = dst_tmp_name + "/" +  "/".join(tmp)
            dst_dir = os.path.abspath(dst_file)
            if not os.path.exists(dst_dir):
                os.makedirs(dst_dir)
                
            shutil.copy(src_file, dst_file)
            print src_file, dst_file

def savefiles(allfiles):
    """
    将每个子目录形成的字典按照key为文件名保存，内容为json
    json内容的key为之前的uuid或uuid_filename(嵌套的文件名), value为原json文件的base64encode后的内容
    """
    for k, v in allfiles.items():
        dirname = os.path.join(dst_tmp_name, k[0:2])
        if not os.path.exists(dirname):
            os.mkdir(dirname)

        outputfile = '%s/%s.json' % (dirname, k)
        output = open(outputfile, 'w')
        output.write(json.dumps(v))
        output.close()

def listsunDir(path):
    """
    获取目录嵌套下的所有文件
    """
    _files = []
    if os.path.isfile(rootDir):
        _files.append(rootDir)
    else:
        for filename in os.listsunDir(rootDir):
            path = os.path.join(rootDir, filename)
            if os.path.isdir(path):
                _files.extend(listsunDir(path))
            else:
                _files.append(path)
    return _files


def listDir(rootDir):
    """
    获取目录下所有的一级文件及多级文件(待copy)
    """
    print(rootDir)
    _files = []
    if os.path.isfile(rootDir):
        _files.append(rootDir)
    else:
        for filename in os.listdir(rootDir):
            path = os.path.join(rootDir, filename)
            if os.path.isdir(path):
                copy_file_list.extend(listsunDir(path))
            else:
                copy_file_list.append(path)
    return _files

def getfilename(filename):
    """
    根据约定，把filename转换为key
    """
    file = filename.split("/")[6:]
    tmp  = "".join(file).replace('/','_')
    return tmp.split('.')[0]

def getfilecontents(path):
    """
    遍历获取路径filepath下的文件名和内容，已嵌套的list方式返回,list中元素为(filename, filecontent)
    """
    filedict = []
    files    = listDir(path)
    for i in range(0, len(files)):
        with codecs.open(files[i], "r", encoding='utf-8') as f:
            key = getfilename(files[i])
            filedict.append((key, f.read()))
            f.close()
    return filedict

def dojob(path):
    """
    开始处理单个子目录下的所有文件及文件夹
    """
    allfiles = {}
    filelist = os.listdir(path)
    for tmpfile in filelist:
        content  = getfilecontents(os.path.join('%s/%s' % (path, tmpfile)))
        for i in range(len(content)):
            filetuple = content[i]
            itemkey   = filetuple[0][0:3]
            if not allfiles.has_key(itemkey):
                itemval = {}
            else:
                itemval = allfiles.get(itemkey)

            filekey = filetuple[0]
            filecontent = base64.b64encode(filetuple[1].encode('utf-8'))
            itemval[filekey]  = filecontent
            allfiles[itemkey] = itemval
    savefiles(allfiles)

if __name__ == "__main__":
    dir_path = './build/jsb-link/res/'
    dst_tmp_name = dir_path + 'importmerge'
    if not os.path.exists(dst_tmp_name):
        os.mkdir(dst_tmp_name)

    sourcepath = dir_path + "import" #待处理的源文件目录
    if not os.path.exists(sourcepath):
        print "The path %s not exists" % sourcepath
    else:
        sundirs = os.listdir(sourcepath)
        for dirname in sundirs:
            childpath = os.path.join('%s/%s' % (sourcepath, dirname))
            dojob(childpath)
        copyfiles()
        print " clean job"
        shutil.rmtree(sourcepath)
        shutil.move(dst_tmp_name, sourcepath)
        print "Success !!!"
    

