import { fetchJSON } from './api';

export const uploadResume = (formData) => {
  // TODO: implement upload via fetch
  return fetchJSON('/resumes', { method: 'POST', body: formData });
};
