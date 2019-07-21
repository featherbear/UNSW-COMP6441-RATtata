<template>
  <Card title="General">
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">WAN IP</p>
          <p class="title">{{data.address}}</p>
        </div>
      </div>
      <div v-if="getLanIPs" class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">LAN IP</p>
          <p class="title">{{getLanIPs.join(", ")}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">Memory</p>
          <p class="title">{{getMemoryString}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">CPU</p>
          <p class="title">{{getCPU}}</p>
        </div>
      </div>
    </nav>
  </Card>
</template>


<script>
import Card from "./_Card";

export default {
  components: {
    Card
  },
  computed: {
    data() {
      return this.$store.state.Connections.connections[this.iden];
    },
    getLanIPs() {
      return (this.data.data.lanIPs || ["-"]).filter(
        address => address !== this.data.address.split(":")[0]
      );
    },
    getMemoryString() {
      if (!this.data.data.memorySuffix) return "-";
      return `${this.data.data.memoryUsed} / ${this.data.data.memoryTotal} ${this.data.data.memorySuffix}`;
    },
    getCPU() {
      if (!this.data.data.cpu_load) return "-";
      return this.data.data.cpu_load + "%";
    }
  },
  props: ["iden"]
};
</script>