import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCardItem({trip}) {
        const [photoURL, setPhotoURL] = useState();
        useEffect(()=>{
           trip && GetPlacePhoto();
        }, [trip]);
    
        const GetPlacePhoto = async()=>{
            const data = {
                textQuery:trip?.userSelection?.location?.label
            }
            const result = await GetPlaceDetails(data).then(resp=>{
                console.log(resp.data);
                console.log(resp.data.places[0].id);
                console.log(resp.data.places[0].photos[8].name);
    
                const PhotoURL = PHOTO_REF_URL.replace('{NAME}', resp.data.places[0].photos[8].name);
                console.log(PhotoURL);
                setPhotoURL(PhotoURL);
            })
        }
  return (
    <Link to={'/view-trip/'+trip.id}>
    <div className='hover:scale-105 transition-all'>
        <img src={photoURL?photoURL:'/placeholder.jpg'}  
        className="object-cover rounded-xl h-[220px]"/>
        <div>
            <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
            <h2 className='text-sm text-gray-500'>{trip?.userSelection.noOfDays} 2 Days trip with {trip?.userSelection?.budget}</h2>
        </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem