import { LevelEnum } from "@/components/HomePage";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

type UserDataObject = {
  scoreboard: {
    gameduration: string;
    level: LevelEnum;
  }[];
};

export default function useLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const _userData: UserDataObject = JSON.parse(Cookies.get("user_data"));
    if (userData) {
      setIsLoggedIn(true);
      setUserData(_userData);
    } else {
      setIsLoggedIn(false);
    }

    setLoading(false);
  }, []);

  return {
    loading,
    isLoggedIn,
    userData,
  };
}
