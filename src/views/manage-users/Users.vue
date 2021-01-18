<template>
  <div class="usersComponentWrapper primary-background-color">
    <v-row class="px-6 manageusers-search-bar" justify="center" align="center">
      <v-col cols="12" sm="8" md="6">
        <Search
          @queryString="queryString"
          @filterObject="advanceSearch"
          @clearFilter="advanceSearch"
          :placeholder="placeholder"
          :isAdvanceSearch="true"
          :filterConfig="selectedSearchConfig"
        ></Search>
      </v-col>
    </v-row>

    <div v-if="showErrorMessage" class="content-error-message">
      {{ errorMessage }}
    </div>

    <div class="card-wrapper">
      <div v-for="user in userList" :key="user._id" class="card-element">
        <InformationCard
          :expandCard="true"
          :isCardDisabled="!user.record.active"
        >
          <template v-slot:topLeft>
            <!-- <v-chip outlined x-small color="primary"> -->
            {{ user.usr_data.designation }}
            <!-- </v-chip> -->
          </template>
          <template v-slot:topRight>
            {{ getFormattedDate(user.usr_data.dob, "DD/MM") }}
          </template>
          <template v-slot:mainContent>
            {{ user.usr_data.name }}
          </template>
          <template v-slot:mainContentSubtitle>
            {{ getMainContentSubtitle(user) }}
          </template>
          <template v-slot:actionButtons>
            <template v-if="isAdminOrManagement">
              <v-btn @click="userPasswordReset(user)" color="orange " text>
                Reset
              </v-btn>
              <v-btn @click="disableUser(user)" color="error" text>
                {{ user.record.active ? "Disable" : "Enable" }}
              </v-btn>
              <v-btn @click="openInputForm(true, user)" color="secondary" text>
                Edit
              </v-btn>
            </template>
            <template v-else>
              <div
                v-if="
                  user.usr_data.phone_numbers &&
                  user.usr_data.phone_numbers.length
                "
              >
                {{ user.usr_data.phone_numbers.join(", ") }}
              </div>
            </template>
          </template>
          <template v-slot:expandCardContent>
            <v-list>
              <v-list-item
                v-for="(number, index) in user.usr_data.phone_numbers"
                :key="user._id + '+' + index"
              >
                <v-list-item-icon>
                  <v-icon v-if="index == 0" color="secondary">
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
                  <v-icon color="secondary"> mdi-email </v-icon>
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
                    .representing_partner_ids"
                  :key="user._id + '+' + index + '+' + partner.value"
                >
                  <v-list-item-icon>
                    <v-icon v-if="index == 0" color="secondary">
                      mdi-account
                    </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ partner.text }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider inset></v-divider>
              </template>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="secondary"> mdi-map-marker </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{
                    user.usr_data.address
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <template v-if="isAdminOrManagement">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="secondary"> mdi-information-outline </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{
                      user.usr_data.no_of_leaves
                    }}</v-list-item-title>
                    <v-list-item-subtitle> No of leaves </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
              </template>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <div class="date-container">
                      <div class="doj">
                        DOJ: {{ getFormattedDate(user.usr_data.doj) }}
                      </div>
                      <div class="doe">
                        DOE:
                        {{
                          user.usr_data.doe
                            ? getFormattedDate(user.usr_data.doe)
                            : "--/--/----"
                        }}
                      </div>
                    </div>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
        </InformationCard>
      </div>
    </div>

    <div v-if="isPaginationRequired" class="paginationWrapper text-center">
      <v-pagination
        @input="updatedPageNo"
        v-model="pageNo"
        :length="Math.ceil(fetchCount / pageSize)"
        :total-visible="paginationTotalVisible"
        class="pagination-component"
      ></v-pagination>
      <div class="page-size-dropdown">
        <v-autocomplete
          v-model="pageSize"
          :items="pageSizeList"
          auto-select-first
          solo
          dense
        ></v-autocomplete>
      </div>
    </div>

    <UserForm
      @formOutput="formOutput"
      @closeForm="closeForm"
      :name="name"
      :type="type"
      :inputConfig="inputConfig"
      :toggleForm="toggleForm"
      :formData="rowToEdit"
      :isEditMode="isEditMode"
    ></UserForm>

    <div v-if="isAdminOrManagement" class="floating-button">
      <v-btn @click="openInputForm()" color="primary" dark fab>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
