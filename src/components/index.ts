import Single from "./Single.vue";
import Multiple from "./Multiple.vue";

const components = [
  { name: "Single", component: Single },
  { name: "Multiple", component: Multiple },
];

export default {
  install(app) {
    components.forEach(({ name, component }) => {
      app.component(name, component);
    });
  },
};
