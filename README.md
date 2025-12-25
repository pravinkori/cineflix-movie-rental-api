# Cineflix Movie Rental API

Cineflix Movie Rental API is a Node.js-based REST API for managing movie-related information, including genres, movies, customers, rentals, users, authentication, and returns.

## Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Getting Started](#getting-started)
    -   [Installation](#installation)
    -   [Run the Application](#run-the-application)
-   [Testing](#testing)
-   [API Endpoints](#api-endpoints)

## Overview

Cineflix Movie Rental API provides a set of endpoints for interacting with movie-related data, enabling users to perform actions such as retrieving genres, movies, and customer information, managing rentals, authenticating users, and handling movie returns.

## Features

-   Retrieve information about genres, movies, customers, and rentals.
-   Manage movie rentals, user authentication, and returns.
-   Secure and authenticated access to certain endpoints.
-   Easily extendable and customizable.

## Prerequisites

-   Node.js installed on your machine.
-   MongoDB database for data storage.

## Getting Started

### Installation

Clone the repository and install dependencies.

```bash
git clone <repository-url>
cd cineflix-movie-rental-api
npm install
```

## Run the Application

Start the API server.

```bash
npm start
```

## Testing

Run the provided test suite to ensure the functionality of the API.

```bash
npm test
```

# API Endpoints

Cineflix Movie Rental API provides several endpoints for managing movie-related information. Below is a comprehensive list of available endpoints, along with their methods, purposes, and expected request and response formats.

## 1. Genres

### 1.1 Retrieve All Genres

-   **Endpoint**: `/api/genres`
-   **Method**: GET
-   **Description**: Retrieve a list of all genres.
-   **Response Format**: JSON Array of Genres.

### 1.2 Add New Genre

-   **Endpoint**: `/api/genres`
-   **Method**: POST
-   **Description**: Add a new genre.
-   **Request Format**: JSON Object with `name` property.
-   **Response Format**: JSON Object representing the newly added genre.

## 2. Movies

### 2.1 Retrieve All Movies

-   **Endpoint**: `/api/movies`
-   **Method**: GET
-   **Description**: Retrieve a list of all movies.
-   **Response Format**: JSON Array of Movies.

### 2.2 Add New Movie

-   **Endpoint**: `/api/movies`
-   **Method**: POST
-   **Description**: Add a new movie.
-   **Request Format**: JSON Object with movie details.
-   **Response Format**: JSON Object representing the newly added movie.

## 3. Customers

### 3.1 Retrieve All Customers

-   **Endpoint**: `/api/customers`
-   **Method**: GET
-   **Description**: Retrieve a list of all customers.
-   **Response Format**: JSON Array of Customers.

### 3.2 Add New Customer

-   **Endpoint**: `/api/customers`
-   **Method**: POST
-   **Description**: Add a new customer.
-   **Request Format**: JSON Object with customer details.
-   **Response Format**: JSON Object representing the newly added customer.

## 4. Rentals

### 4.1 Retrieve All Rentals

-   **Endpoint**: `/api/rentals`
-   **Method**: GET
-   **Description**: Retrieve a list of all rentals.
-   **Response Format**: JSON Array of Rentals.

### 4.2 Rent a Movie

-   **Endpoint**: `/api/rentals`
-   **Method**: POST
-   **Description**: Rent a movie.
-   **Request Format**: JSON Object with rental details.
-   **Response Format**: JSON Object representing the newly created rental.

## 5. Users

### 5.1 Retrieve User Details

-   **Endpoint**: `/api/users`
-   **Method**: GET
-   **Description**: Retrieve user details.
-   **Response Format**: JSON Object representing user details.

### 5.2 Add New User

-   **Endpoint**: `/api/users`
-   **Method**: POST
-   **Description**: Add a new user.
-   **Request Format**: JSON Object with user details.
-   **Response Format**: JSON Object representing the newly added user.

## 6. Authentication

### 6.1 Authenticate User

-   **Endpoint**: `/api/auth`
-   **Method**: POST
-   **Description**: Authenticate a user and generate an authentication token.
-   **Request Format**: JSON Object with `email` and `password` properties.
-   **Response Format**: JSON Object containing the authentication token.

## 7. Returns

### 7.1 Handle Movie Returns

-   **Endpoint**: `/api/returns`
-   **Method**: POST
-   **Description**: Handle movie returns.
-   **Request Format**: JSON Object with rental ID.
-   **Response Format**: JSON Object representing the returned movie details.

---

**Note**: Certain endpoints require authentication. Ensure you have obtained an authentication token by logging in via the `/api/auth` endpoint before accessing authenticated endpoints.

Feel free to explore each endpoint for specific details about request and response formats.
