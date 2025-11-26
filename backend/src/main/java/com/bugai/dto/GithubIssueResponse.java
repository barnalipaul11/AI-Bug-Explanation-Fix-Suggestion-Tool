package com.bugai.dto;

import lombok.Data;

@Data
public class GithubIssueResponse {
    private String title;
    private String body;
    private String url;
}
