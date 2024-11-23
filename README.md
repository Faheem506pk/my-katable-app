# KaTable Project

This project is built with **React**, **TypeScript**, and **KaTable** to create a dynamic, editable table. The table includes features such as column renaming, column deletion, adding new columns and rows, and persisting data in **localStorage**.

## Features

- **Editable Columns**: Columns can be renamed.
- **Column Deletion**: Option to delete columns with confirmation.
- **Add New Column**: Dynamically add new columns to the table.
- **Add New Row**: Dynamically add new rows to the table.
- **Persistent Data**: Column configurations and data are saved in **localStorage** to persist across page reloads.
- **Responsive Design**: The table is responsive, adjusting dynamically to different screen sizes.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A statically typed superset of JavaScript.
- **KaTable**: A customizable table library for React.
- **Material UI**: UI components for faster web development.
- **React Icons**: Icon library for React.
- **localStorage**: Used to persist table columns and data.

## Installation

To get started with this project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/faheem506pk/ka-table.git
```

2. Navigate to the project folder:

```bash
cd ka-table
```

3. Install the project dependencies:

```bash
npm install
```

## Usage

1. Run the development server with the following command:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173` to view the table in action.

## Features in Detail

### Column Renaming

- Click on a column header to open a popover, where you can edit the column name.
- Press "Enter" or click outside to save the new column name.

### Column Deletion

- Click on the "Delete Column" button below the column name to open a confirmation dialog.
- Confirm the deletion to remove the column, or cancel to keep it.

### Add New Column

- Click the "Add Column" button to dynamically add a new editable column to the table.

### Add New Row

- Click the "Add Row" button to dynamically add a new empty row to the table.

### Persistent Data

- Columns and data are stored in **localStorage** to ensure that your changes are saved across page reloads.

## Example Table Layout

| Name       | Father Name | Date Of Birth | Add Column |
|------------|-------------|---------------|------------|
| John Doe   | James Doe   | 1990-01-01    | [Add Column] |
| Jane Smith | John Smith  | 1985-05-10    | [Add Column] |

## Contributing

We welcome contributions to this project. If you have suggestions, improvements, or fixes, feel free to create an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

