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
        <Users v-bind="{ ...ele.props }"></Users>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import {
  required,
  email,
  minLength,
  numeric,
  alpha,
} from "vuelidate/lib/validators";
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
          name: "Sales Team",
          type: "sales_agent",
          placeholder: "Search Sales Team",
          inputConfig: [
            {
              name: "Full Name",
              type: "String",
              key: "name",
              width: "half",
              validations: {
                required,
                minLength: minLength(1),
              },
            },
            {
              name: "Designation",
              type: "String",
              key: "designation",
              width: "half",
              validations: {
                required,
                minLength: minLength(1),
              },
            },
            {
              name: "Email",
              type: "String",
              key: "email",
              width: "full",
              validations: {
                required,
                email,
                minLength: minLength(4),
              },
            },
            {
              name: "Address",
              type: "String",
              key: "address",
              width: "full",
              validations: {
                required,
                minLength: minLength(10),
              },
            },
            {
              name: "Countries",
              type: "Dropdown",
              key: "countries",
              width: "half",
              multi: true,
              listVariable: "countries",
              validations: {
                required,
              },
            },
            {
              name: "Partners",
              type: "Dropdown",
              key: "representing_partner_ids",
              width: "half",
              multi: true,
              listVariable: "partners",
              validations: {
                required,
              },
            },
            {
              name: "Contact Numbers",
              type: "MultiInput",
              key: "phone_numbers",
              width: "half",
              validations: {
                required,
                minLength: minLength(1),
                $each: {
                  input: {
                    required,
                    minLength: minLength(8),
                  },
                },
              },
            },
            {
              name: "DOB",
              type: "Date",
              key: "dob",
              width: "oneThird",
              validations: {
                required,
              },
            },
            {
              name: "DOJ",
              type: "Date",
              key: "doj",
              width: "oneThird",
              validations: {
                required,
              },
            },
            {
              name: "DOE",
              type: "Date",
              key: "doe",
              width: "oneThird",
            },
          ],
        },
      },
      {
        name: "Remote Sales Team",
        id: "remoteSalesTeam",
        component: "Users",
        props: {
          name: "Remote Sales Team",
          type: "remote_sales_agent",
          placeholder: "Search Remote Sales Team",
          inputConfig: [
            {
              name: "Full Name",
              type: "String",
              key: "name",
              validations: {
                required,
                alpha,
                minLength: minLength(4),
              },
            },
            {
              name: "Designation",
              type: "String",
              key: "designation",
              validations: {
                required,
                minLength: minLength(1),
              },
            },
            {
              name: "Email",
              type: "String",
              key: "email",
              validations: {
                required,
                email,
                minLength: minLength(4),
              },
            },
            {
              name: "Address",
              type: "String",
              key: "address",
              validations: {
                required,
                minLength: minLength(10),
              },
            },
            {
              name: "Zone",
              key: "zone",
              multi: false,
              listVariable: "zone",
              type: "Dropdown",
              key: "zone",
              validations: {
                required,
              },
            },
            {
              name: "Contact Numbers",
              type: "MultiInput",
              key: "phone_numbers",
              validations: {
                required,
                minLength: minLength(1),
                $each: {
                  input: {
                    required,
                    minLength: minLength(8),
                  },
                },
              },
            },
            {
              name: "DOB",
              type: "Date",
              key: "dob",
              validations: {
                required,
              },
            },
            {
              name: "DOJ",
              type: "Date",
              key: "doj",
              validations: {
                required,
              },
            },
            {
              name: "DOE",
              type: "Date",
              key: "doe",
            },
          ],
        },
      },
      {
        name: "Management Team",
        id: "management",
        component: "Users",
        props: {
          name: "Management",
          type: "management",
          placeholder: "Search Management Team",
          inputConfig: [
            {
              name: "Full Name",
              type: "String",
              key: "name",
              validations: {
                required,
                alpha,
                minLength: minLength(4),
              },
            },
            {
              name: "Designation",
              type: "String",
              key: "designation",
              validations: {
                required,
                minLength: minLength(1),
              },
            },
            {
              name: "Email",
              type: "String",
              key: "email",
              validations: {
                required,
                email,
                minLength: minLength(4),
              },
            },
            {
              name: "Address",
              type: "String",
              key: "address",
              validations: {
                required,
                minLength: minLength(10),
              },
            },
            {
              name: "Contact Numbers",
              type: "MultiInput",
              key: "phone_numbers",
              validations: {
                required,
                minLength: minLength(1),
                $each: {
                  input: {
                    required,
                    minLength: minLength(8),
                  },
                },
              },
            },
            {
              name: "DOB",
              type: "Date",
              key: "dob",
              validations: {
                required,
              },
            },
            {
              name: "DOJ",
              type: "Date",
              key: "doj",
              validations: {
                required,
              },
            },
            {
              name: "DOE",
              type: "Date",
              key: "doe",
            },
          ],
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
