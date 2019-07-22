<template>
  <div id="app">
    <div class="columns is-mobile is-gapless">
      <!-- is-0 -->
      <div
        class="column is-narrow MenuBarContainer"
        style="border-right: 1px solid rgba(0,0,0,0.2);"
      >
        <MenuBar></MenuBar>
      </div>
      <div class="column">
        <TabContainer></TabContainer>
      </div>
    </div>
  </div>
</template>

<script>
import MenuBar from "./components/MenuBar";
import TabContainer from "./components/TabContainer";

window.RATtata = {
  connections: {
    
  },
  
  callbackEvents: {
    
  }
}

export default {
  name: "client-gui",
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

.dialog.modal .media {
  width: 100%;
}

</style>
