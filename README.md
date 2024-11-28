# My KaTable App

**My KaTable App** is a dynamic and customizable table application built with **React**, **TypeScript**, and **KaTable**. The app features editable columns, column renaming, column deletion, the ability to add new rows and columns, and persistent data storage using **localStorage**. It also includes a responsive design, integration with **Material UI** for UI components, and uses **react-toastify** for displaying notifications.

## Live Demo

You can check out the live demo of the project here:

[Live Demo on Vercel](https://iotion.vercel.app/)

## Features

- **Editable Columns**: Columns can be renamed.
- **Column Deletion**: Option to delete columns with confirmation.
- **Add New Column**: Dynamically add new columns to the table.
- **Add New Row**: Dynamically add new rows to the table.
- **Persistent Data**: Column configurations and data are saved in **localStorage** to persist across page reloads.
- **Customizable Data Types**: Supports custom data types like `Email`, `Phone`, `Status`, `Select`, and `MultiSelect`.
- **Responsive Design**: The table is responsive, adjusting dynamically to different screen sizes.
- **Toast Notifications**: Provides feedback for user actions (like saving, deleting, or editing data).
- **Icons for Data Types**: Uses icons for different data types like `Email`, `Phone`, and `Status`.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A statically typed superset of JavaScript for improved developer experience.
- **KaTable**: A customizable table library for React that supports editable cells, dynamic columns, and more.
- **Material UI**: A UI component library for React to create responsive and modern user interfaces.
- **React Icons**: A library for adding icons to React components.
- **React Toastify**: A library for displaying toast notifications in React apps.
- **localStorage**: Used to persist table columns and data across page reloads.

## Installation

To get started with this project, follow these steps:

### 1. Clone the repository:

```bash
git clone https://github.com/faheem506pk/my-katable-app.git
```

### 2. Navigate to the project folder:

```bash
cd my-katable-app
```

### 3. Install the project dependencies:

```bash
npm install
```

### 4. Run the development server:

```bash
npm run dev
```

Once the development server is running, open your browser and go to:

[http://localhost:5173](http://localhost:5173)

You will see the dynamic table in action.

## Features in Detail

### Column Renaming

- Click on a column header to open a popover where you can edit the column name.
- Press "Enter" or click outside to save the new column name.

### Column Deletion

- Click on the "Delete Column" button below the column name to open a confirmation dialog.
- Confirm the deletion to remove the column, or cancel to keep it.

### Add New Column

- Click the "Add Column" button to dynamically add a new editable column to the table.

### Add New Row

- Click the "Add Row" button to dynamically add a new empty row to the table.

### Persistent Data

- Columns and data are stored in **localStorage** to ensure that your changes persist across page reloads.

### Toast Notifications

- **React Toastify** is used to display notifications for actions like column edits, data changes, and deletions.

### Custom Data Types

- The app supports various data types like `Email`, `Phone`, `Select`, and `Status`.
- Each data type has corresponding icons, and cells are editable based on the selected data type.

## Example Table Layout

| Name       | Father Name | Date Of Birth | Add Column |
|------------|-------------|---------------|------------|
| John Doe   | James Doe   | 1990-01-01    | [Add Column] |
| Jane Smith | John Smith  | 1985-05-10    | [Add Column] |

## Contributing

We welcome contributions to this project. If you have suggestions, improvements, or fixes, feel free to create an issue or submit a pull request.

To start contributing:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, feel free to contact me:

- GitHub: [faheem506pk](https://github.com/faheem506pk)
- Live Demo: [https://iotion.vercel.app/](https://iotion.vercel.app/)

Thank you for checking out **My KaTable App**!
