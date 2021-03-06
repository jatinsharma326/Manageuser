<template>
  <div class="BirthdayRemindersWrapper">
    <div class="dashboardColumnWrapper">
      <div class="column-one column">
        <div class="title-section">
          <div class="title">Agent Birthdays</div>
          <!-- This is the showColumn Part means when you click it shows column and it show not means it is a toogle-->
          <v-btn color="tertiary" icon @click="showColumnOne = !showColumnOne">
            <v-icon>{{
              <!-- This show ColumnOne is treated at the bottom of the page this will give you the decent idea of how many pages you are using -->

              showColumnOne ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </div>
        <div class="contentSectionWrapper" v-show="showColumnOne">
          <div v-if="columnOneTotalCount === 0" class="content-error-message">
            Please add Date of Birth for any travel agent.
          </div>
          <div v-else class="content-section">
            <div
              v-for="(person, index) in travelAgentBirthdays"
              :key="index + '_travelAgentEmployee'"
              class="card-element"
            >
              <!-- Information Card which is From Components -->
              <InformationCard
                :isBirthDate="checkForBirthDate(person.birth_date)"
                :expandCard="false"
              >
                <template v-slot:topLeft>
                  {{ person.company_data.name }}
                </template>
                <template v-slot:topRight>
                  {{ getFormattedDate(person.birth_date, "DD/MM") }}
                </template>
                <template v-slot:mainContent>
                  {{ person.name + " ( " + person.designation + " )" }}
                </template>
                <template v-slot:mainContentSubtitle>
                  {{ daysUntil(person.birth_date, "Today 🎂🎉 ") }}
                </template>
              </InformationCard>
            </div>
            <div
              v-if="columnOnePageSize < columnOneTotalCount"
              class="action-button"
            >
              <v-btn color="secondary" text @click="loadMoreColumnOne">
                View More
              </v-btn>
            </div>
          </div>
        </div>
      </div>
      <!-- This is a Second column -->
      <div class="column-two column">
        <div class="title-section">
          <div class="title">Teams Birthdays</div>
          <v-btn color="tertiary" icon @click="showColumnTwo = !showColumnTwo">
            <v-icon>{{
              showColumnTwo ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
          </v-btn>
        </div>
        <div class="contentSectionWrapper" v-show="showColumnTwo">
          <div class="content-section">
            <div
              v-for="(person, index) in gloablDestinationsBirthdays"
              :key="index + '_GDEmployee'"
              class="card-element"
            >
              <InformationCard
                :isBirthDate="isSelectedDateCurrentDate(person.birth_date)"
                :expandCard="false"
              >
                <template v-slot:topLeft>
                  {{ person.usr_data.designation }}
                </template>
                <template v-slot:topRight>
                  {{ getFormattedDate(person.birth_date, "DD/MM") }}
                </template>
                <template v-slot:mainContent>
                  {{ person.usr_data.name }}
                </template>
                <template v-slot:mainContentSubtitle>
                  {{ daysUntil(person.birth_date, "Today 🎂🎉 ") }}
                </template>
              </InformationCard>
            </div>
            <div
              v-if="columnTwoPageSize < columnTwoTotalCount"
              class="action-button"
            >
              <v-btn color="secondary" text @click="loadMoreColumnTwo">
                View More
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import InformationCard from "../../components/InformationCard";
import helperMixin from "../../mixins/helperMixins";
import moment from "moment-timezone";
export default {
  name: "BirthdayReminders",
  mixins: [helperMixin],
  components: { InformationCard },
  created() {
    this.getAgentBirthdayList();
    this.getGDEmployeeBirthdayList();
  },
  data: () => ({
    showColumnOne: true,
    showColumnTwo: true,
    pageNo: 1,
    columnOnePageSize: 20,
    columnTwoPageSize: 20,
    columnOneTotalCount: "",
    columnTwoTotalCount: "",
    travelAgentBirthdays: [],
    gloablDestinationsBirthdays: [],
  }),
  methods: {
    ...mapMutations(["openLoaderDialog", "closeLoaderDialog", "openSnackbar"]),
    ...mapActions("Dashboard", ["getAgentBirthdays", "getGDEmployeeBirthdays"]),

      //Increase the pages As You Click View More
    loadMoreColumnOne() {
      this.columnOnePageSize = this.columnOnePageSize + 20;
      this.getAgentBirthdayList();
    },
    //Increase the Page of column two as you click one by one
    loadMoreColumnTwo() {
      this.columnTwoPageSize = this.columnTwoPageSize + 20;
      this.getGDEmployeeBirthdayList();
    },
    //This Function checks the Birthdate using timezone
    checkForBirthDate(date) {
      let dateToCheck = moment(date).tz("Asia/Kolkata").format("DD-MM-YYYY");
      let dateToday = moment().tz("Asia/Kolkata").format("DD-MM-YYYY");
      if (dateToday == dateToCheck) {
        return true;
      }
      return false;
    },
    //This Function come from store/index.js
    getAgentBirthdayList() {
      this.openLoaderDialog();
      this.getAgentBirthdays({
        pageSize: this.columnOnePageSize,
        pageNo: this.pageNo,
      }).then((data) => {
        this.closeLoaderDialog();
        if (!data.ok) {
          this.openSnackbar({ text: "Failed to Fetched Agent Birthday List" });
        }
        this.travelAgentBirthdays = data.list;
        this.columnOneTotalCount = data.totalCount;
      });
    },
    //This is also comes from getGDEmployeeBirthdayList

    getGDEmployeeBirthdayList() {
      this.openLoaderDialog();
      this.getGDEmployeeBirthdays({
        pageSize: this.columnTwoPageSize,
        pageNo: this.pageNo,
      }).then((data) => {
        this.closeLoaderDialog();
        if (!data.ok) {
          this.openSnackbar({
            text: "Failed to Fetched Employee Birthday List",
          });
        }
        this.gloablDestinationsBirthdays = data.list;
        this.columnTwoTotalCount = data.totalCount;
      });
    },
  },
  computed: {},
  watch: {},
};
</script>

<style lang="scss">
.BirthdayRemindersWrapper {
  .card-element:last-child {
    padding-bottom: 10px;
  }
}

.birthday-gif {
  background-image: url("../../assets/BirthdayGIF.gif");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right;
}

.breathing {
  animation: breathing 5s ease-out infinite normal;
}

@keyframes breathing {
  0% {
    transform: scale(1);
  }

  25% {
    transform: scale(1.05);
  }

  50% {
    transform: scale(1);
  }

  75% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}
</style>
