<template>
  <div class="settingsWrapper">
    <div class="settings-row">
      <div class="settings-key">
        <div class="key-title">Total Number of paid leaves</div>
        <div class="key-subtitle">
          Total number of paid leaves for the next financial year
        </div>
      </div>
      <div class="settings-value text-field">
        <v-text-field label="Regular" value=""></v-text-field>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-key">
        <div class="key-title">Currency</div>
        <div class="key-subtitle">
          Please select a currency from the dropdown. List of active currency
          below the dropdown
        </div>
      </div>
      <div class="settings-value">
        <div class="currency-dropdown">
          <v-autocomplete
            v-model="currencyValue"
            label="Select a Currency"
            chips
            clearable
            :items="currencies"
            :multiple="true"
          ></v-autocomplete>
          <!-- @blur="setCurrency" -->
        </div>
        <div class="currency-table">
          <v-data-table
            hide-default-footer
            :headers="headers"
            :items="activeCurrencies"
          >
            <template v-slot:item.conversion_to_usd="props">
              <v-edit-dialog :return-value.sync="props.item.conversion_to_usd">
                {{ props.item.conversion_to_usd }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.conversion_to_usd"
                    label="Edit"
                    single-line
                    counter
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </div>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-key">
        <div class="key-title">Policies</div>
        <div class="key-subtitle">
          Company Policies
        </div>
      </div>
      <div class="settings-value text-field">
        <v-file-input
          v-model="file"
          accept="application/pdf"
          label="Upload Policies"
        ></v-file-input>
        <v-progress-circular
          v-if="showProgress"
          :value="uploadPercentage"
        ></v-progress-circular>
        <div class="upload-actions">
          <v-btn @click="uploadFile()">Upload</v-btn>
          <v-btn @click="downloadPoliciesF()">Cancel</v-btn>
        </div>
      </div>
    </div>
    <v-btn color="primary" @click="editAdminSettings">SUBMIT</v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  name: "Settings",
  components: {},
  created() {
    this.getSettings();
    this.currencyValue = this.activeCurrencies.map(function(active) {
      return active.currency_type;
    });
    console.log(this.currencyValue);
  },
  mounted() {},
  data: () => ({
    totalPaidLeaves: 0,
    activeCurrencies: [
      {
        currency_type: "USD",
        conversion_to_usd: 1,
      },
      {
        currency_type: "INR",
        conversion_to_usd: 75,
      },
      {
        currency_type: "AED",
        conversion_to_usd: 3.3,
      },
    ],
    policies: false,
    file: null,
    showProgress: false,
    headers: [
      {
        text: "Currency Name",
        align: "start",
        sortable: false,
        value: "currency_type",
      },
      { text: "Conversion to USD", value: "conversion_to_usd" },
    ],
    currencies: [
      { text: "USD", value: "USD" },
      { text: "NZR", value: "NZR" },
      { text: "INR", value: "INR" },
      { text: "AED", value: "AED" },
      { text: "EUR", value: "EUR" },
      { text: "BAT", value: "BAT" },
    ],
    currencyValue: [],
  }),
  methods: {
    ...mapActions("Settings", [
      "getGlobalSettings",
      "uploadPolicies",
      "downloadPolicies",
    ]),
    ...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
    getSettings() {
      this.openLoaderDialog();
      this.getGlobalSettings().then((data) => {
        this.closeLoaderDialog();
        if (!data.ok) {
          this.openSnackbar({ text: "Failed to Fetch Global settings" });
        }
        this.totalPaidLeaves = data.totalPaidLeaves;
        // this.activeCurrencies = data.activeCurrencies;
        this.policies = data.policies;
      });
    },
    uploadFile() {
      this.showProgress = true;
      let formData = this.createFormData(this.file);
      this.uploadPolicies(formData).then((data) => {
        this.showProgress = false;
        console.log(data);
      });
    },
    downloadPoliciesF() {
      this.downloadPolicies().then(() => {});
    },
    createFormData(file) {
      let formData = new FormData();
      formData.append("policies", file);
      return formData;
    },
    editAdminSettings() {
      console.log(this.activeCurrencies);
    },
    setCurrency(data) {
      console.log("Output on Blur", data);
      console.log("Value on Blur", this.currencyValue);
      for (var active of this.activeCurrencies) {
        console.log(active.currency_type);
      }
    },
  },
  computed: {
    ...mapGetters(["uploadPercentage"]),
  },
  watch: {
    currencyValue(nv, ov) {
      console.log("nv", nv);
      let tempObj = [];
      let found;
      for (let value of nv) {
        // console.log("nv val", value);
        found = false;
        // compare the active currencies with the selected currency and if they match sent found to true
        for (let currency of this.activeCurrencies) {
          //   console.log("currency", currency);
          if (currency.currency_type == value) {
            tempObj.push(currency);
            found = true;
          }
        }

        if (!found) {
          tempObj.push({
            currency_type: value,
            conversion_to_usd: 0,
          });
        }
      }

      this.activeCurrencies = tempObj;
    },
  },
};
</script>

<style lang="scss">
.settingsWrapper {
  padding: 20px;

  .key-subtitle {
    font-size: 14px;
    color: gray;
  }

  .settings-row {
    display: flex;
    margin-bottom: 40px;

    .settings-key {
      flex: 0 0 30%;
      @include custom-max(1000px) {
        flex: 0 0 40%;
      }
    }
    .settings-value {
      flex: 0 0 70%;
      @include custom-max(1000px) {
        flex: 0 0 60%;
      }
    }
    .text-field {
      flex: 0 0 40%;
      @include custom-max(1000px) {
        flex: 0 0 50%;
      }
      //   @include custom-max(767px) {
      //     flex: 0 0 50%;
      //   }
    }
  }
}
</style>
