<template>
  <div id="app">
    <div class="columns is-mobile is-gapless">
      <!-- is-0 -->
      <div class="column is-narrow MenuBarContainer" style="border-right: 1px solid rgba(0,0,0,0.2);">
        <MenuBar :currentTab="currentTab" :connections="connections" @tabChange="changeTab"></MenuBar>
      </div>
      <div class="column">
        <TabContainer :currentTab="currentTab" :connections="connections" @tabChange="changeTab"></TabContainer>
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
      currentTab: undefined,
      connections: {
        "1": {
          name: "Paperweight",
          os: "mac"
        },
        "2": {
          name: "Blue Screen",
          os: "windows"
        },
        "3": {
          name: "rm -rf /",
          os: "linux"
        }
      }
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

.MenuBarContainer {
  max-width: 250px;
}
</style>
