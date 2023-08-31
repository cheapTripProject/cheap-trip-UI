import React, {useState} from 'react';
import './App.css';
import FlightItem from './component/FlightItem.js'; // Import the new component


function App() {
    const [flights, setFlights] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [noOfAdults, setNoOfAdults] = useState('');


    async function fetchData(url, options) {
        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    const searchFlights = async () => {
        const apiUrl = 'http://localhost:8080/getFlights';

        const requestBody = {
            flyFrom: origin,
            flyTo: null,
            dateFrom: departureDate,
            dateTo: departureDate,
            returnFrom: "2023-12-03",
            returnTo: "2023-12-03",
            nightsInDstFrom: 0,
            nightsInDstTo: 3,
            maxFlyDuration: null,
            retFromDiffCity: false,
            retToDiffCity: false,
            oneForCity: null,
            onePerDate: null,
            adults: noOfAdults,
            children: null,
            infants: null,
            selectedCabins: "M",
            mixWithCabins: null,
            adultHoldBag: null,
            adultHandBag: null,
            childHoldBag: null,
            childHandBag: null,
            flyDays: null,
            flyDaysType: null,
            retFlyDaysType: null,
            onlyWorkingDays: false,
            onlyWeekends: false,
            partnerMarket: null,
            curr: "RON",
            locale: null,
            priceFrom: null,
            priceTo: null,
            dtimeFrom: null,
            dtimeTo: null,
            atimeFrom: null,
            atimeTo: null,
            retDtimeFrom: null,
            retDtimeTo: null,
            retAtimeFrom: null,
            retAtimeTo: null,
            stopOverFrom: null,
            stopOverTo: null,
            maxStopOvers: 0,
            maxSectorStopOvers: null,
            connOnDiffAirport: null,
            retFromDiffAirport: null,
            retToDiffAirport: null,
            selectAirlines: null,
            selectAirlinesExcluded: false,
            selectStopAirport: null,
            selectStopAirportExclude: false,
            vehicleType: null,
            enableVi: false,
            sort: "price",
            limit: null
        };

        const requestOptions = {
            method: 'POST', // Use GET, even though it's not a standard practice
            headers: {
                'Content-Type': 'application/json', // Include the Content-Type header
            },
            body: JSON.stringify(requestBody)
        };

        try {
            const data = await fetchData(apiUrl, requestOptions);


            if (data && Array.isArray(data.data)) {
                setFlights(data.data);
                console.log('Fetched data:', data.data);
            }
        } catch (error) {
            console.error('Error searching flights:', error);
        }
    };

    return (
        <div className="App">
            <h1>Flight Search Engine</h1>
            <div className="button-container">
                <button onClick={searchFlights}>Search Flights</button>
            </div>
            <input
                type="text"
                placeholder="Origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
            />
            <input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
            />
            <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
            />
            <input
                type="text"
                placeholder="No. of adults"
                value={noOfAdults}
                onChange={(e) => setNoOfAdults(e.target.value)}
            />
            <div className="flight-list">
                {flights.map((flight) => (
                    <FlightItem key={flight.id} flight={flight} />
                ))}
            </div>
        </div>
    );
}

export default App;