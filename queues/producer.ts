import { Queue } from 'bullmq';
import { redisConnection, queueNames } from './config';

// Create queues for different events
const userCreatedQueue = new Queue(queueNames.USER_CREATED, { connection: redisConnection });
const userUpdatedQueue = new Queue(queueNames.USER_UPDATED, { connection: redisConnection });

// Helper functions to add jobs to queues
export const addUserCreatedJob = async (userData: any) => {
  return await userCreatedQueue.add('create-user', userData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });
};

export const addUserUpdatedJob = async (userData: any) => {
  return await userUpdatedQueue.add('update-user', userData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });
};