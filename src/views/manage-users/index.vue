<template>
  <div class="">
    <v-tabs icons-and-text grow v-model="tab">
      <v-tab v-for="(ele, index) in tabConfig" :key="ele.id + '__' + index">{{
        ele.name
      }}</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(ele, index) in tabConfig"
        :key="ele.id + '__' + index"
      >
        <!-- <component :dataProp="ele.props" v-bind:is="ele.component" /> -->
        <Users :dataProp="ele.props"></Users>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Users from "./Users";
export default {
  name: "ManageUsers",
  components: { Users },
  data: () => ({
    tab: "",
    tabConfig: [
      {
        name: "Sales Team",
        id: "salesTeam",
        component: "Users",
        props: {
          type: "sales_agent",
          placeholder: "Search Sales Team"
        },
      },
      {
        name: "Remote Sales Team",
        id: "remoteSalesTeam",
        component: "Users",
        props: {
          type: "remote_sales_agent",
          placeholder: "Search Remote Sales Team"
        },
      },
      {
        name: "Management Team",
        id: "management",
        component: "Users",
        props: {
          type: "management",
          placeholder: "Search Management Team"
        },
      },
    ],
  }),
  computed: {
    ...mapGetters([]),
  },
  methods: {},
};
</script>
