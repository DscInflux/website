import { useContext, createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "@/hooks/useSWR";
import axios from "axios";
import influxConfig from "../configurations/influx.config";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  let router = useRouter();

  const { data } = useSWR("/v1/auth/@me");
  const user = data?.data;

  const logout = () => {
    axios.get("/v1/auth/logout").then(() => {
      router.reload();
    });
  };

  let [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (influxConfig.authRequired.includes(router.pathname)) {
      setIsLoading(true);
      if (data) {
        if (!user) {
          router.push("/v1/auth/login?next=" + router.pathname);
        } else {
          setIsLoading(false);
        }
      }
    }
  }, [router, router.pathname, user, data]);

  return (
    <UserContext.Provider value={{ user, logout }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="pointer-events-none text-black dark:text-white font-semibold text-2xl animate-pulse">
            Discord<span className="text-primary"></span>Influx
          </p>
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
};
