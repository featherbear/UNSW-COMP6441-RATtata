<template>
  <div>
    <Navbar :data="data"></Navbar>
    <General :data="data"></General>
    <Keylog :data="data"></Keylog>
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
  props: ["data"]
};
</script>
<style scoped>
</style>