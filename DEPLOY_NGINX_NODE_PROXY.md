# Production Fix: Node.js + PM2 + NGINX + HTTPS (Certbot) on Ubuntu

Use this exact sequence on the Ubuntu production server to fix all of the following:
- PM2 not installed
- Node app not running
- NGINX default page shown instead of app
- HTTPS on port `443` returning `ERR_CONNECTION_REFUSED`

Assumptions:
- Project root has `package.json`
- Entry point is `src/server.js`
- App should listen on port `3000` in production (`PORT=3000`)
- Domain is `attractor.store` and `www.attractor.store`

---

## 0) Preflight: validate app port and DNS before touching NGINX/SSL

```bash
cd /path/to/your/project

# Confirm app entry and current PORT default in code
ls -l package.json src/server.js src/config/env.js

# Optional: show runtime env (if managed through systemd/PM2 ecosystem/env file)
printenv | grep -E '^(PORT|NODE_ENV|APP_NAME)='
```

From this repository, `src/config/env.js` defaults to `4000` if `PORT` is not set. For this guide we enforce `PORT=3000` in production.

DNS must already point to this server before Certbot HTTP challenge:

```bash
dig +short attractor.store
dig +short www.attractor.store
curl -I http://attractor.store
curl -I http://www.attractor.store
```

Both domains should resolve to this server public IP.

---

## 1) Install PM2 globally

```bash
cd /path/to/your/project
npm install -g pm2
pm2 -v
```

If `pm2 -v` prints a version, PM2 is installed correctly.

---

## 2) Verify Node.js app file and run manually on port 3000

```bash
cd /path/to/your/project
ls -l package.json src/server.js
PORT=3000 node src/server.js
```

Keep that terminal open for a moment and in a second terminal run:

```bash
curl -i http://127.0.0.1:3000
ss -ltnp | grep ':3000'
```

Expected:
- `curl` returns your API/app response
- `ss` shows a process listening on `:3000`

Stop manual run with `Ctrl + C`.

---

## 3) Start app with PM2 (persisted)

```bash
cd /path/to/your/project
PORT=3000 pm2 start src/server.js --name db-api
pm2 save
pm2 startup
```

Important: after `pm2 startup`, PM2 prints one extra command (with `sudo ...`) for your system. Copy and run that exact command.

Verify:

```bash
pm2 list
pm2 status db-api
```

Expected status: `online`.

---

## 4) Install/verify NGINX + Certbot + plugin

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx

nginx -v
certbot --version
```

If UFW is enabled, open HTTP/HTTPS:

```bash
sudo ufw allow 'Nginx Full'
sudo ufw status
```

---

## 5) Configure NGINX reverse proxy for HTTP first (port 80)

If you already have a working `location /` proxy block, keep it and only ensure:
- `server_name` includes both `attractor.store` and `www.attractor.store`
- upstream remains `http://127.0.0.1:3000`
- this site file is the one enabled in `sites-enabled`

Create `/etc/nginx/sites-available/attractor.store`:

```bash
sudo tee /etc/nginx/sites-available/attractor.store > /dev/null <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name attractor.store www.attractor.store;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX
```

Disable default site and enable new site:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sfn /etc/nginx/sites-available/attractor.store /etc/nginx/sites-enabled/attractor.store
```

Validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl status nginx --no-pager -l
```

---

## 6) Generate and auto-configure SSL cert with Certbot (Nginx plugin)

Run Certbot with Nginx installer/redirect:

```bash
sudo certbot --nginx \
  -d attractor.store \
  -d www.attractor.store \
  --redirect \
  --agree-tos \
  -m admin@attractor.store \
  --no-eff-email
```

If the certificate already exists and only nginx wiring is missing, use:

```bash
sudo certbot install --cert-name attractor.store
```

What this does:
- Requests Let’s Encrypt certificate for both domains
- Adds `listen 443 ssl` blocks in NGINX
- Wires cert files from `/etc/letsencrypt/live/attractor.store/`
- Enables HTTP→HTTPS redirect automatically

---

## 7) Final expected NGINX config (after Certbot)

> Exact formatting may vary, but functionally you should have:

```nginx
server {
    server_name attractor.store www.attractor.store;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen [::]:443 ssl http2 ipv6only=on;
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/attractor.store/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/attractor.store/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Optional defense-in-depth headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options SAMEORIGIN always;
}

server {
    if ($host = www.attractor.store) {
        return 301 https://$host$request_uri;
    }

    if ($host = attractor.store) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    listen [::]:80;
    server_name attractor.store www.attractor.store;
    return 404;
}
```

Print real active config:

```bash
sudo nginx -T | sed -n '/server_name attractor.store/,/}/p'
```

To inspect exactly what certbot changed:

```bash
sudo grep -nE 'server_name|listen 443|ssl_certificate|ssl_certificate_key|proxy_pass' /etc/nginx/sites-available/attractor.store
```

---

## 8) Restart/reload, validate config, and verify 80/443 listeners

```bash
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager -l

# Ensure both ports are listening
sudo ss -ltnp | grep -E ':80|:443'
```

Expected: nginx master/workers listening on `0.0.0.0:80` and `0.0.0.0:443` (and possibly IPv6).

---

## 9) Functional validation (HTTP redirect + HTTPS upstream)

```bash
# HTTP must redirect to HTTPS
curl -I http://attractor.store
curl -I http://www.attractor.store

# HTTPS must answer
curl -I https://attractor.store
curl -I https://www.attractor.store

# End-to-end API test through nginx over TLS
curl -i https://attractor.store/
```

You should see:
- `301` from HTTP to HTTPS
- `200`/expected app response over HTTPS
- No more `ERR_CONNECTION_REFUSED` on 443

---

## 10) Renewal automation + logs

Certbot installs a systemd timer automatically. Verify:

```bash
systemctl list-timers | grep certbot
sudo certbot renew --dry-run
```

Useful logs:

```bash
sudo tail -n 200 /var/log/nginx/error.log
sudo tail -n 200 /var/log/nginx/access.log
sudo journalctl -u nginx -n 200 --no-pager
sudo tail -n 200 /var/log/letsencrypt/letsencrypt.log
pm2 logs db-api --lines 200
```

---

## Final expected state

- `pm2 list` shows `db-api` as `online`
- `curl http://localhost:3000` returns app response
- `curl -I http://attractor.store` returns `301` to HTTPS
- `curl -I https://attractor.store` returns app response
- NGINX listens on both `80` and `443`
- SSL certificate is valid for:
  - `attractor.store`
  - `www.attractor.store`
