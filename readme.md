# Obsidian plugin - VaultSync

VaultSync enables file synchronization between Obsidian vaults.

## Features

- **One-Click Sync**: Synchronize your Obsidian vault with a sigle press.
- **Mobile**: Works with mobile via synchronize.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) for containerization.

### Setup

1. Setup .env variables:
1. [External](/apps/external/.env.local) 
   copy .env.local as .env
   ```toml
   SYNCTHING_DIRECTORY= Whats your want syncthing folder 
   STORAGE_URL= Where you store all the remote files
   ```
2. [Server](/apps/server/.env.local)
   copy .env.local as .env
   ```toml
   SYNCTHING_SERVICE_URL= url of your syncthing container
   SYNCTHING_SERVICE_API_KEY= api of your syncthing app
   STORAGE_URL= Where you store all the remote files
   ```
3. [Plugin](/apps/plugin/.env.local)
   copy .env.local as .env
   ```toml
   VAULT_SYNC_CLIENT_URL= url of the server
   VAULT_PATH= Filesystem location to your vault ( install / hot reload ) 
   ```

2. Start the services:
   ```bash
   deno task dev
   ```
   Or host them somewhere, the docker is ready to serve.

3. Enable the plugin in Obsidian settings.

4. Access the services:
   - Syncthing Web UI: http://localhost:8384
   - FileBrowser: http://localhost:8385

## Usage

1. Make changes to your vault on any device.
2. Click the "Synchronize" button in the Obsidian ribbon.
3. Wait for the synchronization to complete.
4. Your changes are now persisted and can be synchronized on other device.

## Troubleshooting

- Ensure devices are connected.
- Ensure the server is up and running.
- Check firewall settings to see whether connections are being blocked.

### Architecture

- Plugin used by multiple Obsidian client.
- Server host for file orchestration.
- External services: [FileBrowser](https://filebrowser.org/) and [Syncthing](https://syncthing.net/) for the remote filesystem navigation and the event source.
- [Docker](https://www.docker.com/) for containerization.

###### Reason
I wanted to use Obsidian on my phone and my PC but I dislike the idea of a 'cloud service' of any kind and shape.
Why not use Git? - You could use it, but Git is not designed for large files like photos, videos, etc.
