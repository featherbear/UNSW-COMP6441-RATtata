<template>
  <div class="TabContainer">
    <section name="about" >
      <!-- <div class="wrapper"> -->
      <About></About>
      <!-- </div> -->
    </section>
    <section name="connect">
      <!-- <div class="wrapper"> -->
      <Connect></Connect>
      <!-- </div> -->
    </section>
    <section name="settings"></section>
  </div>
</template>


<style scoped>
.TabContainer {
  position: relative;
  height: 100vh;
}

section {
  background-color: white;

  z-index: 0;

  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
}

section.active {
  z-index: 100;
}

.wrapper {
  background-color: white;
  height: 100%;
}
</style>



<script>
import About from "../pages/About";

import Connect from "../pages/Connect";
// import Settings from "../pages/Settings";

export default {
  components: {
    About,
    Connect
    // Settings
  },
  props: ["currentTab"],
  watch: {
    currentTab: function(newVal, oldVal) {
      console.log("TabContainer::currentTab");

      this.show(newVal, oldVal);
    }
  },
  methods: {
    show(tabName, oldTabName) {
      let newElement = this.$el.querySelector(`[name=${tabName}]`);

      if (!newElement) {
        console.error(`No tab "${tabName}" found`);
        return;
      }

      let currentElement = this.$el.querySelector(".active");

      if (currentElement == newElement) return;

      currentElement && currentElement.classList.remove("active");
      newElement.classList.add("active");
      console.log(`Switched to ${tabName}`);
    }
  }
};
</script>