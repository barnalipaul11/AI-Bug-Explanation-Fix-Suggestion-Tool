package com.bugai.dto;
import lombok.Data;

@Data
public class BugResponse {
    private String title;
    private String severity;
    private String keywords;
    private String summary;
    private String explanation;
    private String fixes;
    private String links; 
}