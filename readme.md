# Obsidian plugin - VaultSync

VaultSync enables file synchronization between Obsidian vaults.

## Features

- **One-Click Sync**: Synchronize your Obsidian vault with a single press.
- **Mobile**: Works with mobile.

## Getting Started

### Prerequisites

- **[Deno](https://deno.land/)** v1.40+ (JavaScript/TypeScript runtime)
- **[Docker](https://www.docker.com/)** v20+ (for containerization)
- **[Git](https://git-scm.com/)** (for development hot-reload functionality)
- **Obsidian** v1.8.10+

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd impl-plugin-obsidian-vaultsync
   ```

2. **Setup environment variables:**

   Copy the template files and configure them:
   
   **External Services** (`apps/external/.env`):
   ```bash
   cp apps/external/.env.local apps/external/.env
   ```
   ```toml
   SYNCTHING_DIRECTORY=vault-sync
   STORAGE_URL=/path/to/your/storage
   ```

   **Server** (`apps/server/.env`):
   ```bash
   cp apps/server/.env.local apps/server/.env
   ```
   ```toml
   SYNCTHING_SERVICE_URL=http://localhost:8384
   SYNCTHING_SERVICE_API_KEY=your-api-key-here
   STORAGE_URL=/path/to/your/storage
   ```

   **Plugin** (`apps/plugin/.env`):
   ```bash
   cp apps/plugin/.env.local apps/plugin/.env
   ```
   ```toml
   VAULT_SYNC_CLIENT_URL=http://localhost:3000
   VAULT_PATH=/path/to/your/obsidian/vault
   ```

3. **Platform-specific path examples:**

   **Windows:**
   ```toml
   VAULT_PATH=C:\Users\YourName\Documents\MyVault
   STORAGE_URL=C:\obsidian-storage
   ```

   **macOS/Linux:**
   ```toml
   VAULT_PATH=/Users/yourname/Documents/MyVault
   STORAGE_URL=/home/yourname/obsidian-storage
   ```

4. **Start the services:**

   **Step 1:** Start external services first
   ```bash
   deno task dev:external
   ```

   **Step 2:** Get Syncthing API key
   - Open Syncthing UI: http://localhost:8384
   - Go to Actions → Settings → GUI
   - Copy the "API Key" value
   - Update `SYNCTHING_SERVICE_API_KEY` in `apps/server/.env`

   **Step 3:** Start remaining services
   ```bash
   deno task dev
   ```

   Or host them somewhere - the Docker setup is ready to serve.

5. **Enable the plugin in Obsidian:**
   - Open Obsidian → Settings → Community Plugins
   - Find "Vault Sync" and enable it

### Verify Installation

Check that all services are running:

- [ ] Syncthing Web UI: http://localhost:8384
- [ ] FileBrowser: http://localhost:8385
- [ ] Server health check: http://localhost:3000/health
- [ ] Plugin appears in Obsidian settings

### Test Your Setup

1. Create a test file in your Obsidian vault
2. Click the "Synchronize" button in the Obsidian ribbon
3. Check FileBrowser (http://localhost:8385) to see the file
4. Modify the file in FileBrowser
5. Sync again to see changes appear in Obsidian

## Usage

1. Make changes to your vault on any device.
2. Click the "Synchronize" button in the Obsidian ribbon.
3. Wait for the synchronization to complete.
4. Your changes are now persisted and can be synchronized on other devices.

## Mobile Setup

1. Install Obsidian mobile app
2. Install Syncthing mobile app
3. Configure Syncthing mobile to sync with your server
4. Point Obsidian mobile to the synced folder location

## Troubleshooting

### Common Issues

- **"deno: command not found"** → Install Deno from https://deno.land/
- **"Docker not running"** → Start Docker Desktop
- **"Plugin not appearing"** → Check `VAULT_PATH` points to correct Obsidian vault root
- **"Sync not working"** → Verify API key in `server/.env` matches Syncthing UI
- **Connection issues** → Ensure devices are connected and check firewall settings

### General Troubleshooting

- Ensure devices are connected to the same network.
- Ensure the server is up and running.
- Check firewall settings to see whether connections are being blocked.
- Verify all environment variables are correctly set.

## Architecture

- **Plugin**: Used by multiple Obsidian clients for sync operations
- **Server**: Hosts file orchestration and API endpoints  
- **External services**: [FileBrowser](https://filebrowser.org/) and [Syncthing](https://syncthing.net/) for remote filesystem navigation and event sourcing
- **Containerization**: [Docker](https://www.docker.com/) for easy deployment

### Why VaultSync?

I wanted to use Obsidian on my phone and PC but dislike the idea of any 'cloud service' dependency.

**Why not Git?** Git works, but isn't designed for large files like photos, videos, etc. that often appear in knowledge bases.

**Why not existing sync services?** Full control over your data, no monthly fees, works offline, and you own the entire sync infrastructure.
