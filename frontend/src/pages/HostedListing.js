import React from 'react';
import { tokenContext } from '../token-context';
import makeRequest from '../makeRequest';
import DetailedListingCard from '../components/DetailedListingCard';

export default function HostedListing () {
  const { getters } = React.useContext(tokenContext);
  const [fullListings, setFullListings] = React.useState([]);
  // probably have to check if its actually my listing
  React.useEffect(() => {
    makeRequest('/listings', 'get', undefined, '').then((res) => {
      if (res !== undefined) {
        return Promise.allSettled(res.listings.map((listing) => {
          return makeRequest(`/listings/${listing.id}`, 'get', undefined, getters.token).then((res) => {
            return {
              id: listing.id,
              ...res.listing
            }
          })
          // return new Promise((resolve, reject) => {
          //   resolve({
          //     id: listing.id,
          //     listingData: makeRequest(`/listings/${listing.id}`, 'get', undefined, getters.token)
          //   })
          // })
        }))
      }
    }).then((res) => {
      setFullListings(res.map(listingPromise => listingPromise.value))
    })
  }, [])
  return (
    <div>
      {fullListings.map((listing, index) => (
        <DetailedListingCard
          key={`detailedListing-${index}`}
          title={listing.title}
          type={listing.metadata.type}
          bedrooms={listing.metadata.bedrooms}
          numBathrooms={parseInt(listing.metadata.bathrooms)}
          reviews={listing.reviews}
          price={parseInt(listing.price)}
          thumbnail={listing.thumbnail}
          lId={listing.id}
        />
      ))}
    </div>
  )
}