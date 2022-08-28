<template>
  <v-card class="pa-4">
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="6" md="4">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateRangeText"
              label="Picker in menu"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="selectedDates" no-title scrollable range>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
            <v-btn text color="primary" @click="changedDateRange()">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="6" md="4" class="pr-4">
        <v-slider
          label="cpc days sum"
          @change="changedCpcFrequency(cpcFrequency)"
          v-model="cpcFrequency"
          class="align-center"
          :max="30"
          :min="1"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              v-model="cpcFrequency"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              :max="30"
              :min="1"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" sm="6" md="4" class="pr-4">
        <v-slider
          label="displayed days"
          @change="changedRangeMode(rangeMode)"
          v-model="rangeMode"
          class="align-center"
          :max="365"
          :min="7"
          hide-details
        >
          <template v-slot:append>
            <v-text-field
              @change="changedRangeMode(rangeMode)"
              v-model="rangeMode"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              :max="365"
              :min="7"
              style="width: 60px"
            ></v-text-field>
          </template>
        </v-slider>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
    <div v-if="!noData && !loading">
      <LineChart
        v-if="showLines"
        :chart-options="chartOptions"
        :chart-data="chartData"
        :chart-id="'line-chart'"
        :dataset-id-key="'label'"
      />
      <v-row>
        <v-spacer></v-spacer>
        <v-col>
          <v-btn
            class="mr-2"
            elevation="3"
            icon
            outlined
            @click="setCurrentPagingRange(-1)"
            v-if="(currentPagingRange - 1) >= 0"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-btn
            class="mr-2"
            elevation="3"
            icon
            outlined
            @click="setCurrentPagingRange(1)"
            v-if="(currentPagingRange + 1) < (pagingRanges.length - 1)"
          >
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
          ({{ currentPagingRange + 1 }} / {{ pagingRanges.length - 1 }})
        </v-col>
      </v-row>
    </div>
    <div class="noDataContainer" v-if="noData && !loading">
      <v-icon class="financeIcon">mdi-finance</v-icon>
      <v-icon class="infofinanceIcon">mdi-sync-alert</v-icon>
    </div>
    <div v-if="loading">
      <v-sheet class="pa-3">
        <v-skeleton-loader class="mx-auto" type="card"></v-skeleton-loader>
      </v-sheet>
    </div>
  </v-card>
</template>

<style>
.financeIcon {
  font-size: 400px !important;
  color: gray !important;
  margin: auto;
  width: 100%;
}

.infofinanceIcon {
  font-size: 108px !important;
  color: #ff8c8c !important;
  position: relative !important;
  top: -125px;
  right: -80px;
  margin: auto;
  width: 100%;
}

.noDataContainer {
  overflow: hidden;
}
</style>

<script>
var moment = require("moment");
import { Line as LineChart, Bubble } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import store from "../store";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default {
  name: "Chart",
  async mounted() {
    await this.changedDateRange();
  },
  computed: {
    dateRangeText() {
      return this.selectedDates.join(" ~ ");
    }
  },
  components: { LineChart, Bubble },
  methods: {
    async changedDateRange() {
      this.menu = false;
      this.pagingRanges = [moment(this.selectedDates[0]).format("YYYY-MM-DD")];

      this.daysCounter =
        moment(this.selectedDates[1]).diff(
          moment(this.selectedDates[0]),
          "days"
        ) + 1;

      if (this.daysCounter > this.rangeMode) {
        this.lenghtOfPagingRanges =
          (this.daysCounter / this.rangeMode).toString().indexOf(".") == -1
            ? this.daysCounter
            : this.daysCounter / this.rangeMode + 1;

        var tempCounter = 0;
        for (var i = 0; i < this.lenghtOfPagingRanges - 1; i++) {
          tempCounter = tempCounter + this.rangeMode;
          this.pagingRanges.push(
            moment(this.selectedDates[0])
              .add(tempCounter, "days")
              .format("YYYY-MM-DD")
          );
        }
      } else {
        this.pagingRanges.push(
          moment(this.selectedDates[0])
            .add(this.rangeMode, "days")
            .format("YYYY-MM-DD")
        );
      }
      this.currentPagingRange = 0;
      await this.upadateData();
    },
    async changedCpcFrequency() {
      await this.changedDateRange();
    },
    async changedRangeMode() {
      await this.changedDateRange();
    },
    setLabels() {
      this.chartData.labels = [];
      for (var i = 0; i < this.rangeMode; i++) {
        this.chartData.labels.push(
          moment(this.pagingRanges[this.currentPagingRange])
            .add(i, "days")
            .format("YYYY-MM-DD dddd")
        );
      }
    },
    async upadateData() {
      var untilDate =
        moment(this.pagingRanges[this.currentPagingRange + 1]) >
        moment(this.selectedDates[1])
          ? this.selectedDates[1]
          : this.pagingRanges[this.currentPagingRange + 1];
      var data = {
        timeIncrement: this.cpcFrequency,
        timeRangeSince: moment(
          this.pagingRanges[this.currentPagingRange]
        ).format("YYYY-MM-DD"),
        timeRangeUntil: moment(untilDate).format("YYYY-MM-DD")
      };
      this.loading = true;
      this.chartData.datasets = await this.$store.dispatch(
        "getCausalyticsAPIchartsData",
        data
      );
      this.noData = this.chartData.datasets.length > 0 ? false : true;
      this.loading = false;
      this.setLabels();
    },
    setCurrentPagingRange(amount) {
      this.currentPagingRange = this.currentPagingRange + amount;
      this.upadateData();
    }
  },
  data() {
    return {
      selectedDates: ["2019-10-01", "2019-10-31"],
      pagingRanges: [],
      lenghtOfPagingRanges: 1,
      rangeMode: 7,
      daysCounter: 0,
      currentPagingRange: 0,
      menu: false,
      noData: true,
      loading: false,
      showLines: true,
      cpcFrequency: 1,
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        spanGaps: true,
        responsive: true,
        maintainAspectRatio: false,
        animations: {
          radius: {
            duration: 400,
            easing: "linear",
            loop: context => context.active
          }
        },
        hoverRadius: 12,
        hoverBackgroundColor: "yellow",
        interaction: {
          mode: "nearest",
          intersect: false,
          axis: "x"
        },
        scales: {
          y: {
            ticks: { color: "white" },
            grid: { borderColor: "white", color: "grey" }
          },
          x: {
            ticks: { color: "white" },
            grid: { borderColor: "white", color: "grey" }
          }
        },
        plugins: {
          tooltip: {
            enabled: true
          },
          legend: {
            labels: {
              color: "white"
            }
          }
        }
      }
    };
  }
};
</script>
