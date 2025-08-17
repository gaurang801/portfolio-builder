// test('should handle JSON requests properly through express.json middleware', async () => {
//     const request = require('supertest');
//     const express = require('express');

//     const testApp = express();
//     testApp.use(express.json());

//     testApp.post('/test', (req, res) => {
//         res.json({ received: req.body });
//     });

//     const testData = { name: 'John Doe', email: 'john@example.com' };

//     const response = await request(testApp)
//         .post('/test')
//         .send(testData)
//         .expect(200);

//     expect(response.body.received).toEqual(testData);
// });

// test('should invoke error handler middleware for unhandled errors', async () => {
//     const request = require('supertest');
//     const express = require('express');

//     const testApp = express();
//     testApp.use(express.json());
//     testApp.use(express.urlencoded({ extended: true }));

//     // Add a route that throws an error
//     testApp.get('/error', (req, res, next) => {
//         const error = new Error('Test error');
//         throw error;
//     });

//     // Mock error handler middleware
//     const mockErrorHandler = jest.fn((err, req, res, next) => {
//         res.status(500).json({ error: err.message });
//     });

//     testApp.use(mockErrorHandler);

//     const response = await request(testApp)
//         .get('/error')
//         .expect(500);

//     expect(mockErrorHandler).toHaveBeenCalled();
//     expect(response.body.error).toBe('Test error');
// });
