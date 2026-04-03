import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `https://bus-booking-backend-kq8r.onrender.com/api/buses?departureCity=${departureCity}&arrivalCity=${arrivalCity}`
      );

      setBuses(res.data);
    } catch (error) {
      console.log(error);
      alert("Error fetching buses ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Bus Booking 🚍</h2>

      {/* 🔍 Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="From (Delhi)"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
        />

        <input
          placeholder="To (Agra)"
          value={arrivalCity}
          onChange={(e) => setArrivalCity(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button onClick={handleSearch} style={{ marginLeft: "10px" }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {/* 🚌 Bus List */}
      {buses.map((bus) => (
        <div
          key={bus._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{bus.name}</h3>

          <p>
            {bus.departureCity} → {bus.arrivalCity}
          </p>

          <p>
            🕒 {bus.departureTime} - {bus.arrivalTime}
          </p>

          <p>💰 ₹{bus.price}</p>

          <button onClick={() => navigate(`/seats/${bus._id}`)}>
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default Home;