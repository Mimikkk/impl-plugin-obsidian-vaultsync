import { Self } from "@plugin/Self.ts";
import { render } from "solid-js/web";
import { StatusBar } from "./components/StatusBar.tsx";

export const createStatusBar = () => render(StatusBar, Self.status);
