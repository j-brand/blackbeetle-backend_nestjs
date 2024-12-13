# Blackbeetle Backend API

Welcome to the Blackbeetle Backend API! This project serves as the backend for the Blackbeetle application, providing a robust and scalable API to manage and interact with various resources within the system.

## Overview

The Blackbeetle Backend API is built using Node.js and NestJS, leveraging TypeScript for type safety and maintainability. It utilizes TypeORM for database interactions and BullMQ for handling background jobs and queues. The API is designed to be modular, making it easy to extend and maintain.

## Features

- **User Management**: Create, update, and manage user accounts.
- **Story Management**: Create, update, and manage stories, including support for pagination and filtering.
- **Post Management**: Create, update, and manage posts within stories, including support for media attachments.
- **Comment System**: Add and manage comments on posts.
- **Background Jobs**: Handle background tasks and queues using BullMQ.
- **Data Seeding**: Seed the database with initial data for development and testing purposes.
- **Serialization and Validation**: Ensure data integrity and security using class-transformer and class-validator.

