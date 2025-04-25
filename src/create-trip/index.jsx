import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from "@/constants/options";
import { chatSession } from "@/service/AIModal";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Success:", tokenResponse);
      GetUserProfile(tokenResponse);
    },
    onError: (error) => {
      console.error("Login Error:", error);
    },
  });
  

  const onGenerateTrip = async () => {
    const days = Number(formData.noOfDays);
    if (
      !formData?.noOfDays ||
      days <= 0 ||
      days > 5 ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveller
    ) {
      toast("Please fill all required fields properly (Days: 1–5).");
      return;
    }

    setLoading(true);


    const user = localStorage.getItem('user');
    if(!user){
      setOpenDialog(true);
      return;
    }

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location?.label)
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveller)
      .replace("{budget}", formData?.budget);

    console.log("Prompt:", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = result.response.text();
      console.log("AI Response:", responseText);
      setLoading(false);
      SaveAITrip(responseText);
    } catch (err) {
      console.error("Failed to generate trip:", err);
      toast("Something went wrong while generating the trip.");
    }
  };

  const SaveAITrip=async(TripData)=>{
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), 
    {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id:docId,
    });
    setLoading(false);
    navigate('/view-trip/'+docId);
  }

  const GetUserProfile = (tokenInfo) =>{
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo?.access_token}`,{
      headers:{
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
  }).then((resp)=>{
    console.log("Data is being checked");
    console.log(resp);
    localStorage.setItem('user', JSON.stringify(resp.data));
    setOpenDialog(false);
    onGenerateTrip();
  })
  }

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences🏕️🌴</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        {/* Destination Input */}
        <div>
          <h2 className="text-xl my-3 font-medium">What is the destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              value: place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        {/* Days Input */}
        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
          <Input
            placeholder="Ex. 3"
            type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        {/* Budget Options */}
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is Your Budget?
            <br />
            The budget is exclusively allocated for activities and dining purposes.
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                className={`p-3 border cursor-pointer rounded-lg hover:shadow-lg flex flex-col gap-1 ${
                  formData?.budget === item.title && "shadow-lg border-black"
                }`}
                onClick={() => handleInputChange("budget", item.title)}
              >
                <h2 className="text-4xl my-2">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler Options */}
        <div>
          <h2 className="text-xl my-3 font-medium">Who are you traveling with?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                className={`p-3 border cursor-pointer rounded-lg hover:shadow-lg flex flex-col gap-1 ${
                  formData?.traveller === item.people && "shadow-lg border-black"
                }`}
                onClick={() => handleInputChange("traveller", item.people)}
              >
                <h2 className="text-4xl my-2">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Trip Button */}
      <div className="my-10 justify-end flex">
        <Button onClick={onGenerateTrip}
        disabled={loading}>
        {loading?<AiOutlineLoading3Quarters className="h-7 w-7 animate-spin"/>:"Generate Trip"}</Button>
      </div>
      <Dialog open={openDialog}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent  className="bg-white rounded-lg">
          <DialogHeader>
            {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
            <DialogDescription>
              <img src="/logo.svg"/>
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the App with Google authentication securely</p>
              <Button className="w-full mt-5 flex gap-4 items-center"
              // disabled={loading}
              onClick={login}>
              <FcGoogle className="h-7 w-7"/>Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
