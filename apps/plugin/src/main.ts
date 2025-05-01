import { App, Plugin, PluginManifest } from "obsidian";

export default class HelloWorldPlugin extends Plugin {
  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  override async onload() {
    console.log("Hello World!");

    // Add a ribbon icon
    this.addRibbonIcon("cloud", "Synchronize", () => {
      console.log("Synchronizing...");
    });

    // Add a command
    this.addCommand({
      id: "synchronize",
      name: "Synchronize",
      callback: () => {
        console.log("Synchronizing...");
      },
    });
  }

  override async onunload() {
    console.log("Goodbye World!");
  }
}
