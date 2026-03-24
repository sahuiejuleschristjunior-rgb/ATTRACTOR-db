# NGINX Reverse Proxy Fix for Node.js SaaS App

Use these commands in order on the production server to stop the default **"Welcome to nginx"** page and route traffic to the Node.js app on `127.0.0.1:3000`.

## 1) Verify Node.js app is running and listening on 3000

```bash
# Check pm2 processes (if using PM2)
pm2 list

# If your app is not online, start it (example)
# pm2 start src/server.js --name db-attractor

# Confirm a node/pm2 process is running
ps aux | egrep 'node|pm2' | grep -v grep

# Confirm backend is bound to 127.0.0.1:3000
ss -ltnp | grep ':3000'

# Validate backend response directly
curl -i http://127.0.0.1:3000
```

Expected result:
- PM2 status is `online` (or a Node process exists).
- `ss` shows a listener on `127.0.0.1:3000` (or `0.0.0.0:3000`).
- `curl` returns your app response (not connection refused).

## 2) Create NGINX site configuration

Create `/etc/nginx/sites-available/db-attractor` with this exact content:

```nginx
server {
    listen 80;
    server_name attractor.store www.attractor.store;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Commands:

```bash
sudo tee /etc/nginx/sites-available/db-attractor > /dev/null <<'NGINX'
server {
    listen 80;
    server_name attractor.store www.attractor.store;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX
```

## 3) Enable the site

```bash
sudo ln -sfn /etc/nginx/sites-available/db-attractor /etc/nginx/sites-enabled/db-attractor
```

## 4) Disable default site

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

## 5) Test NGINX configuration

```bash
sudo nginx -t
```

Expected output should include `syntax is ok` and `test is successful`.

## 6) Restart NGINX

```bash
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager -l
```

## 7) Validate end-to-end

```bash
# Local host header simulation
curl -i -H 'Host: attractor.store' http://127.0.0.1/

# Public test (from your machine or server)
curl -i http://attractor.store
curl -i http://www.attractor.store
```

You should no longer see the default NGINX welcome page.

---

## Troubleshooting (if it fails)

### A) NGINX test fails

```bash
sudo nginx -t
```

- Fix the reported file/line.
- Re-run `sudo nginx -t` until clean, then restart.

### B) 502 Bad Gateway

Usually backend is down or wrong port.

```bash
curl -i http://127.0.0.1:3000
ss -ltnp | grep ':3000'
pm2 logs --lines 200
```

If app is not running:

```bash
pm2 start src/server.js --name db-attractor
pm2 save
```

### C) Still seeing welcome page

Likely default server block still active or wrong server_name handling.

```bash
ls -l /etc/nginx/sites-enabled/
sudo nginx -T | sed -n '1,240p'
```

Check that:
- `sites-enabled/default` is removed.
- `db-attractor` is symlinked and loaded.
- request `Host` matches `attractor.store` or `www.attractor.store`.

### D) DNS/domain mismatch

```bash
dig +short attractor.store
dig +short www.attractor.store
```

Both records should point to your server IP.

### E) Firewall/security group blocking 80

```bash
sudo ufw status
# or cloud firewall/security group check in provider console
```

Allow inbound TCP 80 (and 443 if TLS is configured).

### F) Inspect NGINX logs

```bash
sudo tail -n 200 /var/log/nginx/error.log
sudo tail -n 200 /var/log/nginx/access.log
```

Use timestamps and status codes to correlate failed requests.
