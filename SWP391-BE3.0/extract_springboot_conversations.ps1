# Script to extract Spring Boot related conversations from chat sessions
$outputFile = "SPRING_BOOT_CONVERSATIONS.md"
$workspaceDir = "d:\filecrack\code\EvDrivers\workspaceStorage"

# Keywords to search for
$keywords = @(
    "@RestController", "@Service", "@Entity", "@Repository", "@Autowired",
    "Spring Boot", "SpringBoot", "JPA", "Hibernate", "MySQL", "backend",
    "controller", "service", "dao", "application.properties", "CorsConfig",
    "EvDriversApplication", "ResponseEntity", "@GetMapping", "@PostMapping",
    "@PutMapping", "@DeleteMapping", "CRUD", "API", "endpoint", "database"
)

# Initialize output
$output = @"
# Spring Boot Backend Development Conversations
## Extracted from Chat Session History
## Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

---

"@

Write-Host "Scanning chat sessions..." -ForegroundColor Green

$fileCount = 0
$conversationCount = 0

# Get all JSON files
$jsonFiles = Get-ChildItem -Path "$workspaceDir\*\chatSessions\*.json" -File

foreach ($file in $jsonFiles) {
    try {
        # Check file size (skip if > 50MB)
        $sizeMB = (Get-Item $file.FullName).Length / 1MB
        if ($sizeMB -gt 50) {
            Write-Host "Skipping large file: $($file.Name)" -ForegroundColor Yellow
            continue
        }

        # Read file content
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        
        if (-not $content) { continue }

        # Check if content matches any keywords
        $hasMatch = $false
        foreach ($keyword in $keywords) {
            if ($content -match [regex]::Escape($keyword)) {
                $hasMatch = $true
                break
            }
        }

        if (-not $hasMatch) { continue }

        $fileCount++
        Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan

        # Parse JSON
        try {
            $json = $content | ConvertFrom-Json
        } catch {
            Write-Host "  Failed to parse JSON" -ForegroundColor Red
            continue
        }

        # Extract conversations
        if ($json.requests) {
            foreach ($request in $json.requests) {
                $userMessage = ""
                $assistantMessage = ""

                # Get user message
                if ($request.message.text) {
                    $userMessage = $request.message.text
                } elseif ($request.message.parts) {
                    $userMessage = ($request.message.parts | Where-Object { $_.text } | Select-Object -First 1).text
                }

                # Get assistant response
                if ($request.response) {
                    $assistantMessage = ($request.response | Where-Object { $_.value } | 
                        ForEach-Object { $_.value }) -join "`n"
                }

                # Check if this conversation is Spring Boot related
                $isRelevant = $false
                $matchedKeywords = @()
                
                $combinedText = "$userMessage $assistantMessage"
                foreach ($keyword in $keywords) {
                    if ($combinedText -match [regex]::Escape($keyword)) {
                        $isRelevant = $true
                        $matchedKeywords += $keyword
                    }
                }

                if ($isRelevant -and $userMessage -and $assistantMessage) {
                    $conversationCount++
                    
                    # Extract date
                    $date = "Unknown"
                    if ($request.timestamp) {
                        $date = (Get-Date -Date "1970-01-01").AddMilliseconds($request.timestamp).ToString("yyyy-MM-dd HH:mm:ss")
                    }
                    
                    $output += @"

## Conversation $conversationCount
**Date:** $date  
**File:** $($file.Name)  
**Keywords:** $($matchedKeywords -join ", ")

### User Question:
``````
$($userMessage.Substring(0, [Math]::Min($userMessage.Length, 500)))$(if ($userMessage.Length -gt 500) { "..." })
``````

### Response:
``````
$($assistantMessage.Substring(0, [Math]::Min($assistantMessage.Length, 2000)))$(if ($assistantMessage.Length -gt 2000) { "..." })
``````

---

"@
                }
            }
        }

    } catch {
        Write-Host "Error processing $($file.Name): $_" -ForegroundColor Red
    }
}

# Save output
$output | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`nExtraction complete!" -ForegroundColor Green
Write-Host "Files scanned: $($jsonFiles.Count)" -ForegroundColor White
Write-Host "Files with Spring Boot content: $fileCount" -ForegroundColor White
Write-Host "Conversations extracted: $conversationCount" -ForegroundColor White
Write-Host "Output saved to: $outputFile" -ForegroundColor White
