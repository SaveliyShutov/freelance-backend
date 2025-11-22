import mongoose from 'mongoose';

export interface UserFromClient {
  email: string;
  password: string;
  employer_avatar?: string;
  employer_name?: string;
  employer_surname?: string;
  employer_shortDescription?: string;
  employer_description?: string;
  employer_address?: string;
  employer_contacts?: string;
  worker_name?: string;
  worker_surname?: string;
  worker_avatar?: string;
  worker_description?: string;
  worker_address?: string;
  worker_phone?: string;
}
