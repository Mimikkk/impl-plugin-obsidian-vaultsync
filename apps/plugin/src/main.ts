import { App, Plugin, PluginManifest } from "obsidian";

export default class HelloWorldPlugin extends Plugin {
  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
  }

  override async onload() {
    // Add a ribbon icon
    this.addRibbonIcon("dice", "Hello World", () => {
      console.log("Hello World!");
    });

    // Add a command
    this.addCommand({
      id: "hello-world",
      name: "Print Hello World",
      callback: () => {
        console.log("Hello World!");
      },
    });
  }

  override async onunload() {
    console.log("Goodbye World!");
  }
}
