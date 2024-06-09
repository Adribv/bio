import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { abi } from '../abi';
import Menu from '../COMPONENTS/Menu';
import { useNavigate } from 'react-router-dom';
import gif from '../ASSETS/loader.gif';

const YourEvents = ({ contract, user, setUser }) => {
  const [yourEvents, setYourEvents] = useState([]);
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
    const fetchYourEvents = async () => {
      try {
        setLoader(true);
        const web3 = new Web3(window.ethereum);
        const Instance = new web3.eth.Contract(abi, contract);
        const result = await Instance.methods.eventCount().call();

        const yourEventsArray = [];
        for (let i = 1; i <= Number(result); i++) {
          let event = await Instance.methods.events(i).call();
          event.id = i;
          if (event.organizer.toLowerCase() === user.toLowerCase()) {
            yourEventsArray.push(event);
          }
        }

        setYourEvents(yourEventsArray);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.error('Error fetching your events:', error);
      }
    };

    fetchYourEvents();
  }, [contract, user]);

  const handleEndEvent = async (id) => {
    try {
      setLoader(true);
      const web3 = new Web3(window.ethereum);
      const Instance = new web3.eth.Contract(abi, contract);
      await Instance.methods.endEvent(id).send({ from: user });
      alert(`Event ${id} ended successfully`);
      // After ending the event, update the list of events
      const updatedEvents = yourEvents.map((event) => {
        if (event.id === id) {
          return { ...event, ended: true }; // Mark the event as ended
        }
        return event;
      });
      setYourEvents(updatedEvents);
    } catch (error) {
      console.error('Error ending event:', error);
      alert(`Failed to end event ${id}: ${error.message}`);
    } finally {
      setLoader(false);
    }
  };

  return (
    <EventsContainer>
      {loader && <Loader src={gif} alt="Loading..." />} {/* Render loader if loader state is true */}
      <MenuContainer>
        <Menu contract={contract} user={user} />
      </MenuContainer>
      <h1>Your Events</h1>
      {yourEvents.length > 0 ? (
        yourEvents.map((event, index) => (
          <EventCard key={index}>
            <h2>{event.name}</h2>
            <p>Location: {event.location}</p>
            <p>Mobile Number: {event.mobileNumber}</p>
            <p>Start: {new Date(Number(event.startTime) * 1000).toLocaleString()}</p>
            <p>End: {new Date(Number(event.endTime) * 1000).toLocaleString()}</p>
            {event.ended ? (
              <StyledButton disabled>Event Ended</StyledButton>
            ) : (
              <StyledButton onClick={() => handleEndEvent(event.id)}>End Event</StyledButton>
            )}
          </EventCard>
        ))
      ) : (
        <NoEvents>No events found</NoEvents>
      )}
    </EventsContainer>
  );
};

const Loader = styled.img`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const MenuContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const EventsContainer = styled.div`
  padding: 20px;
  background-color: #357266;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
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

const StyledButton = styled.button`
  background-color: #2e7d32;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin-top: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #1b5e20;
  }
`;

const NoEvents = styled.p`
  color: #555;
  font-size: 1.2rem;
  margin-top: 20px;
`;

export default YourEvents;
