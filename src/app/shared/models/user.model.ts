
export interface UserPublicData {
  nickname: string;
  avatar: string;
  role_name: string;
  role_color: string;
  }
  
 export interface UserPublicDataResponse {
    data: UserPublicData[];
  }
