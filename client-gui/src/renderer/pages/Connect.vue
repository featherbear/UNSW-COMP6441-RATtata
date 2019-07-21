<template>
  <div class="container">
    <div class="connectForm">
      <b-field grouped>
        <b-input placeholder="Server address" icon="earth" v-model.trim="address" expanded></b-input>
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

      this.$dialog.prompt({
        inputAttrs: {
          type: "password",
          placeholder: "Enter server password"
        },
        confirmText: "Connect",
        hasIcon: true,
        title: `Connecting to server...`,
        icon: "lock",
        iconPack: "mdi",
        onConfirm: password => {
          // TODO: Refactor

          let { spawnClient } = require("../components/_RATtataClient");

          let [host, port] = this.address.split(":");
          port = parseInt(port);

          let client = spawnClient(host, port, password);
          client.on("serverID", id => {
            client.__serverID = id;
            window.RATtata.connections[id] = {
              client
            };
          });

          client.on("connect", () => {
            console.log("Connected!");
            // TODO: Vuex

//stackoverflow 42133894
            // this.$store.state.Connections.connections = {
            //   ...this.$store.state.Connections.connections,
            //   [client.__serverID]: {
            //     id: client.__serverID,
            //     name: "...",
            //     address: this.address,
            //     data: {}
            //   }
            // };

            this.$store.state.Connections.connections[client.__serverID] = {
              id: client.__serverID,
              name: "...",
              address: this.address,
              data: {}
            };
          });

          client.on("poll", pollData => {
            Object.apply(
              this.$store.state.Connections.connections[client.__serverID],
              pollData
            );
          });

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
        }
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