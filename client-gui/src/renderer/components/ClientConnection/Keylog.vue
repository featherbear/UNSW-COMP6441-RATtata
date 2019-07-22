<template>
  <Card title="Keyboard Log" class="wrapper">
    <span typed-js></span>
    <span class="cursor">&#9608;</span>
  </Card>
</template>


<script>
import Card from "./_Card";
import { Typer } from "../_typer";

export default {
  components: {
    Card
  },
  computed: {
    data() {
      return this.$store.state.Connections.servers[this.iden];
    }
  },

  props: ["iden"],
  data() {
    return {
      typer: null
    };
  },
  mounted() {
    let typedElement = this.$el.querySelector("[typed-js]");

    typedElement.innerText = (this.data.keylog || "").replace(
      /[^\x1F-\x7F\n]/g,
      ""
    );

    this.typer = new Typer(typedElement, { clear: false });
  }
};
</script>

<style scoped>
.wrapper span {
  cursor: text;
  font-family: monospace;
}

.cursor {
  animation: blinker 1s step-start infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>