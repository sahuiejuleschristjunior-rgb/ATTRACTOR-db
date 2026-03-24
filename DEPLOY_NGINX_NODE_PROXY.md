# Production Fix: Node.js + PM2 + NGINX on Ubuntu

Use this exact sequence on the Ubuntu production server to fix all of the following:
- PM2 not installed
- Node app not running
- NGINX default page shown instead of app

Assumptions:
- Project root has `package.json`
- Entry point is `src/server.js`
- App should listen on port `3000`
- Domain is `attractor.store` and `www.attractor.store`

---

## 1) Install PM2 globally

```bash
cd /path/to/your/project
npm install -g pm2
pm2 -v
```

If `pm2 -v` prints a version, PM2 is installed correctly.

---

## 2) Verify Node.js app file and run manually

```bash
cd /path/to/your/project
ls -l package.json src/server.js
node src/server.js
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

## 3) Start app with PM2

```bash
cd /path/to/your/project
pm2 start src/server.js --name db-api
pm2 save
pm2 startup
```

Important: after `pm2 startup`, PM2 prints one extra command (with `sudo ...`) for your system. Copy and run that exact command.

---

## 4) Verify PM2 process is online

```bash
pm2 list
pm2 status db-api
```

Expected status: `online`.

---

## 5) Configure NGINX reverse proxy for attractor.store

Create `/etc/nginx/sites-available/attractor.store`:

```bash
sudo tee /etc/nginx/sites-available/attractor.store > /dev/null <<'NGINX'
server {
    listen 80;
    server_name attractor.store www.attractor.store;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
NGINX
```

---

## 6) Disable default NGINX site

```bash
sudo rm -f /etc/nginx/sites-enabled/default
```

---

## 7) Enable new NGINX config

```bash
sudo ln -sfn /etc/nginx/sites-available/attractor.store /etc/nginx/sites-enabled/attractor.store
```

---

## 8) Validate and restart NGINX

```bash
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager -l
```

Expected from `nginx -t`: `syntax is ok` and `test is successful`.

---

## 9) Debug checklist (if anything fails)

### PM2 / Node checks

```bash
pm2 logs db-api --lines 200
pm2 describe db-api
curl -i http://localhost:3000
ss -ltnp | grep ':3000'
```

If app is down:

```bash
cd /path/to/your/project
pm2 restart db-api
# or if missing
pm2 start src/server.js --name db-api
pm2 save
```

### NGINX checks

```bash
sudo nginx -t
sudo nginx -T | sed -n '1,260p'
sudo tail -n 200 /var/log/nginx/error.log
sudo tail -n 200 /var/log/nginx/access.log
```

### Confirm domain routing

```bash
curl -i -H 'Host: attractor.store' http://127.0.0.1/
curl -i http://attractor.store
curl -i http://www.attractor.store
```

If domain still shows default page:
- Verify `/etc/nginx/sites-enabled/default` is removed
- Verify `/etc/nginx/sites-enabled/attractor.store` symlink exists
- Verify DNS `A` records for `attractor.store` and `www.attractor.store` point to this server

DNS check:

```bash
dig +short attractor.store
dig +short www.attractor.store
```

---

## Final expected state

- `pm2 list` shows `db-api` as `online`
- `curl http://localhost:3000` returns app response
- `curl http://attractor.store` returns app response
- NGINX default page is gone
