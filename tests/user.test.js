import request from 'supertest';
import app from '../src/app';
jest.setTimeout(200000);

import { admin_auth_token, user_auth_token, test_user, test_admin_user } from './Auth.test.js'

describe('Users Test :', () => {

    it('should fetch the admin user details successfully', async () => {
        const res = await request(app)
            .get('/api/v1/user/view')
            .set('Authorization', `Bearer ${admin_auth_token}`);

        //   console.log("Get User Response:", res.body);

        // Test the response
        expect(res.status).toBe(200);
        expect(res.body.response_code).toBe("00");
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("User fetched successfully");

        const { user } = res.body.data;

        expect(user.user_id).toBeDefined();
        expect(user.email).toBe(test_admin_user.email);
        expect(user.first_name).toBe(test_admin_user.first_name);
        expect(user.last_name).toBe(test_admin_user.last_name);
        expect(user.role).toBe(test_admin_user.role);

    });

    // it('should fetch the regular user details successfully', async () => {
    //     const res = await request(app)
    //         .get('/api/v1/user/view')
    //         .set('Authorization', `Bearer ${user_auth_token}`);

    //     //   console.log("Get User Response:", res.body);

    //     // Test the response
    //     expect(res.status).toBe(200);
    //     expect(res.body.response_code).toBe("00");
    //     expect(res.body.status).toBe("success");
    //     expect(res.body.message).toBe("User fetched successfully");

    //     const { user } = res.body.data;

    //     expect(user.user_id).toBeDefined();
    //     expect(user.email).toBe(test_user.email);
    //     expect(user.first_name).toBe(test_user.first_name);
    //     expect(user.last_name).toBe(test_user.last_name);
    //     expect(user.role).toBe(test_user.role);
    // });

    it('should fetch all users', async () => {
        const res = await request(app)
            .get('/api/v1/user/view/all')
            .set('Authorization', `Bearer ${user_auth_token}`);

        // Test the response
        expect(res.status).toBe(200);
        expect(res.body.response_code).toBe("00");
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("Users fetched successfully");

        const users = res.body.data.users;

        // Check if `users` is an array
        expect(Array.isArray(users)).toBe(true); // Ensure users is an array

        // Check that each item in `users` array matches the expected format
        const userFormat = {
            user_id: expect.any(String),
            email: expect.any(String),
            first_name: expect.any(String),
            last_name: expect.any(String),
            role: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
        };

        // Check every user in the array follows the expected structure
        expect(users.every(user => expect.objectContaining(userFormat))).toBe(true);
    });

    it('should fetch leaderboard successfully and check data types and structure', async () => {
        const res = await request(app)
          .get('/api/v1/user/leaderboard') 
          .set('Authorization', `Bearer ${user_auth_token}`);
    
        // console.log("Leaderboard Response:", res.body);
    
        expect(res.status).toBe(200);
        expect(res.body.response_code).toBe("00");
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("Leaderboard generated successfully");
    
        const leaderboard = res.body.data.leaderboard;
    
        expect(Array.isArray(leaderboard)).toBe(true);
    
        // Check that each item in `leaderboard` array matches the expected format
        const leaderboardFormat = {
          user_id: expect.any(String), 
          name: expect.any(String),
          total_tasks: expect.any(Number),
          completed_tasks: expect.any(Number),
        };
    
        // Check every item in the leaderboard array follows the expected structure
        expect(leaderboard.every(user => expect.objectContaining(leaderboardFormat))).toBe(true);
      });

});