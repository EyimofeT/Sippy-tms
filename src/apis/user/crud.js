import { PrismaClient } from "@prisma/client";
import { getenv } from "../../core/read_env.js";
import { hash_string } from "../auth/util.js";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: getenv("DATABASE_URL"),
    },
  },
});
const transaction_timeout = 200000

let user_obj = {
    user_id: true,
    email: true,
    first_name:true,
    last_name:true,
    password : true,
    role: true,
    created_at : true,
    updated_at : true
}

export async function read_user_by_email(email) {
    try{
     let user = await prisma.user.findFirst({
       where:{
        email : email.toLowerCase()
       },
       select:user_obj
      })
      if(!user) return false
      
      return user
   } catch (err) {
    console.log("Something went wrong : " + err)
     return false;
   } finally {
     await prisma.$disconnect();
   }
  }

export async function create_user(user_id,first_name, last_name, email, password, role){
    try{
        let user = await prisma.user.create({
          data:{
            user_id:user_id,
            first_name: first_name.toLowerCase(),
            last_name : last_name.toLowerCase(),
            email: email.toLowerCase(),
            password : await hash_string(password),
            role : role? role : 'user'
          }
         })
         if(!user) return false
         
         return user
      } catch (err) {
       console.log("Something went wrong in create_user : " + err)
        return false;
      } finally {
        await prisma.$disconnect();
      }
}

export async function read_user_by_user_id(user_id) {
  try{
   let user = await prisma.user.findFirst({
     where:{
      user_id
     },
     select:user_obj
    })
    if(!user) return false
    
    return user
 } catch (err) {
  console.log("Something went wrong in get_user_by_user_id: " + err)
   return false;
 } finally {
   await prisma.$disconnect();
 }
}


export async function read_all_user() {
  try{
   let user = await prisma.user.findMany({
     select:user_obj
    })
    if(!user) return false
    
    return user
 } catch (err) {
  console.log("Something went wrong in get_all_user: " + err)
   return false;
 } finally {
   await prisma.$disconnect();
 }
}

export async function read_leaderboard_data(){
  try{
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        tasks: {
          select: {
            status: true,
          },
        },
        assignments: {
          select: {
            task: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    return users
  }
  catch (err) {
    console.log("Something went wrong in read_leaderboard_data: " + err)
     return false;
   } finally {
     await prisma.$disconnect();
   }
}