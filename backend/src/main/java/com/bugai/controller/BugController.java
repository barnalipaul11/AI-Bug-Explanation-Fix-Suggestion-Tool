package com.bugai.controller;

import com.bugai.dto.BugRequest;
import com.bugai.dto.BugResponse;
import com.bugai.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bug")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BugController {

    private final GeminiService gemini;

    @PostMapping("/analyze")
    public BugResponse analyze(@RequestBody BugRequest req) {
        return gemini.analyzeBug(req.getBugText());
    }
}
