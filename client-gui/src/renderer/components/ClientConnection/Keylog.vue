<template>
  <Card title="Keyboard Log">clickity clackity type-dy doo</Card>
</template>


<script>
import Card from "./_Card";

export default {
  components: {
    Card
  },
  computed: {
    data() {
   return {};
   //   return this.$store.state.Connections.connections[this.iden];
    }
  },
  props: ["iden"]
};
</script>