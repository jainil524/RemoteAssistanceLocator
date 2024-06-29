import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfileCard.css';

function ProfileCard() {
  const [userDetails, setUserDetails] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:3000/getuserdetails', {
          headers: {
            method: `POST`, 
            Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2N2ZmNTA5MjJhYzkzZTBlYTRiOTU2NyIsImlhdCI6MTcxOTY2MTg0MCwiZXhwIjoxNzE5NzQ4MjQwfQ.jNbgHc4_PDNryUdxDi3FZajO46UqF2GDvHYT5Wl3jE8`, // Replace with your actual token
          },
        });
        let result = await response.json();
        console.log('User Details Response:', result.data);
        setUserDetails(response.data.data);
        // Uncomment if services are returned as part of user details
        // setServiceHistory(response.data.data.services);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-card">
      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-details">
            <h1>{userDetails.name}</h1>
            <p>{userDetails.location.coordinates.join(', ')}</p>
            <h3>{userDetails.role}</h3>
            <div className="ratings">
              <span>4.9</span> ⭐
            </div>
            <button className="btn">Send message</button>
            <button className="btn">Contacts</button>
            <button className="btn">Report user</button>
          </div>
        </div>
        <hr />
        <div className="profile-sections">
          <div className="section address">
            <h3>Address</h3>
            <div className="work-item">
              <h4></h4>
              <p>{userDetails.address || '15, New Asopalav society, Gujarat, IN 384001'}</p>
            </div>
          </div>
          <div className="section contact">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <label htmlFor="phone">Phone: {userDetails.phone}</label>
            </div>
            <div className="contact-item">
              <label htmlFor="email">E-mail: {userDetails.email}</label>
            </div>
          </div>
        </div>
        <div className="profile-sections">
          <div className="section history">
            <h3>History</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Provider</th>
                </tr>
              </thead>
              <tbody>
                {serviceHistory.map(service => (
                  <tr key={service.id}>
                    <td>{service.date}</td>
                    <td>{service.service}</td>
                    <td>{service.provider}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="section service">
            <h3>Service</h3>
            <table>
              <tbody>
                {serviceHistory.map(service => (
                  <tr key={service.id}>
                    <td>{service.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
