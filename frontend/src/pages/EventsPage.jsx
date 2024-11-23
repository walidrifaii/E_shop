import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/layouts/Header";
import Loader from "../components/layouts/loader";
import EventCard from "../components/Route/Events/EventsCard";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {
            allEvents.length !== 0 && (
              <EventCard data={allEvents && allEvents[0]}/>
            )
          }
        </div>
      )}
    </>
  );
};

export default EventsPage;