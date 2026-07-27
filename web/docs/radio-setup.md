# Radio Setup — AzuraCast + Icecast + Liquidsoap

This document describes the VPS provisioning for the online radio station using Docker Compose.

## Architecture

```
Listener ──► Icecast (streaming server)
                 ▲
                 │
            Liquidsoap (AutoDJ)
                 ▲
                 │
            AzuraCast (Web UI + API)
```

## Docker Compose

Create a `docker-compose.yml` on your VPS:

```yaml
version: "3.8"

services:
  azuracast:
    image: azuracast/azuracast:latest
    container_name: azuracast
    restart: unless-stopped
    ports:
      - "80:80"        # Web UI
      - "443:443"      # HTTPS (with Let's Encrypt)
      - "8000:8000"    # Icecast (streaming)
    environment:
      - AZURACAST_HTTP_PORT=80
      - AZURACAST_HTTPS_PORT=443
      - AZURACAST_STREAM_PORT=8000
      - AZURACAST_ACME_EMAIL=admin@megahits506.com
      - AZURACAST_ACME_DOMAINS=radio.megahits506.com
      - AZURACAST_ACME_COUNTRY=CR
    volumes:
      - azuracast_data:/var/azuracast
      - azuracast_backups:/var/azuracast/backups
    networks:
      - radio-net

volumes:
  azuracast_data:
  azuracast_backups:

networks:
  radio-net:
    driver: bridge
```

## Configuration Steps

1. Deploy the compose file on a VPS (minimum 2 GB RAM, 2 vCPU).
2. Run `docker compose up -d` to start all services.
3. Access the AzuraCast web UI at `https://radio.megahits506.com`.
4. Complete the initial setup wizard (admin account, station details).
5. AzuraCast automatically configures Icecast and Liquidsoap.
6. Upload music via the AzuraCast UI or SFTP.

## Firewall Rules

| Port | Service    | Protocol | Source     |
|------|------------|----------|------------|
| 22   | SSH        | TCP      | Admin IP   |
| 80   | HTTP       | TCP      | Any        |
| 443  | HTTPS      | TCP      | Any        |
| 8000 | Icecast    | TCP      | Any        |

## Stream URL

After setup, the stream is available at:

```
https://radio.megahits506.com/listen/megahits/radio.mp3
```

Set `NEXT_PUBLIC_ICECAST_STREAM_URL` in the Next.js app to this URL.

## API Endpoint

AzuraCast exposes a public API at:

```
https://radio.megahits506.com/api/nowplaying
```

Set `AZURACAST_URL` in the Next.js `.env.local` to `https://radio.megahits506.com`.

## Health Checks

- Web UI: `https://radio.megahits506.com`
- Stream: `https://radio.megahits506.com/listen/megahits/radio.mp3`
- API: `https://radio.megahits506.com/api/nowplaying`
