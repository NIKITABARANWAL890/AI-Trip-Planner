import React from 'react';
import PlaceCardItem from './PlaceCardItem';

  function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.itinerary;

  return (
    <div>
      <h2 className='font-bold text-lg mb-2'>Places to visit</h2>

      {itinerary && typeof itinerary === 'object' ? (
        <div className='space-y-4'>
          {Object.entries(itinerary).map(([dayKey, places], index) => (
            <div key={index} className='mt-5'>
              <h2 className='font-medium text-lg'>Day {index + 1}</h2>
              <div className='grid md:grid-cols-2 gap-5'>
                {Array.isArray(places) ? (
                  places.map((place, ind) => (
                    <div key={ind}>
                      <h2 className='font-medium text-sm text-orange-600'>{place.timeToTravel}</h2>
                      <PlaceCardItem place={place} />
                    </div>
                  ))
                ) : (
                  <div>
                    <h2 className='font-medium text-sm text-orange-600'>{places?.timeToTravel}</h2>
                    <PlaceCardItem place={places} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className='text-gray-500'>No itinerary data available.</p>
      )}
    </div>
  );
}

export default PlacesToVisit;
