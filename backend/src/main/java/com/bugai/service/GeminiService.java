// package com.bugai.service;

// import com.bugai.dto.BugResponse;
// import lombok.RequiredArgsConstructor;
// import org.json.JSONObject;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;
// import org.springframework.web.reactive.function.client.WebClient;

// import java.util.List;
// import java.util.Map;

// @Service
// @RequiredArgsConstructor
// public class GeminiService {

//     @Value("${gemini.api.key}")
//     private String apiKey;

//     @Value("${gemini.model}")
//     private String model;

//     private final WebClient client;

//     public BugResponse analyzeBug(String text) {

//         // 1. ENGINEERED PROMPT
//         // We instruct the AI to use specific tags so we can parse the response easily.
//         String prompt = """
//                 You are a senior software architect and helpful coding assistant.
//                 Analyze the following bug report or error log.
                
//                 Format your response EXACTLY as follows, using the tags provided. Do not add preamble text before the first tag.
                
//                 [TITLE]
//                 (A short, concise, and punchy title for this bug)
                
//                 [SEVERITY]
//                 (Choose exactly one: Low, Medium, or Critical)
                
//                 [KEYWORDS]
//                 (Provide 3-5 technical keywords relevant to this bug for searching StackOverflow, separated by commas)
                
//                 [SUMMARY]
//                 (A 1-sentence executive summary of what went wrong)
                
//                 [EXPLANATION]
//                 (Explain the bug in clear, beginner-friendly language. Use analogies if helpful.)
                
//                 [FIXES]
//                 (Provide 1-2 specific technical fixes. Use code blocks where applicable.)
                
//                 [LINKS]
//                 (Provide 2-3 relevant official documentation URLs or helpful resource links in a Markdown bulleted list. Example: * [React Docs](https://react.dev))
                
//                 Bug Report:
//                 """ + text;

//         String url = "https://generativelanguage.googleapis.com/v1beta/models/"
//                      + model + ":generateContent?key=" + apiKey;

//         // 2. SAFE JSON CONSTRUCTION
//         // Use Map/List structure instead of manual string concatenation to handle quotes/newlines safely.
//         Map<String, Object> requestBody = Map.of(
//             "contents", List.of(
//                 Map.of(
//                     "parts", List.of(
//                         Map.of("text", prompt)
//                     )
//                 )
//             )
//         );

//         // 3. API CALL
//         String result = client.post()
//                 .uri(url)
//                 .bodyValue(requestBody)
//                 .retrieve()
//                 .bodyToMono(String.class)
//                 .block();

//         // 4. PARSE JSON RESPONSE
//         JSONObject obj = new JSONObject(result);
        
//         // Safety check for empty response
//         if (!obj.has("candidates")) {
//             BugResponse errorRes = new BugResponse();
//             errorRes.setExplanation("The AI service was unable to process this request.");
//             errorRes.setFixes("Please check your API key or try a different bug report.");
//             return errorRes;
//         }

//         String output = obj.getJSONArray("candidates")
//                 .getJSONObject(0)
//                 .getJSONObject("content")
//                 .getJSONArray("parts")
//                 .getJSONObject(0)
//                 .getString("text");

//         // 5. PARSE STRUCTURED TEXT
//         return parseResponse(output);
//     }

//     private BugResponse parseResponse(String text) {
//         BugResponse response = new BugResponse();

//         // Set Defaults in case parsing fails partially
//         response.setTitle("Bug Analysis");
//         response.setSeverity("Medium"); 
//         response.setKeywords("bug, error, fix");
//         response.setSummary("Analysis complete.");
//         response.setExplanation(text); // Fallback: put everything in explanation
//         response.setFixes("");
//         response.setLinks("");

//         try {
//             // Check if the AI followed instructions and used the tags
//             if (text.contains("[TITLE]")) {
//                 // Split by the specific tags we requested
//                 // The regex looks for any of these tags enclosed in brackets
//                 String[] parts = text.split("\\[(TITLE|SEVERITY|KEYWORDS|SUMMARY|EXPLANATION|FIXES|LINKS)\\]");

//                 // parts[0] is usually empty text before [TITLE]
//                 // parts[1] corresponds to TITLE content
//                 // parts[2] corresponds to SEVERITY content
//                 // ... and so on, assuming the AI follows the order.
                
