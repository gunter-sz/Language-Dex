import { createContext, useContext } from "react";
import { UserData } from "../data";

export type SetUserDataCallback = (
  data: UserData | ((data: UserData) => UserData)
) => void;

export const UserDataContext = createContext<[UserData, SetUserDataCallback]>(
  null!
);
export function useUserDataContext() {
  return useContext(UserDataContext);
}
