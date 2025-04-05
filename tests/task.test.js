import request from 'supertest';
import app from '../src/app';
import path from 'path';
jest.setTimeout(200000);

import { admin_auth_token, user_auth_token, test_user, test_admin_user } from './Auth.test.js'


describe('Task Tests :', () => {

    let created_task_id = null
    const photoPath = path.join(__dirname, 'sample.jpg'); 
    const futureDate = new Date(new Date().setHours(new Date().getHours() + 24));
    // console.log(futureDate.toISOString()); 
    
    it('should create a new task with a photo', async () => {

        const res = await request(app)
          .post('/api/v1/task/create')
          .set('Authorization', `Bearer ${user_auth_token}`)
          .field('title', 'test task')
          .field('description', 'test description')
          .field('status', 'to_do')
          .field('priority', 'high')
          .field('due_date',futureDate.toISOString()) 
        //.field('assigned_to', 'e3c05ccb-e4f8-464e-a6b1-5a3cde57a78d') // 
          .attach('image', photoPath); 
    
        // console.log("Create Task Response:", res.body);
        // console.log("Create Task Response:", res.body.data.task_assignment);
    
        // Check the status code and response fields
        expect(res.status).toBe(200);
        expect(res.body.response_code).toBe("00");
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("Task created successfully");
    
        // Validate the task structure in the response
        const task = res.body.data.task.task;
        expect(task).toHaveProperty('task_id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('description');
        expect(task).toHaveProperty('status');
        expect(task).toHaveProperty('priority');
        expect(task).toHaveProperty('due_date');
        expect(task).toHaveProperty('image_url');
        expect(task).toHaveProperty('user_id');
        expect(task).toHaveProperty('created_at');
        expect(task).toHaveProperty('updated_at');
    
        // Check that the image_url is a string (assuming it returns a URL)
        expect(typeof task.image_url).toBe('string');
    
        // Validate task assignment structure
        const taskAssignment = res.body.data.task.task_assignment;
        expect(taskAssignment).toHaveProperty('id');
        expect(taskAssignment).toHaveProperty('task_id');
        expect(taskAssignment).toHaveProperty('assigned_to');
        expect(taskAssignment).toHaveProperty('assigned_at');
    
        // Ensure 'assigned_at' is a valid date string
        expect(typeof taskAssignment.assigned_at).toBe('string');
        expect(!isNaN(Date.parse(taskAssignment.assigned_at))).toBe(true);

        created_task_id = res.body.data.task.task.task_id
      });

      it('should return an error message when accessing /task/view/all without permission - using user token', async () => {
        const res = await request(app)
          .get('/api/v1/task/view/all')
          .set('Authorization', `Bearer ${user_auth_token}`); 
      
        // console.log("View All Tasks Response:", res.body);
      
        // Check that the status code is 400
        expect(res.status).toBe(400);
      
        // Validate the structure and values of the response
        expect(res.body.code).toBe(400);
        expect(res.body.response_code).toBe("17");
        // expect(res.body.status).toBe("failed");
        // expect(res.body.message).toBe("Not allowed to perform this operation");
        // expect(res.body.error).toBe("An Error Occured!");
      });

      it('should return all tasks successfully - using admin token', async () => {
        const res = await request(app)
          .get('/api/v1/task/view/all')
          .set('Authorization', `Bearer ${admin_auth_token}`); // Replace with a valid auth token
      
        // console.log("All Tasks Response:", res.body);
      
        // Check that the status code is 200
        expect(res.status).toBe(200);
      
        // Validate the response structure and values
        expect(res.body.code).toBe(200);
        expect(res.body.response_code).toBe("00");
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("All Tasks fetched successfully");
      
        // Validate that the `data` field contains an array of tasks
        expect(Array.isArray(res.body.data.tasks)).toBe(true);
      
        if (res.body.data.tasks.length > 0) {
          // Validate that each object within the tasks array has the correct properties
          res.body.data.tasks.forEach((task) => {
            expect(task).toHaveProperty('task_id');
            expect(task).toHaveProperty('title');
            expect(task).toHaveProperty('description');
            expect(task).toHaveProperty('status');
            expect(task).toHaveProperty('due_date');
            expect(task).toHaveProperty('image_url');
            expect(task).toHaveProperty('created_at');
            expect(task).toHaveProperty('updated_at');
            
            // Validate the user object within a task
            expect(task.user).toHaveProperty('user_id');
            expect(task.user).toHaveProperty('first_name');
            expect(task.user).toHaveProperty('last_name');
            expect(task.user).toHaveProperty('email');
            expect(task.user).toHaveProperty('role');
      
            // Validate the assignments object within a task
            expect(task.assignments).toHaveProperty('assigned_to');
            expect(task.assignments).toHaveProperty('assigned_at');
            expect(task.assignments.user).toHaveProperty('user_id');
            expect(task.assignments.user).toHaveProperty('first_name');
            expect(task.assignments.user).toHaveProperty('last_name');
            expect(task.assignments.user).toHaveProperty('email');
            expect(task.assignments.user).toHaveProperty('role');
          });
        } else {
          // If no tasks exist, the response should still be valid
          expect(res.body.data.tasks.length).toBe(0);
        }
      });
      
      it('should return tasks created successfully', async () => {
        const res = await request(app)
          .get('/api/v1/task/view/created')
          .set('Authorization', `Bearer ${user_auth_token}`); // Replace with a valid auth token
      
        // console.log("Tasks Created Response:", res.body);
      
        // Check that the status code is 200
        expect(res.status).toBe(200);
      
        // Validate the response structure and values
        expect(res.body.code).toBe(200);
        expect(res.body.response_code).toBe("00");
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("Tasks created fetched successfully");
      
        // Validate that the `data` field contains an array of tasks
        expect(Array.isArray(res.body.data.tasks)).toBe(true);
      
        if (res.body.data.tasks.length > 0) {
          // Validate only the keys of the tasks, without checking the values
          res.body.data.tasks.forEach((task) => {
            // Validate top-level task keys
            expect(task).toHaveProperty('task_id');
            expect(task).toHaveProperty('title');
            expect(task).toHaveProperty('description');
            expect(task).toHaveProperty('status');
            expect(task).toHaveProperty('due_date');
            expect(task).toHaveProperty('image_url');
            expect(task).toHaveProperty('created_at');
            expect(task).toHaveProperty('updated_at');
      
            // Validate the user object within a task
            expect(task.user).toHaveProperty('user_id');
            expect(task.user).toHaveProperty('first_name');
            expect(task.user).toHaveProperty('last_name');
            expect(task.user).toHaveProperty('email');
            expect(task.user).toHaveProperty('role');
      
            // Validate the assignments object within a task
            expect(task.assignments).toHaveProperty('assigned_to');
            expect(task.assignments).toHaveProperty('assigned_at');
            expect(task.assignments.user).toHaveProperty('user_id');
            expect(task.assignments.user).toHaveProperty('first_name');
            expect(task.assignments.user).toHaveProperty('last_name');
            expect(task.assignments.user).toHaveProperty('email');
            expect(task.assignments.user).toHaveProperty('role');
          });
        } else {
          // If no tasks exist, the response should still be valid
          expect(res.body.data.tasks.length).toBe(0);
        }
      });

      it('should return tasks assigned successfully', async () => {
        const res = await request(app)
          .get('/api/v1/task/view/assigned')
          .set('Authorization', `Bearer ${user_auth_token}`); // Replace with a valid auth token
      
        // console.log("Tasks Assigned Response:", res.body);
      
        // Check that the status code is 200
        expect(res.status).toBe(200);
      
        // Validate the response structure and values
        expect(res.body.code).toBe(200);
        expect(res.body.response_code).toBe("00");
        expect(res.body.status).toBe("success");
        // expect(res.body.message).toBe("Tasks assigned fetched successfully");
      
        // Validate that the `data` field contains an array of tasks
        expect(Array.isArray(res.body.data.tasks)).toBe(true);
      
        if (res.body.data.tasks.length > 0) {
          // Validate only the keys of the tasks, without checking the values
          res.body.data.tasks.forEach((task) => {
            // Validate top-level task keys
            expect(task).toHaveProperty('task_id');
            expect(task).toHaveProperty('title');
            expect(task).toHaveProperty('description');
            expect(task).toHaveProperty('status');
            expect(task).toHaveProperty('due_date');
            expect(task).toHaveProperty('image_url');
            expect(task).toHaveProperty('created_at');
            expect(task).toHaveProperty('updated_at');
      
            // Validate the user object within a task
            expect(task.user).toHaveProperty('user_id');
            expect(task.user).toHaveProperty('first_name');
            expect(task.user).toHaveProperty('last_name');
            expect(task.user).toHaveProperty('email');
            expect(task.user).toHaveProperty('role');
      
            // Validate the assignments object within a task
            expect(task.assignments).toHaveProperty('assigned_to');
            expect(task.assignments).toHaveProperty('assigned_at');
            expect(task.assignments.user).toHaveProperty('user_id');
            expect(task.assignments.user).toHaveProperty('first_name');
            expect(task.assignments.user).toHaveProperty('last_name');
            expect(task.assignments.user).toHaveProperty('email');
            expect(task.assignments.user).toHaveProperty('role');
          });
        } else {
          // If no tasks exist, the response should still be valid
          expect(res.body.data.tasks.length).toBe(0);
        }
      });

      it('should update task successfully with the provided data', async () => {
        
        const response = await request(app)
        .patch(`/api/v1/task/update?task_id=${created_task_id}`)
        .set('Authorization', `Bearer ${user_auth_token}`)
        .field('title', 'test task updated')
        .field('description', 'test description updated')
        .field('status', 'to_do')
        .field('priority', 'high')
        .field('due_date',futureDate.toISOString()) 
        .attach('image', photoPath); 

        // Check the response status code
        expect(response.status).toBe(200);

        // Check the response structure and content
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('response_code', '00');
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Task updated successfully');

        expect(response.body.data).toHaveProperty('task');
        const updatedTask = response.body.data.task;


    });

    it('should delete task successfully with the provided data', async () => {
        
        const response = await request(app)
        .delete(`/api/v1/task/delete?task_id=${created_task_id}`)
        .set('Authorization', `Bearer ${user_auth_token}`)
       
        // Check the response status code
        expect(response.status).toBe(200);

        // Check the response structure and content
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('response_code', '00');
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message', 'Task deleted successfully');

        
    });
      
})