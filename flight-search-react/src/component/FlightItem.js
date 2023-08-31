import React from 'react';

function FlightItem({ flight }) {
    return (
        <div className="flight-item">
            <a target="_blank" rel="noopener noreferrer" href={flight.deep_link}>
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
    );
}

export default FlightItem;