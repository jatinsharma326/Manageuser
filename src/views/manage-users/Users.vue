<template>
  <div class="usersComponentWrapper">
    <v-row class="mt-10 px-6" justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <Search @queryString="queryString" :placeholder="dataProp.placeholder"></Search>
      </v-col>
    </v-row>

    <div class="card-wrapper">
      <div v-for="user in userList" :key="user._id" class="card-element">
        <InformationCard :expandCard="true">
          <template v-slot:topLeft>
            {{ user.usr_data.designation }}
          </template>
          <template v-slot:topRight>
            {{ getFormattedDate(user.usr_data.dob) }}
          </template>
          <template v-slot:mainContent>
            {{ user.usr_data.name }}
          </template>
          <template v-slot:mainContentSubtitle>
            {{ getMainContentSubtitle(user) }}
          </template>
          <!-- <template v-slot:mainContentRight>
            Grade/ Logo
          </template>
          <template v-slot:moreInfo>
            More Information Goes here. More Information Goes here.
          </template> -->
          <template v-slot:actionButtons>
            <!-- <v-btn icon color="primary lighten-2" text
              ><v-icon>mdi-information-outline</v-icon></v-btn
            > -->
            <v-btn color="orange lighten-2" text>
              <!-- <v-btn color="red lighten-2" text>
              Delete
            </v-btn> -->
              Disable
            </v-btn>
            <v-btn color="primary lighten-2" text>
              Edit
            </v-btn>
          </template>
          <template v-slot:expandCardContent>
            <v-list>
              <v-list-item
                v-for="(number, index) in user.usr_data.phone_number"
                :key="user._id + '+' + index"
              >
                <v-list-item-icon>
                  <v-icon v-if="index == 0" color="indigo">
                    mdi-phone
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-email
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    user.usr_data.email
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider inset></v-divider>

              <template v-if="user.type == SALES_AGENT">
                <v-list-item
                  v-for="(partner, index) in user.usr_data
                    .representing_partner_names"
                  :key="user._id + '+' + index + '+' + partner"
                >
                  <v-list-item-icon>
                    <v-icon v-if="index == 0" color="indigo">
                      mdi-account
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ partner }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider inset></v-divider>
              </template>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="indigo">
                    mdi-map-marker
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    user.usr_data.address
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
        </InformationCard>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import moment from "moment-timezone";
import InformationCard from "../../components/InformationCard.vue";
import Search from "../../components/Search.vue";
export default {
  name: "Users",
  components: {
    InformationCard,
    Search,
  },
  data: () => ({
    userList: [],
    search_text:"",
    pageSize: 20,
    pageNo: 1,
    totalCount: 0,
    fetchCount: 0,
  }),
  created() {
    this.getUsers();
  },
  computed: {
    ...mapGetters(["REMOTE_SALES_AGENT", "SALES_AGENT", "MANAGEMENT"]),
  },
  methods: {
    ...mapActions("UserManagement", ["getUserList"]),
    getUsers() {
      this.getUserList({
        filter: {
          type: this.dataProp.type,
        },
        search_text: this.search_text,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }).then((data) => {
        console.log(data);
        this.userList = data.userList;
        this.totalCount = data.totalCount;
        this.fetchCount = data.fetchCount;
      });
    },
    getFormattedDate(date) {
      return moment(date)
        .tz("Asia/Kolkata")
        .format("DD/MM/YYYY");
    },
    getMainContentSubtitle(user) {
      if (user.type == this.SALES_AGENT) {
        return user.usr_data.countries.join(", ");
      } else if (user.type == this.REMOTE_SALES_AGENT) {
        return user.usr_data.zone;
      }
      return "";
    },
    queryString(data) {
      console.log(data)
      this.search_text = data;
      this.getUsers()
    }  
  },
  props: {
    dataProp: {
      required: true,
      type: Object,
    },
  },
};
</script>

<style lang="scss" scopped>
.usersComponentWrapper {
  position: relative;
}
.card-wrapper {
  //   display: flex;
  //   justify-content: flex-start;
  //   flex-wrap: wrap;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  grid-gap: 16px;

  .card-element {
    // flex: 1 0 400px;
    // margin: 16px 10px;
  }
}
</style>
