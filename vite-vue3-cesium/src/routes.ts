import HelloWorld from "/@/components/HelloWorld.vue";

export const routes = [
  { path: "/", component: HelloWorld },
  { path: "/map", component: ()=> import("./components/map/Map.vue")},//异步加载组件
];
