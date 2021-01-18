<template>
  <div class="reportListWrapper">
    <div class="SearchbarWrapper">
      <div class="searchbar">
        <Search
          @queryString="queryString"
          @filterObject="advanceSearch"
          @clearFilter="advanceSearch"
          :placeholder="placeholder"
          :isAdvanceSearch="true"
          :filterConfig="searchConfig"
        ></Search>
      </div>
      <div class="datepicker">
        <v-dialog
          ref="dialog"
          v-model="dateDialog"
          :return-value.sync="datePickerDate"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Date Range"
              readonly
              outlined
              @click="dataSelector"
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker range v-model="datePickerDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="resetDatePicker"> Reset </v-btn>
            <v-btn text color="primary" @click="cancelDatePicker">
              Cancel
            </v-btn>
            <v-btn text color="primary" @click="submitDatePicker"> OK </v-btn>
          </v-date-picker>
        </v-dialog>
      </div>
    </div>
    <div v-if="totalCount === 0" class="content-error-message">
      Please add an Entry
    </div>
    <div v-else class="leaves-table">
      <v-data-table
        :items-per-page="pageSize"
        hide-default-footer
        :headers="headers"
        :expanded.sync="expanded"
        show-expand
        item-key="_id"
        :items="dataList"
      >
        <template v-slot:[`item.conducted_on_date`]="{ item }">
          {{
            item.conducted_on_date
              ? getFormattedDate(item.conducted_on_date, "MMMM Do YYYY dddd")
              : "-"
          }}
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td
            class="expandable-section table-expanded-background"
            :colspan="headers.length"
          >
            <div class="expandable-section-title">Subject</div>
            <div class="expandable-section-content" v-html="item.subject">
              {{}}
            </div>
          </td>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <template v-if="isSalesTeamMember">
            <v-menu bottom left>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="openInputForm(true, item)"
                  >EDIT</v-list-item
                >
                <v-list-item @click="deleteEntry(item)">DELETE</v-list-item>
              </v-list>
            </v-menu>
          </template>
        </template>
      </v-data-table>
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
    <template v-if="isOnlySalesAgent">
      <UserForm
        @formOutput="formOutput"
        @closeForm="closeForm"
        :name="name"
        :inputConfig="inputConfig"
        :keysToWatch="keysToWatch"
        :toggleForm="toggleForm"
        :formData="rowToEdit"
        :isEditMode="isEditMode"
      ></UserForm>
      <!-- <div class="floating-button">
				<v-btn @click="openInputForm()" color="primary" dark fab>
					<v-icon>mdi-plus</v-icon>
				</v-btn>
			</div> -->
    </template>
    <div class="floating-button">
      <v-speed-dial
        v-model="fab"
        direction="top"
        :open-on-hover="true"
        transition="scale-transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="primary" dark fab>
            <v-icon v-if="fab"> mdi-arrow-down-drop-circle </v-icon>
            <v-icon v-else> mdi-arrow-up-drop-circle </v-icon>
          </v-btn>
        </template>
        <v-tooltip left>
          <template v-if="isOnlySalesAgent" v-slot:activator="{ on, attrs }">
            <v-btn
              @click="openInputForm()"
              color="secondary"
              dark
              small
              fab
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Add Virtual Reach Entry</span>
        </v-tooltip>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              small
              color="tertiary"
              @click="downloadReach()"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>Download Virtual Reach</span>
        </v-tooltip>
      </v-speed-dial>
    </div>
  </div>
</template>

<script>
import defaultCRUDMixin from "../../mixins/defaultCRUDMixins";
import helperMixin from "../../mixins/helperMixins";
import inputFormMixin from "../../mixins/inputFormMixin";
import searchMixin from "../../mixins/searchMixin";
import datePickerMixin from "../../mixins/datePickerMixin";
import commonAPICallsMixin from "../../mixins/commonAPICallsMixin";

