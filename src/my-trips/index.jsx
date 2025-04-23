// import React, { useEffect } from 'react'
// import { useNavigation } from 'react-router-dom';

// function MyTrips() {
//     useEffect(()=>{
//         GetUserTrips();
//     }, [])

//     const GetUserTrips = ()=>{
//         const user = localStorage.getItem('user');
//         const navigation = useNavigation();
//         if(!user){
//             navigation('/');
//             return;
//         }
//     }
//   return (
//     <div>MyTrips</div>
//   )
// }

// export default MyTrips;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/service/firebaseConfig';  // Make sure you have db set up correctly
import { collection, query, where, getDocs } from 'firebase/firestore';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips]=useState([]);

  useEffect(() => {
    const GetUserTrips = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        navigate('/'); // Redirect if no user is found in localStorage
        return;
      }

      setUserTrips([]);

      try {
        const q = query(collection(db, 'AITrips'), where('userEmail', '==', user.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          setUserTrips(prevVal=>[...prevVal, doc.data()])
        });
      } catch (error) {
        console.error("Error fetching trips: ", error);
      }
    };

    GetUserTrips();
  }, [navigate]);

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
        <h2 className='font-bold text-3xl'>My Trips</h2>
        <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
            {userTrips?.length>0?userTrips.map((trip, index)=>{
                <UserTripCardItem key={index} trip={trip}/>
            })
            :[1,2,3,4,5,6].map((item, index)=>{
                <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>
                </div>
            })
            }
        </div>
    </div>
  );
}

export default MyTrips;
