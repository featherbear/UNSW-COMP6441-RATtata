<template>
  <div class="MenuBar is-unselectable">
    <b-menu>
      <b-menu-list label="RATtata">
        <b-menu-item icon="information-outline" label="About" to="about" @click="evtHandler"></b-menu-item>
        <b-menu-item icon="lan-connect" label="Connect" to="connect" @click="evtHandler"></b-menu-item>
        <b-menu-item icon="settings" label="Settings" to="settings" @click="evtHandler"></b-menu-item>

        <!-- <b-menu-item icon="settings" >
        <template slot="label" slot-scope="props">
          Administrator
          <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'"></b-icon>
        </template>
        <b-menu-item icon="account" label="Users"></b-menu-item>
        <b-menu-item icon="cellphone-link" label="Devices"></b-menu-item>
        <b-menu-item icon="cash-multiple" label="Payments" disabled></b-menu-item>
        </b-menu-item>-->

        <!-- <b-menu-item icon="account" label="My Account">
          <b-menu-item label="Account data"></b-menu-item>
          <b-menu-item label="Addresses"></b-menu-item>
        </b-menu-item>-->
      </b-menu-list>

      <b-menu-list label="Connections" v-if="Object.keys(connections).length">
        <!-- <b-menu-item v-if="!Object.keys(connections).length" label="..." disabled></b-menu-item> -->
        <b-menu-item
          v-for="conn in connections"
          :key="conn.id"
          :icon="osToIcon(conn.os)"
          :label="conn.name"
          :to="'conn-' + conn.id"
          @click="evtHandler"
        ></b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {osToIcon} from "./_iconUtils";

export default {
  computed: mapState({
    currentPage: state => state.Window.currentPage,
    connections: state => state.Connections.connections
  }),
  watch: {
    currentPage(newVal, oldVal) {
      this.show(newVal);
    }
  },
  mounted() {
    // Not using {immediate: true} as `$el` does not mount everything in time
    this.show(this.$store.state.Window.currentPage);
  },
  methods: {
    osToIcon,
    show(tab) {
      let newElement = this.$el.querySelector(`[to=${tab}]`);
      if (!newElement) {
        return;
      }

      let currentElement = this.$el.querySelector(".is-active");

      if (currentElement == newElement) {
        return;
      }
      currentElement && currentElement.classList.remove("is-active");
      newElement.classList.add("is-active");
    },

    evtHandler(evt) {
      this.$store.dispatch(
        "changePage",
        evt.target.getAttribute("to") ||
          evt.target.parentNode.getAttribute("to")
      );
    }
  }
};
</script>

<style scoped>
.MenuBar {
  padding: 10px;
  -webkit-user-select: none;
  cursor: default;
}
</style>