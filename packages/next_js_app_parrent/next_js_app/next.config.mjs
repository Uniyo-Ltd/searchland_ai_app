/** @type {import('next').NextConfig} */
import dotenv from 'dotenv';

const nextConfig = {
  env: {
    DATABASE_URL: 'postgresql://postgres:@localhost:5432/searchlandai',
  },
};

export default dotenv.config().parsed ? nextConfig : {};