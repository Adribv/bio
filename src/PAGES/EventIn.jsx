import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { abi } from '../abi';
import Menu from '../COMPONENTS/Menu';
import { useNavigate } from 'react-router-dom';
import gif from '../ASSETS/loader.gif';

const EventIn = ({ contract, user, setUser }) => {
  const [events, setEvents] = useState([]);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('BioHeritageHub')) {
      navigate('/');
    } else {
      setUser(JSON.parse(localStorage.getItem('BioHeritageHub')).address);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const Instance = new web3.eth.Contract(abi, contract);
        const eventCount = await Instance.methods.eventCount().call();

        const eventsArray = [];
        for (let i = 1; i <= Number(eventCount); i++) {
          const isParticipant = await Instance.methods.isParticipantOfEvent(i, user).call();
          if (isParticipant) {
            let event = await Instance.methods.events(i).call();
            event.id = i;
            eventsArray.push(event);
          }
        }

        setEvents(eventsArray);
        setLoader(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoader(false);
      }
    };

    fetchEvents();
  }, [contract, user]);

  return (
    <DashboardContainer>
      {loader && <Loader src={gif} alt="loading..." />}
      <div className="menu">
        <Menu contract={contract} user={user} />
      </div>
      <h1>Registered Events</h1>
      {events.length > 0 ? (
        events.map((event, index) => (
          <EventCard key={index}>
            <h2>{event.name}</h2>
            <p>Location: {event.location}</p>
            <p>Mobile Number: {event.mobileNumber}</p>
            <p>Start: {new Date(Number(event.startTime) * 1000).toLocaleString()}</p>
            <p>End: {new Date(Number(event.endTime) * 1000).toLocaleString()}</p>
          </EventCard>
        ))
      ) : (
        <NoEvents>No events found</NoEvents>
      )}
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 20px;
  background-color: #357266;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;

  .menu {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  h1 {
    color: #e4ebe9;
    margin-bottom: 20px;
    font-size: 2rem;
  }
`;

const EventCard = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  text-align: center;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  h2 {
    color: #2e7d32;
    margin-bottom: 10px;
  }

  p {
    color: #555;
    margin-bottom: 10px;
  }
`;

const NoEvents = styled.p`
  color: #555;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const Loader = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default EventIn;
