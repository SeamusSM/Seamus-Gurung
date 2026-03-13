import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Simple proxy endpoint
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    const tabId = req.query.tabId as string;
    
    if (!targetUrl) {
      return res.status(400).send("URL required");
    }

    try {
      let fetchUrl = targetUrl;
      if (!fetchUrl.startsWith('http')) {
        fetchUrl = 'https://' + fetchUrl;
      }

      const response = await fetch(fetchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        redirect: 'follow'
      });
      
      const contentType = response.headers.get("content-type");

      // Copy headers, but strip frame-busting ones
      response.headers.forEach((value, key) => {
        const lowerKey = key.toLowerCase();
        if (
          lowerKey !== 'x-frame-options' && 
          lowerKey !== 'content-security-policy' &&
          lowerKey !== 'content-encoding' &&
          lowerKey !== 'transfer-encoding'
        ) {
          res.setHeader(key, value);
        }
      });

      if (contentType && contentType.includes("text/html")) {
        let html = await response.text();
        const origin = new URL(fetchUrl).origin;
        const baseTag = `<base href="${origin}/">`;
        
        const interceptScript = `
          <script>
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.href) {
                e.preventDefault();
                window.parent.postMessage({ type: 'navigate', url: link.href, tabId: '${tabId}' }, '*');
              }
            });
            document.addEventListener('submit', function(e) {
              const form = e.target.closest('form');
              if (form && form.action) {
                e.preventDefault();
                const formData = new FormData(form);
                const params = new URLSearchParams(formData as any).toString();
                const url = form.action + (form.action.includes('?') ? '&' : '?') + params;
                window.parent.postMessage({ type: 'navigate', url: url, tabId: '${tabId}' }, '*');
              }
            });
          </script>
        `;

        if (html.includes('<head>')) {
          html = html.replace('<head>', `<head>${baseTag}${interceptScript}`);
        } else {
          html = baseTag + interceptScript + html;
        }

        res.status(response.status).send(html);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.status(response.status).send(buffer);
      }
    } catch (e: any) {
      res.status(500).send(`
        <div style="font-family: monospace; padding: 20px; background: #111; color: #ff3300; height: 100vh;">
          <h1>PROXY_ERROR</h1>
          <p>${e.message}</p>
          <p>Target: ${targetUrl}</p>
        </div>
      `);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