//                 if (parts.length > 1) response.setTitle(parts[1].trim());
//                 if (parts.length > 2) response.setSeverity(parts[2].trim());
//                 if (parts.length > 3) response.setKeywords(parts[3].trim());
//                 if (parts.length > 4) response.setSummary(parts[4].trim());
//                 if (parts.length > 5) response.setExplanation(parts[5].trim());
//                 if (parts.length > 6) response.setFixes(parts[6].trim());
//                 if (parts.length > 7) response.setLinks(parts[7].trim());
//             }
//         } catch (Exception e) {
//             // If parsing fails excessively, we still return the object with whatever we managed to extract
//             // or the defaults set above.
//             System.err.println("Error parsing AI response: " + e.getMessage());
//         }

//         return response;
//     }
// }


package com.bugai.service;

import com.bugai.dto.BugResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final WebClient client;

    public BugResponse analyzeBug(String text) {

        // 1. ENGINEERED PROMPT
        // We explicitly tell the AI how to format the [FIXES] section so Markdown can detect code blocks.
        String prompt = """
                You are a senior software architect and helpful coding assistant.
                Analyze the following bug report or error log.
                
                Format your response EXACTLY as follows, using the tags provided. Do not add preamble text.
                
                [TITLE]
                (A short, concise, and punchy title for this bug)
                
                [SEVERITY]
                (Choose exactly one: Low, Medium, or Critical)
                
                [KEYWORDS]
                (Provide 3-5 technical keywords for searching StackOverflow, separated by commas)
                
                [SUMMARY]
                (A 1-sentence executive summary of what went wrong)
                
                [EXPLANATION]
                (Explain the bug in clear, beginner-friendly language. Use analogies if helpful.)
                
                [FIXES]
                (Provide 2 distinct solutions. Format each solution exactly like this:
                1. **Title of Fix**: 
                   - bullet point explanation of why this works
                   - another bullet point if needed
                   ```javascript
                   // Code goes here (replace 'javascript' with actual language)
                   ```
                )
                
                [LINKS]
                (Provide 2-3 relevant official documentation URLs in a Markdown bulleted list. Example: * [React Docs](https://react.dev))
                
                Bug Report:
                """ + text;

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                     + model + ":generateContent?key=" + apiKey;

        // 2. SAFE JSON CONSTRUCTION
        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", prompt)
                    )
                )
            )
        );

        // 3. API CALL
        String result = client.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // 4. PARSE JSON RESPONSE
        JSONObject obj = new JSONObject(result);
        
        if (!obj.has("candidates")) {
            BugResponse errorRes = new BugResponse();
            errorRes.setExplanation("The AI service was unable to process this request.");
            errorRes.setFixes("Please check your API key or try a different bug report.");
            return errorRes;
        }

        String output = obj.getJSONArray("candidates")
                .getJSONObject(0)
                .getJSONObject("content")
                .getJSONArray("parts")
                .getJSONObject(0)
                .getString("text");

        // 5. PARSE STRUCTURED TEXT
        return parseResponse(output);
    }

    private BugResponse parseResponse(String text) {
        BugResponse response = new BugResponse();

        // Defaults
        response.setTitle("Bug Analysis");
        response.setSeverity("Medium"); 
        response.setKeywords("bug, error, fix");
        response.setSummary("Analysis complete.");
        response.setExplanation(text); 
        response.setFixes("");
        response.setLinks("");

        try {
            if (text.contains("[TITLE]")) {
                // Split by tags
                String[] parts = text.split("\\[(TITLE|SEVERITY|KEYWORDS|SUMMARY|EXPLANATION|FIXES|LINKS)\\]");
                
                if (parts.length > 1) response.setTitle(parts[1].trim());
                if (parts.length > 2) response.setSeverity(parts[2].trim());
                if (parts.length > 3) response.setKeywords(parts[3].trim());
                if (parts.length > 4) response.setSummary(parts[4].trim());
                if (parts.length > 5) response.setExplanation(parts[5].trim());
                if (parts.length > 6) response.setFixes(parts[6].trim());
                if (parts.length > 7) response.setLinks(parts[7].trim());
            }
        } catch (Exception e) {
            System.err.println("Error parsing AI response: " + e.getMessage());
        }

        return response;
    }
}