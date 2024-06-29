import React from 'react';
import './ProfileCard.css';

function ProfileCard() {
  const serviceHistory = [
    { id: 1, date: '2024-01-01', service: 'Service A', provider: 'Provider A' },
    { id: 2, date: '2024-02-15', service: 'Service B', provider: 'Provider B' },
    { id: 3, date: '2024-03-20', service: 'Service C', provider: 'Provider C' },
    // Add more services as needed
  ];

  return (
    <div className="profile-card">
      <div className="profile-content">
        <div className="profile-info">
          <div className="profile-details">
            <h1>Dhruv Raval</h1>
            <p>Mehsana, GJ</p>
            <h3>Software Engineer</h3>
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
              <p>15, New Asopalav society</p>
              <p>Gujarat, IN 384001</p>
            </div>
          </div>
          <div className="section contact">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <label htmlFor="phone">Phone: +1 123 456 7890</label>
            </div>
            <div className="contact-item">
              <label htmlFor="email">E-mail: dhruv.raval.official@gmail.com</label>
            </div>
            <div className="contact-item">
              <label htmlFor="site">Site: www.dhruvraval.com</label>
            </div>
          </div>
        </div>
        <div className="profile-sections">
             <div className="section history">
            <h3>History</h3>
            <table>
              <tr>
                <th>Date</th>
                <th>Service</th>
                <th>Provider</th>
              </tr>
              {serviceHistory.map(service => (
              <tr key={service.id}>
                <td>{service.date}</td>
                <td>{service.service}</td>
                <td>{service.provider}</td>
              </tr>
               ))}
            </table>
          </div>

          <div className="section service">
            <h3>Service</h3>
            <table>
              <tr>
              </tr>
              {serviceHistory.map(service => (
              <tr key={service.id}>
                <td>{service.service}</td>
              </tr>
               ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
