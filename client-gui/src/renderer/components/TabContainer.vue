<template>
  <div class="TabContainer">
    <section name="about" class="active">
      <!-- <div class="wrapper"> -->
      <About></About>
      <!-- </div> -->
    </section>
    <section name="connect">
      <!-- <div class="wrapper"> -->
      <Connect></Connect>
      <!-- </div> -->
    </section>
    <section name="settings">
      <!-- data-simplebar -->
      <Settings></Settings>
    </section>

    <section v-for="conn in connections" :key="conn.id" :name="'conn-' + conn.id">
      <ClientConnection :iden="conn.id"></ClientConnection>
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
    connections: state => state.Connections.connections
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
    this.show(this.$store.state.Window.currentPage)
  },
  data() {
    return {
      connectionData: {
        connection: {
          lanIPs: ["192.168.1.1"],
          wanIPs: ["192.168.1.1"]
        },
        system: {
          memoryCurrent: 1207,
          memoryMax: 8096,
          CPU: 50
        }
      }
    };
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

.wrapper {
  background-color: white;
  height: 100%;
}
</style>

