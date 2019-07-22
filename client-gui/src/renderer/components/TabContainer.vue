<template>
  <div class="TabContainer">
    <!-- I'm dumb
    https://vuejs.org/v2/guide/components-dynamic-async.html
    -->
    <section name="about" class="active">
      <About></About>
    </section>
    <section name="connect">
      <Connect></Connect>
    </section>
    <section name="settings">
      <!-- data-simplebar -->
      <Settings></Settings>
    </section>

    <section v-for="id in connectionList" :key="id" :name="'conn-' + id">
      <ClientConnection :iden="id"></ClientConnection>
    </section>
  </div>
</template>


<script>
import { mapState } from "vuex";

import About from "../pages/About";
import Connect from "../pages/Connect";
import Settings from "../pages/Settings";
import ClientConnection from "../pages/ClientConnection";

export default {
  components: {
    About,
    Connect,
    Settings,
    ClientConnection
  },

  computed: mapState({
    currentPage: state => state.Window.currentPage,
    servers: state => state.Connections.servers,
    connectionList: state => state.Connections.connectionList
  }),
  watch: {
    currentPage: function(newVal, oldVal) {
      this.show(newVal);
    }
  },
  methods: {
    show(page) {
      let newElement = this.$el.querySelector(`[name=${page}]`);

      if (!newElement) {
        return;
      }

      let currentElement = this.$el.querySelector(".active");

      if (currentElement == newElement) return;

      currentElement && currentElement.classList.remove("active");
      newElement.classList.add("active");
    }
  },
  mounted() {
    this.show(this.$store.state.Window.currentPage);
  }
};
</script>



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

  overflow-y: auto;
}

section.active {
  z-index: 1;
}

section[name="connect"] {
  padding-left: 10px;
  padding-right: 10px;
}
</style>

