import axios from "axios";

export const getLocation = async (pincode) => {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    if (response.data[0].Status === "Success") {
      const { District, State, Country } = response.data[0].PostOffice[0];
      return { city: District, state: State, country: Country };
    }
    return { city: "", state: "", country: "" };
  } catch (error) {
    console.error("Error fetching location:", error);
    return { city: "", state: "", country: "" };
  }
};
