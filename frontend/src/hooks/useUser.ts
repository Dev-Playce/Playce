import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../api/user.api";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["myInfo"],
    queryFn: getMyInfo
  });
};