<template>
  <div class="home pa-4">
    <v-container grid-list-lg>
      <v-layout row>
        <v-flex xs12 class="text-xs-center display-1 font-weight-black">Facebook CPC Charts</v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 class="chart">
          <Chart />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Chart from "../components/Chart";

export default {
  name: "HomeView",
  components: {
    Chart
  }
};
</script>
