import { createApp, type App } from "vue";
import AppView from "./App.vue";
import router from "./router";

import "./assets/main.scss";

const app: App<Element> = createApp(AppView);

app.use(router);

app.mount("#app");
