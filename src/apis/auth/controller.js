import crypto from "crypto";
import { clean_user_object } from "../user/util.js";
import { compare_hash_string, generate_jwt } from "./util.js";
import { create_user, read_user_by_email } from "../user/crud.js";
import {custom_error} from  "../../core/customerror.js"


export const register = async (req, res) => {
    try {
  
    const { first_name, last_name, email, password, role } = req.body;

    let user_id = crypto.randomUUID()
    let user = await create_user(user_id,first_name,last_name, email, password, role) 
    if(!user) throw new custom_error("Unable to create user", "09")

    user = clean_user_object(user)
      
    return res.status(200).json({
    code: 200,
    response_code: "00",
    status: "success",
    message: `User registered successfully`,
    data: {
        user
    },
    });
  
    } catch (err) {
      return res.status(400).json({
        code: 400,
        response_code: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally {
  
    }
  }

  export const login = async (req, res) => {
    try {
  
    const {  email, password } = req.body;

    let user = await read_user_by_email(email)
    if (!user)throw new custom_error("Account not found", "10")

    if(!await compare_hash_string(password, user.password)) throw new custom_error("Invalid/Incorrect credentials provided", "15")
    
    let token = generate_jwt({user_id : user.user_id, role : user.role})
    user = clean_user_object(user)
      
  
    return res.status(200).json({
    code: 200,
    response_code: "00",
    status: "success",
    message: `login successful`,
    data: {
        token,
        user
    },
    });
  
    } catch (err) {
      return res.status(400).json({
        code: 400,
        response_code: err.code,
        status: "failed",
        message: err.message,
        error: "An Error Occured!",
      });
    } finally {
  
    }
  }