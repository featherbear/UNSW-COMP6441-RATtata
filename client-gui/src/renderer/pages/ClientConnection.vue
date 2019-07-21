<template>
  <div>
    <Navbar :iden="iden"></Navbar>
    <General :iden="iden"></General>
    <Keylog :iden="iden"></Keylog>
  </div>
</template>
<script>
import Navbar from "../components/ClientConnection/Navbar";
import General from "../components/ClientConnection/General";
import Keylog from "../components/ClientConnection/Keylog";

export default {
  components: {
    Navbar,
    General,
    Keylog
  },
  props: ["iden"]
};
</script>
<style scoped>
</style>