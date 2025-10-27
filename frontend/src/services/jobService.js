import { fetchJSON } from './api';

export const getJobs = () => fetchJSON('/jobs');
