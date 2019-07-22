<template>
  <Card title="General">
    <nav class="level">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">Connected Address</p>
          <p class="title">{{clientConnected ? data.address : "-"}}</p>
        </div>
      </div>
      <div v-if="getLanIPs" class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">LAN IP</p>
          <p class="title" style="white-space: pre">{{getLanIPs.join("\n")}}</p>
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
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">Uptime</p>
          <p class="title">{{getUptime}}</p>
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
    clientConnected() {
      return window.RATtata.connections[this.iden];
    },
    data() {
      return this.$store.state.Connections.servers[this.iden];
    },
    getLanIPs() {
      if (!this.clientConnected) return ["-"];
      return (this.data.data.lanIPs || ["-"]).filter(
        address => address !== this.data.address.split(":")[0]
      );
    },
    getMemoryString() {
      if (!this.clientConnected) return "-";
      if (!this.data.data.memorySuffix) return "-";
      return `${this.data.data.memoryUsed} / ${this.data.data.memoryTotal} ${this.data.data.memorySuffix}`;
    },
    getCPU() {
      if (!this.clientConnected) return "-";
      if (!this.data.data.cpu_load) return "-";
      return this.data.data.cpu_load + "%";
    },
    getUptime() {
      if (!this.clientConnected) return "-";
      if (!this.data.data.uptime) return "-";

      let uptime = this.data.data.uptime;
      const data = [];

      // Seconds
      data.push(uptime % 60);

      // Minutes
      uptime /= 60;
      data.push(parseInt(uptime) % 60);

      // Hours
      uptime /= 60;
      data.push(parseInt(uptime) % 24);

      // Days
      uptime /= 24;
      data.push(parseInt(uptime % (365.25 / 12)));

      // Months
      uptime /= 365.25 / 12;
      data.push(parseInt(uptime) % 12);

      // Years
      uptime /= 12;
      data.push(parseInt(uptime));

      const order = ["yrs", "mo", "d", "h", "m", "s"];
      const output = [];
      let dataReverse = data.reverse();
      let forceValue = false;
      for (let i = 0; i < data.length; i++) {
        let e = dataReverse[i];
        if (e && !forceValue) forceValue = true;
        if (forceValue || e) output.push(e + order[i]);
      }

      return output.join(" ");
    }
  },
  props: ["iden"]
};
</script>