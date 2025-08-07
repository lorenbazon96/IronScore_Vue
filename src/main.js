import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { createPinia } from "pinia";

const pinia = createPinia();
createApp(App).use(pinia).use(router).mount("#app");