import helperMixin from "../../mixins/helperMixins";
import inputFormMixin from "../../mixins/inputFormMixin";
import searchMixin from "../../mixins/searchMixin";
import helpers from "../../components/helpers";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Users",
  mixins: [defaultCRUDMixin, helperMixin, inputFormMixin, searchMixin],
  data: () => ({
    activeState: true,
    userList: [],
  }),
  created() {
    this.getData();
    this.setSearchConfig();
  },
  computed: {
    ...mapGetters(["partners"]),
  },
  methods: {
    ...mapActions("UserManagement", [
      "getUserList",
      "addUser",
      "editUser",
      "resetPassword",
    ]),
    getData() {
      this.openLoaderDialog();
      this.filter.type = this.type;
      this.filter.active = this.activeState;
      this.getUserList({
        filter: this.filter,
        active: this.activeState,
        type: this.type,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }).then((data) => {
        this.closeLoaderDialog();
        this.userList = this.checkForErrorMessage(data, "user");
        this.totalCount = data.totalCount;
        this.fetchCount = data.fetchCount;
        // if (!data.ok) {
        // 	this.openSnackbar({ text: "Failed to Fetched User Data" });
        // }
        // this.userList = data.list;
      });
    },
    getMainContentSubtitle(user) {
      if (user.type == this.SALES_AGENT) {
        return user.usr_data.countries.join(", ");
      } else if (user.type == this.REMOTE_SALES_AGENT) {
        return user.usr_data.zone;
      }
      return "";
    },
    // queryString(data) {
    // 	this.search_text = data;
    // 	this.getData();
    // },
    advanceSearch(filterObject) {
      this.filter = { ...filterObject };
      if (this.filter.active) {
        this.activeState = false;
      } else {
        this.activeState = true;
      }
      this.getData();
    },
    formOutput(data) {
      var formData = JSON.parse(JSON.stringify(data));
      formData.type = this.type;
      formData.dob = helpers.getISODate(formData.dob);
      formData.doj = helpers.getISODate(formData.doj);
      if (formData.doe) {
        formData.doe = helpers.getISODate(formData.doe);
      }

      if (formData.countries) {
        formData.countries = formData.countries.filter(
          (e) => !!this.activeCountriesList.find((f) => f == e)
        );
      }
      formData.phone_numbers = data.phone_numbers.map((data) => data.input);
      if (formData.representing_partner_ids) {
        formData.representing_partner_ids = formData.representing_partner_ids.filter(
          (id) => {
            for (let partner of this.partners) {
              if (partner.value == id) {
                return true;
              }
            }
          }
        );
      }

      this.openLoaderDialog();
      if (!this.isEditMode) {
        this.addUser(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            this.openSnackbar({ text: "Added User Sucessfully" });

            this.getData();
            this.closeForm();
          } else {
            this.openSnackbar({ text: data.message });
          }
        });
      } else {
        this.editUser(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            this.openSnackbar({ text: "Edited User Sucessfuly" });

            this.getData();
            this.closeForm();
          } else {
            this.openSnackbar({ text: data.message });
          }
        });
      }
    },
    getEditRowObject(data) {
      return {
        ...data.usr_data,
        _id: data._id,
        updated_on: data.record.updated_on,
      };
    },

    disableUser(data) {
      if (
        window.confirm(
          "Do you really want to " +
            (data.record.active ? "Disable the User?" : "Enable the User?")
        )
      ) {
        this.openLoaderDialog();
        this.editUser({
          _id: data._id,
          active: !data.record.active,
          updated_on: data.record.updated_on,
          status: data.record.active ? "disabled" : "enabled",
        }).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            this.openSnackbar({ text: "Updated User Status" });

            this.getData();
            this.closeForm();
          } else {
            this.openSnackbar({ text: data.message });
          }
        });
      }
    },
    userPasswordReset(data) {
      if (window.confirm("Do you really want to Reset User Password")) {
        this.openLoaderDialog();
        this.resetPassword({ _id: data._id }).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            this.openSnackbar({ text: "Sucessfully Reset Password" });
            this.getData();
            this.closeForm();
          } else {
            this.openSnackbar({ text: data.message });
          }
        });
      }
    },
    setSearchConfig() {
      this.selectedSearchConfig = [
        {
          name: "Show Disabled Users",
          key: "active",
          inputType: "switch",
          defaultValue: false,
        },
      ];
    },
  },
  props: {
    name: { required: true, type: String },
    type: { required: true, type: String },
    placeholder: { required: true, type: String },
    inputConfig: { required: true, type: Array },
    activeCountriesList: { required: false, type: Array },
  },
};
</script>

<style lang="scss" scopped>
.usersComponentWrapper {
  height: 100%;
}
.date-container {
  display: flex;
  justify-content: space-between;
}
.manageusers-search-bar {
  padding-top: 12px;
}
</style>
