// import { Button } from '@/components/ui/button';
// import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';
// import React, { useEffect, useState } from 'react';
// import { FaMapLocationDot } from "react-icons/fa6";
// import { Link } from 'react-router-dom';

// function PlaceCardItem({place}) {
//     const [photoURL, setPhotoURL] = useState();
  
//     useEffect(() => {
//       place && GetPlacePhoto();
//     }, [place]);
  
//     const GetPlacePhoto = async () => {
//       const data = {
//         textQuery: place.placeName
//       };
  
//       try {
//         const resp = await GetPlaceDetails(data);
//         console.log(resp.data);
  
//         const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
//         if (photoName) {
//           const PhotoURL = PHOTO_REF_URL.replace("{NAME}", photoName);
//           console.log(PhotoURL);
//           setPhotoURL(PhotoURL);
//         }
//       } catch (error) {
//         console.error("Error fetching photo:", error);
//       }
//     };
//   return (
//     <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.placeName} target='_blank'>
//       <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
//           <img src={photoURL?photoURL:'/placeholder.jpg'} className='w-[130px] h-[130px] rounded-xl object-cover'/>
//           <div className='flex flex-col gap-1'>
//               <h2 className='font-bold text-lg'>{place.placeName}</h2>
//               <p className='text-sm text-gray-400'>{place.placeDetails}</p>
//               <h2 className='mt-2'>🕑 {place.timeToTravel}</h2>
//           </div>
//       </div>
//     </Link>
//   )
// }

// export default PlaceCardItem

import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';
import React, { useEffect, useState } from 'react';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
  const [photoURL, setPhotoURL] = useState();

  useEffect(() => {
    console.log("Place prop inside useEffect:", place);
    if (place?.placeName) {
      GetPlacePhoto();
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    console.log("Running GetPlacePhoto");
    const query = place?.placeName;
    if (!query) {
      console.error("Missing place name");
      return;
    }

    const data = { textQuery: query };

    try {
      const resp = await GetPlaceDetails(data);
      console.log("Place details response:", resp.data);

      const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName);
        console.log("Generated Photo URL:", photoUrl);
        setPhotoURL(photoUrl);
      } else {
        console.warn("No photo found for place:", place.placeName);
      }
    } catch (error) {
      console.error("Error fetching photo:", error.response?.data || error.message);
    }
  };

  return (
    <Link
      to={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place?.placeName)}
      target='_blank'
    >
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        <img
          src={photoURL || '/placeholder.jpg'}
          alt='Place'
          className='w-[130px] h-[130px] rounded-xl object-cover'
        />
        <div className='flex flex-col gap-1'>
          <h2 className='font-bold text-lg'>{place.placeName}</h2>
          <p className='text-sm text-gray-400'>{place.placeDetails}</p>
          <h2 className='mt-2'>🕑 {place.timeToTravel}</h2>
          {/* <Button className="w-10 h-10 rounded-full flex items-center justify-center border">
            <FaMapLocationDot />
          </Button> */}
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
