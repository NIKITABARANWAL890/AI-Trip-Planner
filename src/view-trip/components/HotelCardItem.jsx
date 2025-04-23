import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalAPI";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function HotelCardItem({ hotel }) {
  const [photoURL, setPhotoURL] = useState();

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName
    };

    try {
      const resp = await GetPlaceDetails(data);
      console.log(resp.data);

      const photoName = resp?.data?.places?.[0]?.photos?.[0]?.name;
      if (photoName) {
        const PhotoURL = PHOTO_REF_URL.replace("{NAME}", photoName);
        console.log(PhotoURL);
        setPhotoURL(PhotoURL);
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
    }
  };

  return (
    <Link
      to={
        "https://www.google.com/maps/search/?api=1&query=" +
        hotel?.hotelName +
        "," +
        hotel?.hotelAddress
      }
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img
          src={photoURL?photoURL:'/placeholder.jpg'}
          alt={hotel?.hotelName}
          className="rounded-xl h-[180px] w-full object-cover"
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel?.hotelName}</h2>
          <h2 className="text-xs text-gray-500">📍 {hotel?.hotelAddress}</h2>
          <h2 className="text-sm">💰 {hotel?.price} per night</h2>
          <h2 className="text-sm">⭐ {hotel?.rating} stars</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;