import {
  required,
  email,
  minLength,
  numeric,
  alpha,
} from "vuelidate/lib/validators";
import helpers from "../../components/helpers";
import moment from "moment-timezone";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "VirtualReach",
  mixins: [
    defaultCRUDMixin,
    inputFormMixin,
    helperMixin,
    searchMixin,
    datePickerMixin,
    commonAPICallsMixin,
  ],
  async created() {
    this.setDateRange();
    this.getData();
    this.openLoaderDialog();
    if (this.isAdminOrManagement) {
      await this.getUsers();
    }
    await this.getCountries();
    this.closeLoaderDialog();
    this.setConfig(this.userList, this.countriesList);
  },
  data: () => ({
    name: "Virtual Reach Entry",
    placeholder: "Search Virtual Reach Entry",
    fab: false,
    searchConfig: [],
    inputConfig: [],
    citiesList: [],
    dataList: [],
    headers: [
      { text: "Sr. No.", align: "start", value: "serial_number", width: 100 },
      { text: "Created By", value: "name", width: 150 },
      { text: "Reach Out Type", value: "reach_out_type", width: 150 },
      { text: "Product", value: "country", width: 150 },
      { text: "Conducted On", value: "conducted_on_date", width: 200 },
      { text: "Reach", value: "reach", width: 200 },
      { text: "Agency Name", value: "company_name", width: 200 },
      { text: "Point Of Contact", value: "point_of_contact", width: 200 },
      { text: "", value: "actions" },
    ],
    expanded: [],
    keysToWatch: [],
  }),
  computed: {
    ...mapGetters(["userData"]),
    dateRangeText() {
      return this.datePickerDate.join(" ~ ");
    },
  },
  methods: {
    ...mapActions("VirtualReach", [
      "getVirtualReach",
      "addVirtualReach",
      "editVirtualReach",
      "deleteVirtualReach",
      "downloadVirtualReachFile",
    ]),
    setDateRange() {
      let tempArray = [];
      let startDate = moment()
        .tz("Asia/Kolkata")
        .startOf("month")
        .format("YYYY-MM-DD");
      let endDate = moment()
        .tz("Asia/Kolkata")
        .endOf("month")
        .format("YYYY-MM-DD");
      tempArray.push(startDate);
      tempArray.push(endDate);
      this.datePickerDate = tempArray;
    },
    getData() {
      this.openLoaderDialog();
      this.filter.date_from = moment(this.datePickerDate[0])
        .tz("Asia/Kolkata")
        .startOf()
        .toISOString();
      if (this.datePickerDate[1]) {
        this.filter.date_to = moment(this.datePickerDate[1])
          .tz("Asia/Kolkata")
          .endOf()
          .toISOString();
      } else {
        this.filter.date_to = this.filter.date_from;
      }

      this.getVirtualReach({
        filter: this.filter,
        pageSize: this.pageSize,
        pageNo: this.pageNo,
      }).then((data) => {
        this.closeLoaderDialog();
        this.dataList = data.list;
        this.totalCount = data.totalCount;
        this.fetchCount = data.fetchCount;

        this.dataList = this.dataList.map((d, index) => ({
          ...d,
          serial_number: (this.pageNo - 1) * this.pageSize + (index + 1),
        }));
      });
    },
    setConfig(userList = [], countriesList = []) {
      this.searchConfig = [
        {
          name: "Reach out Type",
          key: "reach_out_types",
          multi: true,
          inputType: "dropdown",
          defaultValue: [],
          isListInStore: false,
          listItems: ["WEBINAR", "PRODUCT TRAINING", "NEWSLETTERS", "EDM"],
        },
        {
          name: "Product",
          key: "countries",
          multi: true,
          inputType: "dropdown",
          defaultValue: [],
          isListInStore: false,
          listItems: countriesList,
        },
        {
          name: "Reach Conducted On",
          key: "conducted_on_date",
          inputType: "datePicker",
          defaultValue: null,
        },
      ];

      this.inputConfig = [
        {
          name: "Type of Reach Out*",
          type: "Dropdown",
          key: "reach_out_type",
          width: "full",
          multi: false,
          isListInStore: false,
          listItems: ["WEBINAR", "PRODUCT TRAINING", "NEWSLETTERS", "EDM"],
          validations: {
            required,
          },
        },
        {
          name: "Product*",
          type: "Dropdown",
          key: "country",
          width: "full",
          multi: false,
          isListInStore: false,
          listItems: countriesList,
          validations: {
            required,
          },
        },
        {
          name: "Subject*",
          type: "TextArea",
          key: "subject",
          width: "full",
          validations: {
            required,
            minLength: minLength(2),
          },
        },
        {
          name: "Conducted On*",
          type: "Date",
          key: "conducted_on_date",
          width: "half",
          validations: {
            required,
          },
        },
        {
          name: "Reach",
          type: "Number",
          key: "reach",
          width: "half",
        },
        {
          name: "Agency Name",
          type: "String",
          key: "company_name",
          width: "half",
        },
        {
          name: "Point Of Contact",
          type: "String",
          key: "point_of_contact",
          width: "half",
        },
      ];

      if (this.isAdminOrManagement) {
        this.searchConfig.unshift({
          name: "Created By",
          key: "names",
          multi: true,
          inputType: "dropdown",
          defaultValue: [],
          isListInStore: false,
          listItems: userList,
          classes: ["half"],
        });
      }
    },
    getCountries() {
      if (this.userType == this.SALES_AGENT) {
        this.countriesList = [...this.userData.usr_data.countries];
      } else {
        return this.getCountryList();
      }
    },

    advanceSearch(filterObject) {
      var filterData = JSON.parse(JSON.stringify(filterObject));
      if (filterData.date_of_call) {
        filterData.date_of_call = helpers.getISODate(filterData.date_of_call);
      }

      this.filter = { ...filterData };
      this.pageNo = 1;
      this.getData();
    },
    async formOutput(data) {
      var formData = JSON.parse(JSON.stringify(data));

      formData.conducted_on_date = helpers.getISODate(
        formData.conducted_on_date
      );
      if (!formData.reach) {
        formData.reach = 0;
      } else if (formData.reach < 0) {
        formData.reach = 0;
      } else {
        formData.reach = Number(formData.reach);
      }

      this.openLoaderDialog();
      if (!this.isEditMode) {
        this.addVirtualReach(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            this.openSnackbar({
              text: "Sucessfully Added Virtual Reach Entry",
            });
            this.closeForm();
            this.getData();
          } else {
            this.openSnackbar({ text: data.message });
          }
        });
      } else {
        this.editVirtualReach(formData).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            this.openSnackbar({
              text: "Sucessfully Edited Virtual Reach Entry",
            });
            this.closeForm();
            this.getData();
          } else {
            this.openSnackbar({ text: data.message });
          }
        });
      }
    },
    getEditRowObject(data) {
      return {
        ...data,
        _id: data._id,
        updated_on: data.record.updated_on,
      };
    },
    deleteEntry(data) {
      if (window.confirm("Do you really want to Delete the Virtual Reach?")) {
        this.openLoaderDialog();
        this.deleteVirtualReach({
          _id: data._id,
        }).then((data) => {
          this.closeLoaderDialog();
          if (data.ok) {
            this.openSnackbar({
              text: "Sucessfully Deleted the Virtual Reach",
            });
            this.getData();
          } else {
            this.openSnackbar({ text: data.message });
          }
        });
      }
    },

    downloadReach() {
      this.openLoaderDialog();
      let selectionDate = JSON.parse(JSON.stringify(this.datePickerDate));
      selectionDate.sort();
      this.filter.date_from = moment(selectionDate[0])
        .tz("Asia/Kolkata")
        .startOf()
        .toISOString();
      if (selectionDate[1]) {
        this.filter.date_to = moment(selectionDate[1])
          .tz("Asia/Kolkata")
          .endOf()
          .toISOString();
      } else {
        this.filter.date_to = this.filter.date_from;
      }

      this.openLoaderDialog();
      this.downloadVirtualReachFile({
        filter: this.filter,
      }).then(() => {
        this.closeLoaderDialog();
      });
    },
  },
  watch: {},
  props: {},
};
</script>
<style lang="scss">
.manageVirtualReachWrapper {
  height: 100%;
  .tabItemWrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
.datepicker {
  .v-input__slot {
    margin-bottom: 0;
  }
  .v-text-field__details {
    display: none;
  }
}
</style>
<style lang="scss" scoped>
.SearchbarWrapper {
  .searchWrapper {
    flex-shrink: 0;
  }
}
.reportListWrapper {
  .leaves-table {
    margin: 10px;
    padding: 10px;
    border: 1px solid $primary;
    border-radius: 5px;
  }
  .expandable-section {
    padding: 1em !important;
    .expandable-section-title {
      font-size: 16px;
      font-weight: 600;
    }
    .expandable-section-content {
      white-space: pre-wrap;
    }
  }
}
</style>
