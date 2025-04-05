import request from 'supertest';
import app from '../src/app';

// Set global timeout for this file
jest.setTimeout(200000); // Timeout set to 30 seconds for this test file

const test_admin_user = {
    email: "admin@gmail.com",
    first_name: "john",
    last_name: "doe",
    password: "12345",
    role: "admin"
  };
const test_user = {
    email: "user@gmail.com",
    first_name: "john",
    last_name: "doe",
    password: "12345",
    role: "user"
  };

let registered_user = null;
let admin_auth_token = null;
let user_auth_token = null


describe('Auth Tests : register and login', () => {
   
//   it('should register a new user successfully', async () => {
//     const res = await request(app)
//       .post('/api/v1/auth/register')
//       .send(test_user);

//       // Log the response for debugging
// //    console.log("Register Response:", res.body);


//     expect(res.status).toBe(200);
//     expect(res.body.response_code).toBe("00");
//     expect(res.body.status).toBe("success");
//     expect(res.body.message).toBe("User registered successfully");

//     registered_user = res.body.data.user;

//     expect(registered_user).toHaveProperty("user_id");
//     expect(registered_user.email).toBe(test_user.email);
//   });

  //Admin 
  it('should login the registered admin user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: test_admin_user.email,
        password: test_admin_user.password
      });

    expect(res.status).toBe(200);
    expect(res.body.response_code).toBe("00");
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("login successful");

    const { token, user } = res.body.data;

    expect(token).toBeDefined();
    expect(token).toMatch(/^ey/); // JWT starts with 'ey'

    expect(user.email).toBe(test_admin_user.email);
    expect(user.role).toBe(test_admin_user.role);
    expect(user.first_name).toBe(test_admin_user.first_name);
    expect(user.last_name).toBe(test_admin_user.last_name);

    admin_auth_token = token; // store for future test use
  });

  //User
  it('should login the registered user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: test_user.email,
        password: test_user.password
      });

    expect(res.status).toBe(200);
    expect(res.body.response_code).toBe("00");
    expect(res.body.status).toBe("success");
    expect(res.body.message).toBe("login successful");

    const { token, user } = res.body.data;

    expect(token).toBeDefined();
    expect(token).toMatch(/^ey/); // JWT starts with 'ey'

    expect(user.email).toBe(test_user.email);
    expect(user.role).toBe(test_user.role);
    expect(user.first_name).toBe(test_user.first_name);
    expect(user.last_name).toBe(test_user.last_name);

    user_auth_token = token; // store for future test use
  });
});

export { admin_auth_token, user_auth_token, test_user, test_admin_user };
