import axios from 'axios';

axios.interceptors.response.use(response => {
    return response;
}, function (error) {
    return Promise.reject({
        error: true,
        message: error.response.data != undefined ? error.response.data.message : error.message
    });
});

const CausalyticsAPI = {
    async chartsData(state) {
        try {
            let chartsData = await axios.get(`${state.apiUrl}/get`, {
                params: {
                    time_increment: state.timeIncrement,
                    from_date: state.timeRangeSince,
                    to_date: state.timeRangeUntil
                }
            });
            return chartsData.data
        } catch (error) {
            return error
        }
    }
}

export default CausalyticsAPI