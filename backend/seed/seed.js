import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import Task from '../src/models/Task.js';
import { addDays, getWeekStart, todayString } from '../src/utils/week.js';

const today = todayString();
const thisWeekStart = getWeekStart(today);
const lastWeekStart = addDays(thisWeekStart, -7);
const nextWeekStart = addDays(thisWeekStart, 7);
const twoWeeksAgoStart = addDays(thisWeekStart, -14);

const seedTasks = [
  {
    title: 'Finishing Wireframe',
    description: 'Complete the final wireframe for the mobile dashboard.',
    date: today,
    startTime: '09:00',
    endTime: '10:30',
    priority: 'high',
    status: 'completed',
  },
  {
    title: 'Meeting with team',
    description: 'Weekly sync with the product and design team.',
    date: today,
    startTime: '11:00',
    endTime: '12:00',
    priority: 'medium',
    status: 'in-progress',
  },
  {
    title: 'Buy a cat food',
    description: 'Order the usual brand from the pet store.',
    date: today,
    startTime: '14:00',
    endTime: '14:30',
    priority: 'low',
    status: 'completed',
  },
  {
    title: 'Finishing daily commission',
    description: 'Wrap up all client commissions due today.',
    date: today,
    startTime: '16:00',
    endTime: '18:00',
    priority: 'high',
    status: 'completed',
  },
  {
    title: 'Doing Homework',
    description: 'Finish the responsive layout exercise.',
    date: addDays(today, 1),
    startTime: '10:00',
    endTime: '11:30',
    priority: 'medium',
    status: 'in-progress',
  },
  {
    title: 'Design review session',
    description: 'Review the latest Figma flows with the design team.',
    date: addDays(today, 2),
    startTime: '15:00',
    endTime: '16:00',
    priority: 'high',
    status: 'in-progress',
  },
  {
    title: 'Grocery run',
    description: 'Restock fruits, snacks and coffee.',
    date: addDays(today, 3),
    startTime: '18:00',
    endTime: '19:00',
    priority: 'low',
    status: 'in-progress',
  },
  {
    title: 'Read 20 pages',
    description: 'Continue reading the design systems book.',
    date: addDays(thisWeekStart, 1),
    startTime: '21:00',
    endTime: '22:00',
    priority: null,
    status: 'completed',
  },
  {
    title: 'Review pull requests',
    description: 'Review and merge pending frontend pull requests.',
    date: addDays(thisWeekStart, 6),
    startTime: '18:00',
    endTime: '19:00',
    priority: 'medium',
    status: 'in-progress',
  },
  {
    title: 'Submit weekly report',
    description: 'Send the weekly progress report to the manager.',
    date: addDays(lastWeekStart, 4),
    startTime: '17:00',
    endTime: '17:30',
    priority: 'high',
    status: 'completed',
  },
  {
    title: 'Prepare client presentation',
    description: 'Build the slide deck for the client kick-off call.',
    date: addDays(lastWeekStart, 1),
    startTime: '10:00',
    endTime: '11:30',
    priority: 'high',
    status: 'completed',
  },
  {
    title: 'Update portfolio',
    description: 'Add the latest mobile app case study.',
    date: addDays(lastWeekStart, 2),
    startTime: '19:00',
    endTime: '20:00',
    priority: 'medium',
    status: 'in-progress',
  },
  {
    title: 'Plan sprint backlog',
    description: 'Prepare tickets and estimates for the next sprint.',
    date: nextWeekStart,
    startTime: '09:30',
    endTime: '11:00',
    priority: 'high',
    status: 'in-progress',
  },
  {
    title: 'Gym session',
    description: 'Leg day at the neighbourhood gym.',
    date: addDays(nextWeekStart, 2),
    startTime: '07:00',
    endTime: '08:00',
    priority: 'low',
    status: 'in-progress',
  },
  {
    title: 'Call the dentist',
    description: 'Schedule a routine dental check-up.',
    date: addDays(nextWeekStart, 4),
    startTime: '13:00',
    endTime: null,
    priority: null,
    status: 'in-progress',
  },
  {
    title: 'Pay electricity bill',
    description: 'Settle the monthly electricity invoice.',
    date: addDays(twoWeeksAgoStart, 3),
    startTime: '12:00',
    endTime: '12:30',
    priority: 'medium',
    status: 'completed',
  },
  {
    title: 'Backup laptop',
    description: 'Run a full backup to the external drive.',
    date: addDays(twoWeeksAgoStart, 5),
    startTime: '20:00',
    endTime: '21:00',
    priority: 'low',
    status: 'completed',
  },
];

const seed = async () => {
  await connectDB();

  const { deletedCount } = await Task.deleteMany({});
  console.log(`Removed ${deletedCount} existing task(s).`);

  const tasks = await Task.create(seedTasks);
  const weekCount = new Set(tasks.map((task) => task.weekStart)).size;

  console.log(`Seeded ${tasks.length} tasks across ${weekCount} week(s).`);
  await mongoose.connection.close();
  console.log('Seed complete.');
};

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
