const mutations = {
    setChartsDataRequestParams(state, payload) {
        state.timeIncrement = payload.timeIncrement;
        state.timeRangeSince = payload.timeRangeSince;
        state.timeRangeUntil = payload.timeRangeUntil;
    },
}

export default mutations