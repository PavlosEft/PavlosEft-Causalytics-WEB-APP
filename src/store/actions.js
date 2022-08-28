import CausalyticsAPI from '../api/causalyticsAPI';
import Utils from '../Utils/utils';
import Vue from 'vue'

const actions = {
    async getCausalyticsAPIchartsData({ state, commit }, data) {
        commit('setChartsDataRequestParams', data);
        var res = await CausalyticsAPI.chartsData(state);

        if (res.error === true) {

            Vue.$toast.open({
                message: res.message,
                position: "top-right",
                type: "error"
            });

            return [];
        }
        else {

            if (res.length == 0) {
                Vue.$toast.open({
                    message: "No data to display.",
                    position: "top-right",
                    type: "warning"
                });
            }
            else {
                for (var i = 0; i < res.length; i++) {
                    var newColor = Utils.PredefinedColors.length < (i + 1) ? Utils.getRandomColor() : Utils.PredefinedColors[i];
                    res[i] = {
                        label: res[i].label,
                        data: res[i].data,
                        borderColor: newColor,
                        backgroundColor: newColor,
                        tension: 0.4
                    }
                }
            }

            return res;
        }
    }
}

export default actions