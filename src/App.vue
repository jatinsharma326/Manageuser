<template>
  <v-app>
    <v-navigation-drawer
      v-model="navigationToggle"
      color="primary"
      hide-overlay
      fixed
      app
    >
      <div class="title-wrapper">Global Destinations</div>
      <v-list color="primary" id="navigation-list" flat>
        <template v-for="(navItem, index) of routeItems">
          <v-list-item
            :key="navItem.route + '' + index"
            id="basic-list-item"
            @click="openPortal(navItem)"
            :class="{
              'active-list-item': currentRoute == navItem.route ? true : false,
            }"
          >
            <v-list-item-content>
              <v-list-item-title>
                <span
                  class="list-title"
                  :class="{
                    'selected-route':
                      currentRoute == navItem.title ? true : false,
                  }"
                  >{{ navItem.title }}</span
                >
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="white" app fixed>
      <v-btn fab small icon tile x-large>
        <v-icon color="black" @click="toggleNav">mdi-menu</v-icon>
      </v-btn>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <span class="mr-2 body-1 font-weight-medium">
        Taher is god
      </span> -->
      <v-btn large icon @click="settings">
        <v-icon color="primary">mdi-cog</v-icon>
      </v-btn>
      <v-btn large icon @click="logoutUser">
        <v-icon color="primary">mdi-logout</v-icon>
      </v-btn>

      <!-- <v-menu transition="slide-x-transition" open-on-click bottom offset-y>
        <template v-slot:activator="{ on }">
          <v-icon color="secondaryFontColor" v-on="on"
            >keyboard_arrow_down</v-icon
          >
        </template>

        <v-list>
          <v-list-item @click="logoutUser">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar
      v-model="localSnackbarState"
      multi-line
      top
      right
      :timeout="snackbarTime"
    >
      {{ snackbarText }}
      <v-btn color="accent" text @click.stop="closeSnackbar">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>

    <v-overlay class="app-loader" :value="loaderDialog" :z-index="203">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import helpers from "./components/helpers";
export default {
  name: "App",

  components: {},
  data: () => ({
    navigationToggle: false,
    localSnackbarState: false,
    currentRoute: "",
    title: "TITLE",
    routeItems: [
      {
        icon: "data_usage",
        title: "Dashboard",
        route: "/",
        highlight: false,
      },
      {
        icon: "rule_folder",
        title: "Manage Users",
        route: "/manage-users",
        highlight: "#00a0ff",
        iconColor: "#00a0ff",
      },
      {
        icon: "file_copy",
        title: "Travel Agents",
        route: "/extracted-data",
        highlight: false,
      },
      {
        icon: "repeat",
        title: "Regions and Partners",
        route: "/regions-and-partners",
        highlight: "#00a0ff",
        iconColor: "#00a0ff",
      },
      {
        icon: "delete_forever",
        title: "Sales Call",
        route: "/sales-call",
        highlight: false,
      },
      {
        icon: "loop",
        title: "Daily Sales Report",
        route: "/dsr",
        highlight: "#00a0ff",
        iconColor: "#00a0ff",
      },
      {
        icon: "list_alt",
        title: "Monthly Sales Report",
        route: "/msr",
        highlight: false,
      },
      {
        icon: "search",
        title: "Follow Up",
        route: "/follow-up",
        highlight: "#00a0ff",
        iconColor: "#00a0ff",
      },
      {
        icon: "search",
        title: "Reports",
        route: "/reports",
        highlight: "#00a0ff",
        iconColor: "#00a0ff",
      },
      {
        icon: "search",
        title: "Manage Leaves",
        route: "/follow-up",
        highlight: "#00a0ff",
        iconColor: "#00a0ff",
      },
      {
        icon: "search",
        title: "Set Targets",
        route: "/follow-up",
        highlight: "#00a0ff",
        iconColor: "#00a0ff",
      },
    ],
  }),
  created() {
    this.currentRoute =
      this.routeItems.find((e) => e.route == "/" + helpers.getCurrentRoute())
        .title || "Dashboard";
    this.title = this.title.split("/")[0] + " / " + this.currentRoute;
    this.getCountries();
    this.getPartnerList();
    this.getZones();
    this.getBusinessTypes();
  },
  methods: {
    ...mapActions([
      "logout",
      "getCountries",
      "getPartnerList",
      "getZones",
      "getBusinessTypes",
    ]),
    ...mapMutations([
      "openLoaderDialog",
      "closeLoaderDialog",
      "resetState",
      "openSnackbar",
      "closeSnackbar",
    ]),
    toggleNav() {
      this.navigationToggle = !this.navigationToggle;
    },
    settings() {
      console.log("Clicked Settings Icon");
    },
    async logoutUser() {
      console.log("User Logged Out");
      await this.logout();
      if (this.currentRoute != "Dashboard") this.$router.push({ path: "/" });
      localStorage.clear();
      this.resetState();
      this.$emit("userHasLoggedOut");
    },
    openPortal(item) {
      if (item.title !== this.currentRoute) {
        this.title = this.title.split("/")[0] + "/" + item.title;
        this.currentRoute = item.title;
        if (item.hasOwnProperty("prop")) {
          this.$router.push({
            name: item.route,
            params: {
              propItem: item.prop,
            },
          });
        } else {
          this.$router.push({
            path: item.route,
          });
        }
      }
    },
  },
  computed: {
    ...mapGetters([
      "loaderDialog",
      "userData",
      "userType",
      "snackbarState",
      "snackbarText",
      "snackbarTime",
      "ADMIN",
      "MANAGEMENT",
      "SALES_AGENT",
      "REMOTE_SALES_AGENT",
    ]),
  },
  watch: {
    snackbarState(nv) {
      this.localSnackbarState = nv;
    },
    localSnackbarState(nv) {
      if (!nv) {
        this.closeSnackbar();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.title-wrapper {
  // transform: translateX(-50%);
  text-align: center;
  width: 100%;
  font-size: 20px;
  color: white;
  padding-top: 24px;
  padding-bottom: 54px;
}

#navigation-list {
  // background-color: $primary;
  .v-list-group__header {
    font-size: 16px;
    &:not(.v-list-item--active) {
      .list-group-title {
        color: white;
      }
    }

    &.v-list-item--active {
      background-color: $error;
    }
  }

  .list-title {
    color: white;
  }

  .selected-route {
    color: $accent;
  }

  #basic-list-item {
    .selected-route {
      color: $accent;
    }
  }

  .list-group-title-dot {
    height: 12px;
    width: 12px;
    background-color: $accent;
    border-radius: 50%;
    float: right;
  }
}
</style>

<style lang="scss">
#navigation-list {
  .v-list-group
    .v-list-group__header
    .v-list-item__icon.v-list-group__header__append-icon {
    margin-left: 0px;
  }

  .v-list-item__icon.v-list-group__header__append-icon {
    .v-icon.v-icon {
      color: white;
    }
  }

  .v-list-group__header {
    &.v-list-item--active {
      background-color: $secondary;
      border-left: 4px solid $accent;
    }
  }
}
#basic-list-item {
  .v-list-item.v-list-item--link.active-list-item {
    background-color: $secondary;
    border-left: 4px solid $accent;
  }
}
.app-loader {
  z-index: 10;
}
</style>
