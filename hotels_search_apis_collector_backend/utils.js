
const axios = require('axios')

async function getDataFromApi(apiPathsList) {
    let promiseList = []
    apiPathsList.forEach(apiPath => {
        promiseList.push(axios.get(apiPath));
    });

    let res = await Promise.all(promiseList);
    return res.map((resObject) => resObject.data);
}
const mapper = [
    {
        Hotel: (data) => data.Hotel,
        Rate: (data) => data.Rate,
        Price: (data) => data.Fare,
        RoomAmenities: (data) => data.roomAmenities,
    }, {
        Hotel: (data) => data.hotelName,
        Rate: (data) => data.Rate.length,
        Price: (data) => data.Price,
        RoomAmenities: (data) => ((data.amenities.reduce((previousValue, currentValue) => previousValue + currentValue + ',')).slice(0, -1)),
    }
]
const sortDataByRate = (mappedData) => (
    mappedData.sort(
        function (a, b) {
            if (a.Rate > b.Rate) {
                return -1;
            }
            if (a.Rate < b.Rate) {
                return 1;
            }
            return 0;
        })
);
function dataMapper(apisResponseList) {
    let mappedData = [];
    apisResponseList.forEach((respone, index) => {
        mappedData = [...mappedData,
        ...respone.map((record) => ({
            Hotel: mapper[index].Hotel(record),
            Rate: mapper[index].Rate(record),
            Price: mapper[index].Price(record),
            RoomAmenities: mapper[index].RoomAmenities(record),
        }))]
    })
    return sortDataByRate(mappedData);
}
module.exports = { getDataFromApi, dataMapper };