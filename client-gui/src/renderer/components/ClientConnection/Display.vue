<template>
  <Card title="Display">
    <div v-if="data.data.hasDisplay">
      <img :src="imageData" />
    </div>
    <h2 v-else>No display on this server</h2>

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
      return this.$store.state.Connections.servers[this.iden];
    }
  },
  data() {
    return {
      imageData: null
    };
  },
  mounted() {
    window.RATtata.callbackEvents[this.iden] = {
      ...(window.RATtata.callbackEvents[this.iden] || {}),
      display: (imageBuffer) => {
        this.imageData = "data:image/png;base64," + imageBuffer.toString('base64')
      }
    };
  },

  props: ["iden"]
};
</script>
