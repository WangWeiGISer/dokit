package com.perye.dokit.service;

import java.util.HashMap;

/**
 * @author wangwei
 * @company 滁州学院
 * @create 2020-04-11 12:11
 */
public interface FileService {
    HashMap<String, Object> getArchiveFilesName(String folderPath, String queryStr);
}
