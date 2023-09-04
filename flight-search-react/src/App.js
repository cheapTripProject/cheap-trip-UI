import React, {useEffect, useState} from 'react';
import './App.css';
import FlightShearch from './component/FlightShearch.js';

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
        "Bacau Airport (BCM)",
        "Bucharest Airports (OTP)",
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
        "Targu Mureș Airport (TGM)",
        /* Add more origins as needed */
    ];
    const originMap = {};

    origins.forEach(origin => {
        const parts = origin.match(/^(.*?)\s+\((.*?)\)$/);
        if (parts && parts.length === 3) {
            originMap[origin] = parts[2].trim();
        }
    });

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
            dateTo: departureDate,
            returnFrom: null,
            returnTo: null,
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
        const originDropdown = document.getElementById("originDropdown");
        if (!originDropdown) return;

        const dropdownContent = originDropdown.querySelector(".dropdown-content");
        dropdownContent.innerHTML = "";

        if (suggestions.length === 0) {
            dropdownContent.style.display = "none";
            return;
        }

        suggestions.forEach((suggestion) => {
            const suggestionElement = document.createElement("div");
            suggestionElement.textContent = suggestion;
            suggestionElement.addEventListener("click", () => {
                setOrigin(originMap[suggestion]); // Update the state
                dropdownContent.style.display = "none"; // Close the dropdown
            });
            dropdownContent.appendChild(suggestionElement);
        });

        dropdownContent.style.display = "block";
    }

// Close the autocomplete dropdown when clicking outside of it
    document.addEventListener("click", (event) => {
        const originDropdown = document.getElementById("originDropdown");

        if (originDropdown && !originDropdown.contains(event.target)) {
            const dropdownContent = originDropdown.querySelector(".dropdown-content");
            dropdownContent.style.display = "none";
        }
    });
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

            <div className="dropdown" id="originDropdown">
                <div className="dropdown-content" id="originAutocomplete">
                </div>
            </div>

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
                    <FlightShearch key={flight.id} flight={flight} />
                ))}
            </div>
        </div>
    );
}

export default App;