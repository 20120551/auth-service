export type GetUsersDTO = {
  page?: number;
  per_page?: number;
  q?: string;
};

export type CreateUserDTO = {
  email: string;
  phone_number: string;
  user_metadata: {
    [index: string]: unknown;
  };
};
