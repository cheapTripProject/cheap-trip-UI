import React, {useState} from 'react';
import './App.css';

function App() {
    const [flights, setFlights] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');


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
            selectedCabins: 'M',
            curr: 'RON',
            sort: 'price',
            dateFrom: departureDate,
            dateTo: departureDate,
            retFromDiffCity: false,
            nightsInDstTo: 3,
            nightsInDstFrom: 0,
            adults: 2,
            returnFrom: '2023-12-03',
            returnTo: '2023-12-03',
            maxStopOvers: 0
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
            <div className="flight-list">
                {flights.map((flight) => (
                    <div key={flight.id} className="flight-item">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={flight.deep_link}
                        >
                            <h3>Flight Details</h3>
                            <div className="flight-details">
                                <p><strong>Origin:</strong> {flight.cityFrom}</p>
                                <p><strong>Destination:</strong> {flight.cityTo}</p>
                                <p><strong>Departure Date:</strong> {flight.local_departure}</p>
                                <p><strong>Price:</strong> {flight.price} {flight.currency}</p>
                                {/* You can display other flight details here */}
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;