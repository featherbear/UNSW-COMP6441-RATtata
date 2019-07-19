<template>
  <div id="app">
    <div class="columns is-mobile">
      <div class="column is-2">
        <MenuBar :currentTab="currentTab" @tabChange="changeTab"></MenuBar>
      </div>
      <div class="column">
        <TabContainer :currentTab="currentTab" @tabChange="changeTab"></TabContainer>
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from "./components/MenuBar";
import TabContainer from "./components/TabContainer";

export default {
  name: "client-gui",
  data() {
    return {
      currentTab: undefined
    };
  },
  methods: {
    changeTab(tabName) {
      console.log("App::changeTab");
      this.currentTab = tabName;
    }
  },
  components: {
    MenuBar,
    TabContainer
  }
};
</script>

<style>
html {
  overflow-y: hidden;
}
</style>
