import { Worker } from 'bullmq';
import { redisConnection, queueNames } from './config';

// Create worker for problem-created queue
const problemCreatedWorker = new Worker(queueNames.PROBLEM_CREATED, async (job) => {
  // Handle problem created event
  console.log('Problem created:', job.data);
  // Implement your logic here
  
  return { processed: true };
}, { connection: redisConnection });

// Error handling
problemCreatedWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});

export const initConsumers = () => {
  console.log('Auth service consumers initialized');
};