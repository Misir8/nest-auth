import * as dotenv from 'dotenv';

dotenv.config();

class Config {
  readonly JWT_KEY = process.env.JWTKEY;
  readonly TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;
  readonly BEARER = process.env.Bearer;
}

export const config = new Config();
