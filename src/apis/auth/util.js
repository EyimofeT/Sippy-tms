import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getenv } from "../../core/read_env.js";

export function generate_jwt(data,expires_in,JWT_SECRET_KEY) {
    if(!expires_in) expires_in=getenv("JWT_EXPIRES_IN")
    if(!JWT_SECRET_KEY) JWT_SECRET_KEY = getenv("JWT_SECRET_KEY");
    const token = jwt.sign(data, JWT_SECRET_KEY, {
      expiresIn: expires_in,
    });
    return token;
  }

  export async function is_token_valid(token, JWT_SECRET_KEY){
    try {
      if(!JWT_SECRET_KEY) JWT_SECRET_KEY = getenv("JWT_SECRET_KEY");
      const data = jwt.verify(token, JWT_SECRET_KEY);
      return data;
    } catch (err) {
      return false;
    } finally {
    }
  }

  export async function hash_string(key) {
    const hash = await bcrypt.hash(key, getenv("BCRYPT_HASH_SALT_VALUE"));
    return hash;
  }
  
  
  export async function compare_hash_string(input, stored){
    try{
      if(!await bcrypt.compare(input,stored)) return false
      return true
    }
    catch{
      return false
    }
  }
  