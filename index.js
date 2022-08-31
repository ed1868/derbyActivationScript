// let Hotels = require('./hotelData/ihgHotels')

let Hotels = ["CLEHB",
    "NYCHC",
    "MIAHC",
    "ATLBH",
    "SFOHA"]

const axios = require('axios');

let hotelsTested = [];
let hotelsActivated = [];
let testedHotelCount = 0;
let activatedHotelCount = 0;

activateHotel = (id) => {
    console.log(`CURRENT HOTEL BEING ACTIVATED : ${id}`);

    let hotelToActivate = id;

    axios({
        method: "post",
        url: "https://go-us.derbysoftsec.com/api/go/shoppingengine/v4/hotels/IHG/setup",
        headers: {
            Authorization: "zCc23JLtqCPO2Lzn9S0000014c71b546f0d54c11823e523b74dc9807"
        },
        data: {
            header: {
                Authorization: "zCc23JLtqCPO2Lzn9S0000014c71b546f0d54c11823e523b74dc9807",
                distributorId: "OVERSEAS",
                version: "v4",
                token: "zCc23JLtqCPO2Lzn9S0000014c71b546f0d54c11823e523b74dc9807"
            },
            hotels: [
                {
                    supplierId: "IHG",
                    hotelId: hotelToActivate,
                    status: "Actived"
                }
            ]
        }
    }).then(payload => {
        if (payload.status == "200") {
            console.log(payload.data);
            if (payload.data.hotelCount) {
                console.log(`HOTEL CODE ${hotelToActivate} WAS JUST ACTIVATED`);
                hotelsActivated.push(hotelToActivate);
                activatedHotelCount++;
            } else {
                hotelsTested.push(hotelToActivate);
                testedHotelCount++;
            }

            console.log('activated hotel count : ', activatedHotelCount);
            console.log('activated hotel list : ', hotelsActivated);
            console.log('hotel tested count : ', testedHotelCount);
            console.log('hotels tested list :: ', hotelsTested);
        }
    })
        .catch(err => {

            if (err && err.code == "ECONNREFUSED") {
                console.log(':::::::::::::ECONNREFUSED ERROR :::::::::::::: ', err)
                setTimeout(function () {
                    console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
                    activateHotel(id)
                }, 7000)
            }
            if (err && err.code == "ETIMEDOUT") {
                console.log(':::::::::::::ETIMEDOUT ERROR :::::::::::::: ', err)
                setTimeout(function () {
                    console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
                    activateHotel(id)
                }, 7000)

            }

            if (err && err.response) {
                if (err.response.status) {
                    if (err.response.status == "429") {
                        setTimeout(function () {
                            console.log(':::::::::::::::ERROR FIX SET TIME OUT ID :::::::::::::::::::::::::::::::', id)
                            activateHotel(id)
                        }, 6000)
                    }
                }
            }

            if (err && !err.response) {
                console.log('no error response ')
            }
        })


}

async function getActivation(hotelId) {
    await activateHotel(hotelId)
}

async function getAllHotels() {
    const apiPromises = Hotels.map(getActivation)
    await Promise.all(apiPromises)
}


getAllHotels()

// activateHotel("MSPSP")