<template>
  <Section title="General">
    <nav class="level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">WAN IP</p>
          <p class="title">{{data.connection.wanIPs.join(", ")}}</p>
        </div>
      </div>
      <div v-if="data.connection.lanIPs" class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">LAN IP</p>
          <p class="title">{{data.connection.lanIPs.join(", ")}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">Memory</p>
          <p class="title">{{data.system.memoryCurrent}} / {{data.system.memoryMax}}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading is-unselectable">CPU</p>
          <p class="title">{{data.system.CPU}}%</p>
        </div>
      </div>
    </nav>
  </Section>
</template>


<script>
import Section from "./_Section";

export default {
  components: {
    Section
  },
  props: ["data"]
};
</script>