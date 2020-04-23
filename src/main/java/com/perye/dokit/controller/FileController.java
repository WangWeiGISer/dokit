package com.perye.dokit.controller;

import com.perye.dokit.aop.log.Log;
import com.perye.dokit.service.FileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;

/**
 * @author wangwei
 * @company 滁州学院
 * @create 2020-04-11 12:05
 */
@Api(tags = "业务：文件管理")
@RestController
@RequestMapping("/api/file")
public class FileController {

    private final FileService fileService;
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }
    @Log("获取档案PDF文件流")
    @ApiOperation("获取PDF文件流信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "fileName", value = "文件名", required = true, dataType = "String"),
            @ApiImplicitParam(name = "path", value = "路径", required = true, dataType = "String"),
            @ApiImplicitParam(name = "tjxx", value = "图件信息", required = true, dataType = "String")
    })
    @RequestMapping(value = "clxx/pdfStreamHandler", method = RequestMethod.GET)
    public void pdfStreamHandler(String fileName, String path, String tjxx, String fkNf, HttpServletRequest request, HttpServletResponse response) {
        String filePath = "H:/01 档案系统/archive_jz/data/金寨数据/2016-2017年宅改档案扫描成果/" + fkNf + "年金寨宅改项目扫描成果/" + path;
        if (fileName.contains("勘测定界图.pdf") || fileName.contains("竣工图.pdf") || fileName.contains("规划图.pdf")) {
            HashMap<String, Object> filesName = fileService.getArchiveFilesName(filePath, tjxx);
            ArrayList pdfsName = (ArrayList) filesName.get("fileNameList");
            if (pdfsName != null) {
                String pdfName = (String) pdfsName.get(0);
                filePath = filePath + "/" + pdfName;
            } else {
                return;
            }
        } else {
            filePath = filePath + "/" + fileName;
        }
        File file = new File(filePath);
        if (file.exists()) {
            byte[] data = null;
            try {
                FileInputStream input = new FileInputStream(file);
                data = new byte[input.available()];
                input.read(data);
                response.getOutputStream().write(data);
                input.close();
            } catch (Exception e) {
                //logger.error("pdf文件处理异常：" + e.getMessage());
            }
        } else {
            return;
        }
    }
}
