# In Progress

# Obsidian plugin - VaultSync

VaultSync enables file synchronization between Obsidian vaults over a local connection.

## Features

- **One-Click Sync**: Synchronize your Obsidian vault with a button press

## Getting Started

### Prerequisites

- Docker installed (for file storage server)
- Multiple devices running Obsidian
  - VaultSync plugin installed on all devices
- Devices connected to the server

### Docker Setup

To set up the file storage server using Docker:

3. Start the services:
   ```bash
   docker-compose -f apps/external/docker-compose.yml up -d
   ```

4. Access the services:
   - Syncthing Web UI: http://localhost:8384
   - FileBrowser: http://localhost:8385

### Installation

1. Download the VaultSync plugin from the repository
2. Enable the plugin in Obsidian settings

## Usage

1. Make changes to your vault on any device
2. Click the "Sync" button in the Obsidian ribbon
3. Wait for the synchronization to complete
4. Your changes are now available on all connected devices

## Troubleshooting

- Ensure devices are connected
- Check firewall settings if connections are being blocked

###### Reason
I wanted to use Obsidian on my phone and my PC but I dislike the idea of private 'cloud' of any kind and shape. Why not use Git? - You could use it, but Git is not designed for large files like photos, videos, etc.
