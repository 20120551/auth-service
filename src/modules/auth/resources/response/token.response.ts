export interface AccessTokenResponse {
  accessToken: string;
}

export interface PairTokenResponse extends AccessTokenResponse {
  refreshToken: string;
  expiresIn: number;
}
