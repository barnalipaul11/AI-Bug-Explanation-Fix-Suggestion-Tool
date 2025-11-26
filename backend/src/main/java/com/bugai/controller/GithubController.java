package com.bugai.controller;

import com.bugai.dto.GithubIssueResponse;
import com.bugai.service.GithubService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
@CrossOrigin("*")
public class GithubController {

    private final GithubService github;

    @GetMapping("/issue")
    public GithubIssueResponse getIssue(
            @RequestParam String owner,
            @RequestParam String repo,
            @RequestParam int number
    ) {
        return github.fetchIssue(owner, repo, number);
    }
}
