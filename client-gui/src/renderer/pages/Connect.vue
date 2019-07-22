<template>
  <div class="container">
    <div class="connectForm">
      <b-field grouped>
        <b-input placeholder="Server address" icon="earth" v-model.trim="address" @keyup.native.enter="connect" expanded></b-input>
        <p class="control">
          <button class="button is-primary" @click="connect">Connect</button>
        </p>
      </b-field>
    </div>
    <b-divider label="PAST CONNECTIONS"></b-divider>
    <b-table :data="data" :columns="columns" hoverable></b-table>
  </div>
</template>

<script>
import Divider from "../components/b-divider";

export default {
  components: {
    "b-divider": Divider
  },
  methods: {
    connect() {
      let address = this.address;

      let { spawnClient } = require("../components/_RATtataClient");

      let [host, port] = this.address.split(":");

      // TODO: validate address

      port = parseInt(port || 41233);
      this.$snackbar.open({
        message: `Connecting to ${escape(address)}...`,
        type: "is-primary"
      });

      let client;
      try {
        client = spawnClient(host, port);
      } catch (e) {
        this.$dialog.alert({
          title: "Error",
          message: e
        });
        return;
      }

      client.on("badAuth", remainingTries => {
        if (!remainingTries) {
          this.$dialog.alert({
            title: "Server disconnected",
            message: "You were kicked for too many authentication failures"
          });
          return;
        }

        this.$dialog.prompt({
          inputAttrs: {
            type: "password",
            placeholder: "Enter server password"
          },
          message: `Remaining attempts: ${remainingTries}`,
          confirmText: "Connect",
          hasIcon: true,
          title: `Incorrect password`,
          icon: "lock",
          iconPack: "mdi",

          onConfirm: password => {
            client.login(password);
          }
        });
      });

      client.on("connect", () => {
        console.log("Connected!");

        console.log("DISPATCH");
        try {
          this.$store.dispatch("addServer", {
            serverID: client.__serverID,
            address
          });
        } catch (e) {
          console.log(e);
        }
        console.log("DOMNE");

        console.log("D2");
        this.$store.dispatch("changePage", `conn-${client.__serverID}`);
        console.log("DONE");
        //stackoverflow 42133894
      });

      client.on("poll", pollData => {
        console.log("Update poll data", pollData);
        this.$store.dispatch("updateData", {
          serverID: client.__serverID,
          ...pollData
        });
      });

      client.on("serverID", id => {
        client.__serverID = id;

        console.log(client.__serverID);

        window.RATtata.connections[id] = {
          client
        };

        // now ask for auth
        this.$dialog.prompt({
          inputAttrs: {
            type: "password",
            placeholder: "Enter server password"
          },
          confirmText: "Connect",
          hasIcon: true,
          title: `Connecting to ${escape(address)}...`,
          icon: "lock",
          iconPack: "mdi",
          onConfirm: password => {
            client.login(password);
          }
        });
      });
    }
  },
  data() {
    return {
      address: "",
      data: [
        {
          address: "blackbox.proxy-local:44132",
          last_connected: "2019-07-21 19:43:27"
        },
        {
          address: "sandbox:44132",
          last_connected: "2019-07-20 02:12:10"
        },
        {
          address: "127.0.0.1:44133",
          last_connected: "2019-07-20 02:12:08"
        },
        {
          address: "deathstar:44132",
          last_connected: "2019-07-19 12:16:01"
        }
      ],
      columns: [
        {
          field: "address",
          label: "Host"
        },
        {
          field: "last_connected",
          label: "Last Connected",
          centered: true
        }
      ]
    };
  }
};
</script>


<style scoped>
.connectForm {
  margin-top: 30px;
}
</style>