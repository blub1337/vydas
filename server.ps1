$port = 8080
$root = "C:\Users\L33\.openclaw\workspace\vydas"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "vydas.net server running on http://localhost:$port"
Write-Host "Press Ctrl+C to stop."

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $path = $request.Url.AbsolutePath
    if ($path -eq "/") { $path = "/index.html" }

    $filePath = Join-Path $root $path.TrimStart("/")
    $filePath = $filePath -replace '/', '\'

    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        $mimeTypes = @{
            ".html" = "text/html"
            ".css"  = "text/css"
            ".js"   = "application/javascript"
            ".png"  = "image/png"
            ".jpg"  = "image/jpeg"
            ".jpeg" = "image/jpeg"
            ".gif"  = "image/gif"
            ".svg"  = "image/svg+xml"
            ".ico"  = "image/x-icon"
        }
        if ($mimeTypes.ContainsKey($ext)) { $response.ContentType = $mimeTypes[$ext] }
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 - Not Found</h1>")
        $response.ContentLength64 = $notFound.Length
        $response.OutputStream.Write($notFound, 0, $notFound.Length)
    }
    $response.Close()
}
$listener.Stop()
