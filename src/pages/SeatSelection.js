import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SeatSelection() {
  const { id } = useParams();

  const [bus, setBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [bookingDone, setBookingDone] = useState(false);

  // 🔥 fetch bus
  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axios.get(`https://bus-booking-backend-kq8r.onrender.com/${id}`);
        setBus(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBus();
  }, [id]);

  // 🔥 seat select
  const handleSeatClick = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // 🔥 passenger form create
  useEffect(() => {
    const newPassengers = selectedSeats.map(() => ({
      name: "",
      age: "",
      gender: "male"
    }));

    setPassengers(newPassengers);
  }, [selectedSeats]);

  // 🔥 passenger input
  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  // 🔥 booking API
  const handleBooking = async () => {
    try {
      // validation
      for (let p of passengers) {
        if (!p.name || !p.age) {
          alert("Please fill all passenger details ❌");
          return;
        }
      }

      await axios.post("http://localhost:3000/api/bookings", {
        busId: bus.id || bus._id,
        seats: selectedSeats,
        passengerDetails: passengers
      });

      alert("Booking Successful 🎉");

      setBookingDone(true);

    } catch (error) {
      console.log(error);
      alert("Booking Failed ❌");
    }
  };

  if (!bus) return <p>Loading...</p>;

  // 🎉 BOOKING CONFIRMATION PAGE
  if (bookingDone) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Booking Confirmed 🎉</h2>

        <h3>Bus Details</h3>
        <p>{bus.name}</p>
        <p>
          {bus.departureCity} → {bus.arrivalCity}
        </p>

        <h3>Selected Seats</h3>
        <p>{selectedSeats.join(", ")}</p>

        <h3>Passenger Details</h3>
        {passengers.map((p, i) => (
          <p key={i}>
            {p.name} ({p.age}, {p.gender})
          </p>
        ))}

        <h3>Total Price: ₹{selectedSeats.length * bus.price}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{bus.name} - Select Seats</h2>

      {/* 🪑 Seats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 60px)",
          gap: "10px",
          marginTop: "20px"
        }}
      >
        {bus.seats.map((seat) => (
          <div
            key={seat.seatNumber}
            onClick={() =>
              seat.isAvailable && handleSeatClick(seat.seatNumber)
            }
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: !seat.isAvailable
                ? "gray"
                : selectedSeats.includes(seat.seatNumber)
                ? "green"
                : "white",
              border: "1px solid black",
              textAlign: "center",
              lineHeight: "50px",
              cursor: "pointer"
            }}
          >
            {seat.seatNumber}
          </div>
        ))}
      </div>

      {/* 🎯 Selected Seats */}
      <h3 style={{ marginTop: "20px" }}>
        Selected Seats: {selectedSeats.join(", ") || "None"}
      </h3>

      {/* 💰 Price */}
      <h3>Total Price: ₹{selectedSeats.length * bus.price}</h3>

      {/* 👤 Passenger Form */}
      <div style={{ marginTop: "20px" }}>
        <h3>Passenger Details</h3>

        {passengers.map((p, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              placeholder="Name"
              value={p.name}
              onChange={(e) =>
                handlePassengerChange(index, "name", e.target.value)
              }
            />

            <input
              placeholder="Age"
              value={p.age}
              onChange={(e) =>
                handlePassengerChange(index, "age", e.target.value)
              }
              style={{ marginLeft: "10px" }}
            />

            <select
              value={p.gender}
              onChange={(e) =>
                handlePassengerChange(index, "gender", e.target.value)
              }
              style={{ marginLeft: "10px" }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        ))}
      </div>

      {/* 🚀 Confirm */}
      <button
        onClick={handleBooking}
        disabled={selectedSeats.length === 0}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Confirm Booking
      </button>
    </div>
  );
}

export default SeatSelection;