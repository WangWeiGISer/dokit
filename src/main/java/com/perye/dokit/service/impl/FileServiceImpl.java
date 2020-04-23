package com.perye.dokit.service.impl;

import com.perye.dokit.service.FileService;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @author wangwei
 * @company 滁州学院
 * @create 2020-04-11 12:13
 */
@Service
public class FileServiceImpl implements FileService {
    public  HashMap<String, Object> getArchiveFilesName(String folderPath, String queryStr) {
        HashMap<String, Object> map = new HashMap<>();
        List<String> fileNameList = new ArrayList<>();//文件名列表
        List<String> folderNameList = new ArrayList<>();//文件夹名列表
        File f = new File(folderPath);
        if (!f.exists()) { //路径不存在
            map.put("retType", "1");
        } else {
            boolean flag = f.isDirectory();
            if (flag == false) { //路径为文件
                map.put("retType", "2");
                map.put("fileName", f.getName());
            } else { //路径为文件夹
                map.put("retType", "3");
                File fa[] = f.listFiles();
                queryStr = queryStr == null ? "" : queryStr;//若queryStr传入为null,则替换为空（indexOf匹配值不能为null）
                for (int i = 0; i < fa.length; i++) {
                    File fs = fa[i];
                    if (fs.getName().indexOf(queryStr) != -1) {
                        if (fs.isDirectory()) {
                            folderNameList.add(fs.getName());
                        } else {
                            fileNameList.add(fs.getName());
                        }
                    }
                }
                map.put("fileNameList", fileNameList);
                map.put("folderNameList", folderNameList);
            }
        }
        return map;
    }
}
