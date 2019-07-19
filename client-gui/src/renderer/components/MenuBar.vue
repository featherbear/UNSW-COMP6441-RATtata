<template>
  <div class="MenuBar">
    <b-menu>
      <b-menu-list label="Menu">
        <b-menu-item icon="information-outline" label="About" to="about" @click="evtHandler"></b-menu-item>
        <b-menu-item icon="lan-connect" label="Connect" to="connect" @click="evtHandler"></b-menu-item>

        <!-- <b-menu-item icon="settings" >
        <template slot="label" slot-scope="props">
          Administrator
          <b-icon class="is-pulled-right" :icon="props.expanded ? 'menu-down' : 'menu-up'"></b-icon>
        </template>
        <b-menu-item icon="account" label="Users"></b-menu-item>
        <b-menu-item icon="cellphone-link" label="Devices"></b-menu-item>
        <b-menu-item icon="cash-multiple" label="Payments" disabled></b-menu-item>
        </b-menu-item>-->

        <b-menu-item icon="account" label="My Account">
          <b-menu-item label="Account data"></b-menu-item>
          <b-menu-item label="Addresses"></b-menu-item>
        </b-menu-item>
      </b-menu-list>
      <b-menu-list>
        <b-menu-item label="Expo" icon="link" tag="router-link" to="/expo"></b-menu-item>
      </b-menu-list>
      <b-menu-list label="Actions">
        <b-menu-item label="Logout"></b-menu-item>
      </b-menu-list>
    </b-menu>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["currentTab"],
  watch: {
    currentTab(tabName, oldVal) {
      console.log("MenuBar::currentTab");

      let newElement = this.$el.querySelector(`[name=${tabName}]`);

      if (!newElement) {
        console.error(`No tab "${tabName}" found`);
        return;
      }

      let currentElement = this.$el.querySelector("is-active");

      if (currentElement == newElement) return;

      currentElement && currentElement.classList.remove("is-active");
      newElement.classList.add("is-active");
      console.log(`Switched to ${tabName}`);
    }
  },
  methods: {
    evtHandler(evt) {
      this.$emit(
        "tabChange",
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
}
</style>