import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import makeRequest from '../makeRequest';
import { contextVariables } from '../contextVariables';

export default function Login () {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = React.useState([]);
  const [daysBooked, setDaysBooked] = React.useState(0);
  const [profit, setProfit] = React.useState(0);
  const { getters } = React.useContext(contextVariables);
  const posted = {}
  for (const [key, value] of searchParams.entries()) {
    posted[key] = value;
  }

  let daysOnline = 0
  let hoursOnline = 0;
  if (posted.params !== null) {
    const timeOnline = new Date() - new Date(posted.params);
    daysOnline = Math.floor(timeOnline / (1000 * 3600 * 24));
    hoursOnline = Math.floor((timeOnline / (1000 * 3600 * 24) - daysOnline) * 24);
  }

  React.useEffect(() => {
    makeRequest('/bookings', 'get', undefined, getters.token).then((res) => {
      const data = res.bookings
      if (data.length !== 0) {
        const currentBookings = data.filter(booking => booking.listingId === params.lId)
        setBookings(currentBookings);
        let dayCount = 0;
        currentBookings.forEach((booking) => {
          const days = Math.ceil(new Date(booking.dateRange.end) - new Date(booking.dateRange.start));
          dayCount += Math.ceil(days / (1000 * 3600 * 24));
        })
        setDaysBooked(dayCount);
        let profitSum = 0;
        currentBookings.forEach((booking) => {
          if (booking.status === 'accepted' && (new Date(booking.dateRange.end)).getFullYear() === (new Date()).getFullYear()) {
            profitSum += booking.totalPrice
          }
        })
        setProfit(profitSum)
      }
    })
  }, [])
  return (
    <div>
      <div>Listing has been published for {daysOnline} days and {hoursOnline} hours</div>
      <div>Is booked for {daysBooked} days</div>
      <div>Profit of {profit} dollars</div>
      <br></br><br></br>
      {bookings.map((booking, index) => (<>
        booking is {booking.id}
        <br></br>
        status is {booking.status}
        {booking.status === 'pending' && (<>
          <button
            onClick={() => {
              makeRequest(`/bookings/accept/${booking.id}`, 'put', undefined, getters.token).then((res) => {
                // Success comment here
                if (!('error' in res)) {
                  alert('Accepted booking');
                  const currentBookings = bookings
                  currentBookings.forEach((query) => {
                    if (query.id === booking.id) {
                      booking.status = 'accepted'
                      setBookings([...currentBookings]);
                      const days = Math.ceil(new Date(query.dateRange.end) - new Date(query.dateRange.start));
                      const newDays = daysBooked + Math.ceil(days / (1000 * 3600 * 24));
                      setDaysBooked(newDays);
                      setProfit(profit + booking.totalPrice);
                    }
                  })
                }
              })
            }}>
            Accept Booking
          </button>
          <button
            onClick={() => {
              makeRequest(`/bookings/decline/${booking.id}`, 'put', undefined, getters.token).then((res) => {
                // Success comment here
                if (!('error' in res)) {
                  alert('Decline booking');
                  const currentBookings = bookings
                  currentBookings.forEach((query) => {
                    if (query.id === booking.id) {
                      booking.status = 'declined'
                      setBookings([...currentBookings]);
                    }
                  })
                }
              })
            }}>
            Decline Booking
          </button>
        </>)}
        <br></br>
      </>))}
    </div>
  );
}