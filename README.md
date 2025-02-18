# ToDo Application

A simple and efficient ToDo application built with Next.js, React, and TypeScript. This application supports task management and state persistence, providing a seamless user experience.

## Objective

Develop a ToDo application that allows users to manage tasks efficiently with features like task creation, editing, deletion, and state persistence.

## Features

### Core Functionalities

- **Task Management**

  - Create, edit, delete, and mark tasks as complete/incomplete.
  - Move tasks to the appropriate section when marked as complete/incomplete.
  - Display a confirmation modal before deleting a task.

- **State Management**

  - Utilize React Context API / Zustand / Redux for managing application state.
  - Persist tasks using `localStorage` to ensure data is saved across sessions.

- **Validations & Error Handling**
  - Prevent duplicate task names.
  - Ensure task descriptions are non-empty.
  - Handle invalid inputs, such as empty task titles.
  - Implement a global error boundary to catch unexpected errors.

### Advanced Features

- **Drag & Drop Sorting**
  - Allow users to reorder tasks within each section using drag-and-drop functionality.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mshahzaib101/todo-app.git
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This will create an optimized build in the `out` directory.

### Testing

To run tests, use:

```bash
npm test
```

## Project Structure

- `pages/`: Contains the Next.js pages for routing.
- `components/`: Reusable React components.
\- `store/`: Zustand or Redux store configuration.
- `utils/`: Utility functions and helpers.
- `styles/`: CSS and styling files.
- `public/`: Static files and assets.


## License

This project is licensed under the MIT License.
