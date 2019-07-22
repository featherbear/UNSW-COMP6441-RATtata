<template>
  <div>
    <Navbar :iden="iden"></Navbar>
    <General :iden="iden"></General>
    <Keylog :iden="iden"></Keylog>
    <Display :iden="iden"></Display>
  </div>
</template>

<script>
import Navbar from "../components/ClientConnection/Navbar";
import General from "../components/ClientConnection/General";
import Keylog from "../components/ClientConnection/Keylog";
import Display from "../components/ClientConnection/Display";

export default {
  components: {
    Navbar,
    General,
    Keylog,
    Display
  },
  props: ["iden"]
};
</script>
