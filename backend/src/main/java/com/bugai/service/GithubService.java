package com.bugai.service;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.bugai.dto.GithubIssueResponse;

@Service
@RequiredArgsConstructor
public class GithubService {

    @Value("${github.token}")
    private String githubToken;

    private final WebClient client = WebClient.builder().build();

    public GithubIssueResponse fetchIssue(String owner, String repo, int number) {

        String url = "https://api.github.com/repos/" + owner + "/" + repo + "/issues/" + number;

        String result = client.get()
                .uri(url)
                .header("Accept", "application/vnd.github+json")
                .header("Authorization", "Bearer " + githubToken)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        JSONObject obj = new JSONObject(result);

        GithubIssueResponse res = new GithubIssueResponse();
        res.setTitle(obj.optString("title"));
        res.setBody(obj.optString("body"));
        res.setUrl(obj.optString("html_url"));

        return res;
    }
}
