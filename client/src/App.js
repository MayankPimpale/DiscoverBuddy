import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AddTrip from "./pages/AddTrip";
import Profile from "./pages/Profile";
import TripDetails from "./pages/TripDetails";
import { AuthContextProvider } from "./context/AuthContext";
import ExplorePage from "./pages/ExplorePage";



function App() {
  return (
  <AuthContextProvider>
  <Router>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/explore" element={<ExplorePage/>}/>
      <Route path="/add-trip" element={<AddTrip/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/trip/:tripId" element={<TripDetails />} />
    </Routes>
  </Router>
  </AuthContextProvider>
  );
}

export default App;
