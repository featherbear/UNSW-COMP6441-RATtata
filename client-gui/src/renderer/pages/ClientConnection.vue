<template>
  <div>
    <Navbar :data="data"></Navbar>
    <General :data="data"></General>
    <Keylog :data="data"></Keylog>
  </div>
</template>
<script>
import Navbar from "./ClientConnection/Navbar";
import General from "./ClientConnection/General";
import Keylog from "./ClientConnection/Keylog";

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