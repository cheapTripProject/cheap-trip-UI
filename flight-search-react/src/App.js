import React, { useState, useEffect } from 'react';
import './App.css';
import FlightItem from './component/FlightItem.js';

function App() {
    // State variables
    const [flights, setFlights] = useState([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [noOfAdults, setNoOfAdults] = useState('');

    // List of available origins
    const origins = [
        "Baia Mare Airport (BAY)",
        "Bacău Airport (BCM)",
        "Bucharest Airports (OTP/BBU)",
        "Constanta Airport (CND)",
        "Craiova Airport (CRA)",
        "Iasi Airport (IAS)",
        "Oradea Airport (OMR)",
        "Sibiului Airport (SBZ)",
        "Suceava Airport (SCV)",
        "Satu Mare Airport (SUJ)",
        "Tulcea Airport (TCE)",
        "Timisoara Airport (TSR)",
        "Cluj-Napoca Airport (CLJ)",
        "Târgu Mureș Airport (TGM)",
        /* Add more origins as needed */
    ];

    // Function to fetch data from the API
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

    // Function to search flights
    async function searchFlights() {
        const apiUrl = 'http://localhost:8080/getFlights';

        const requestBody = {
            flyFrom: origin,
            flyTo: null,
            dateFrom: departureDate,
            // ... (rest of your request body)
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
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
    }

    // Function to handle user input and filter origin suggestions
    function handleOriginInput(input) {
        const filteredOrigins = origins.filter((origin) =>
            origin.toLowerCase().includes(input.toLowerCase())
        );

        // Find the IATA code within parentheses and set it as the origin value
        const iataCodeMatch = input.match(/\((.*?)\)/);
        if (iataCodeMatch && iataCodeMatch[1]) {
            setOrigin(iataCodeMatch[1]);
        } else {
            setOrigin(input);
        }

        renderOriginSuggestions(filteredOrigins);
    }

    // Function to render origin suggestions
    function renderOriginSuggestions(suggestions) {
        const originAutocomplete = document.getElementById("originAutocomplete");
        if (!originAutocomplete) return;

        originAutocomplete.innerHTML = "";

        if (suggestions.length === 0) {
            originAutocomplete.style.display = "none";
            return;
        }

        suggestions.forEach((suggestion) => {
            const suggestionElement = document.createElement("div");
            suggestionElement.textContent = suggestion;
            suggestionElement.addEventListener("click", () => {
                setOrigin(suggestion); // Update the state
                originAutocomplete.innerHTML = ""; // Clear the autocomplete suggestions
            });
            originAutocomplete.appendChild(suggestionElement);
        });

        originAutocomplete.style.display = "block";
    }

    // Close the autocomplete dropdown when clicking outside of it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            const originInput = document.getElementById("originInput");
            const originAutocomplete = document.getElementById("originAutocomplete");

            if (originInput && originAutocomplete &&
                event.target !== originInput && event.target !== originAutocomplete) {
                originAutocomplete.style.display = "none";
            }
        };

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <div className="App">
            <h1>Flight Search Engine</h1>
            <div className="button-container">
                <button onClick={searchFlights}>Search Flights</button>
            </div>

            <label htmlFor="originInput">Origin:</label>
            <input
                type="text"
                id="originInput"
                placeholder="Enter origin"
                value={origin}
                onChange={(e) => handleOriginInput(e.target.value)}
            />
            <div id="originAutocomplete" className="autocomplete"></div>

            <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
            >
                <option value="">Select Destination</option>
                <option value="IAS">IAS</option>
                <option value="MIL">MIL</option>
                <option value="BUC">BUC</option>
                {/* Add more options as needed */}
            </select>
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