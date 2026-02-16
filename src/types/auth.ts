export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResult = {
  accessToken: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type RegisterResult = {
  id: string;
  username: string;
  email: string;
};


