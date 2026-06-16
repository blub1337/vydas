using System;
using System.IO;
using System.Net;
using System.Text;

class VydasServer {
    static void Main() {
        int port = 8080;
        string root = @"C:\Users\L33\.openclaw\workspace\vydas";
        
        HttpListener listener = new HttpListener();
        listener.Prefixes.Add("http://localhost:" + port + "/");
        listener.Start();
        
        Console.WriteLine("vydas.net running on http://localhost:" + port);
        Console.WriteLine("Press Ctrl+C to stop.");
        
        while (listener.IsListening) {
            try {
                HttpListenerContext ctx = listener.GetContext();
                string path = ctx.Request.Url.AbsolutePath;
                if (path == "/") path = "/index.html";
                
                string filePath = root + path.Replace('/', '\\');
                
                if (File.Exists(filePath)) {
                    byte[] content = File.ReadAllBytes(filePath);
                    string ext = Path.GetExtension(filePath).ToLower();
                    string mime = "application/octet-stream";
                    switch (ext) {
                        case ".html": mime = "text/html"; break;
                        case ".css": mime = "text/css"; break;
                        case ".js": mime = "application/javascript"; break;
                        case ".png": mime = "image/png"; break;
                        case ".jpg": case ".jpeg": mime = "image/jpeg"; break;
                        case ".gif": mime = "image/gif"; break;
                        case ".svg": mime = "image/svg+xml"; break;
                        case ".ico": mime = "image/x-icon"; break;
                    }
                    ctx.Response.ContentType = mime;
                    ctx.Response.ContentLength64 = content.Length;
                    ctx.Response.OutputStream.Write(content, 0, content.Length);
                } else {
                    ctx.Response.StatusCode = 404;
                    byte[] notFound = Encoding.UTF8.GetBytes("<h1>404 - Not Found</h1>");
                    ctx.Response.ContentLength64 = notFound.Length;
                    ctx.Response.OutputStream.Write(notFound, 0, notFound.Length);
                }
                ctx.Response.OutputStream.Close();
            } catch { }
        }
        listener.Stop();
    }
}
