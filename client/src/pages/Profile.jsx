import React from "react";
import "../styles/Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faCalendar, faEdit, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import { useProfile } from "../hooks/useProfile";

const Profile = () => {

  const {profile , error , isLoading} = useProfile();

  return (
    <>
    <Header/>
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Picture */}
        <div className="profile-header">
          <FontAwesomeIcon icon={faUser} />
          <h2>
            {profile?.username || "No username available"}
          </h2>
        </div>
        <div className="profile-details">
          <div>
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <label>Email -</label>
            <p>{profile?.email || "No email available"}</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faUser} className="icon" />
            <label>Bio -</label>
            <p>{profile?.bio || "No bio provided."}</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faCalendar} className="icon" />
            <label>Joined Date -</label>
            <p>{profile?.joined || "Date not available"}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
