import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';
import React, { useEffect, useState } from 'react';
import { FaShare } from "react-icons/fa";


function InfoSection({trip}) {
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
    <div>
        <img src={photoURL} className='h-[500px] w-full object-cover rounded-xl'/>
        <div className='flex justify-between items-center'>
            <div className='my-5 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl'>
                    {trip?.userSelection?.location?.label}
                </h2>
                <div className='hidden sm:flex gap-5'>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>📆 {trip.userSelection?.noOfDays} Day</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰 {trip.userSelection?.budget} Budget</h2>
                    <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🧑‍🤝‍🧑 No. of Traveller: {trip.userSelection?.traveller} People</h2>
                </div>
            </div>
            <Button><FaShare /> Share</Button>
        </div>
    </div>
  )
}

export default InfoSection