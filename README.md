# EmailSender

## Introduction

This project is a messaging platform that allows users to send SMS messages efficiently. Users can create an account, verify their email and phone number, purchase plans, and send messages either to individual contacts or groups. It also includes features for managing senders, groups, templates, and more.

---

## Features

### User Management

- **Sign Up and Verification**: Users can sign up and verify their account via email and OTP for mobile verification.

### Messaging Features

- **Send SMS**: Send messages to individual recipients or groups.
- **Sender Name Management**: Create sender names, which must be approved by the admin.
- **Templates**: Create message templates for reuse.

### Group and Contact Management

- **Group Creation**: Create groups to manage contacts.
- **Search within Groups**: Search for specific contacts in a group.

### Credits and Plans

- **Purchase Plans**: Buy plans to add credits.
- **Transaction History**: View your transaction history.
- **Notifications**: Receive reminders when credits are low.

### Message Management

- **Character Limits**: Messages support up to 134 English characters or 72 Arabic characters per SMS. Longer messages are split.
- **Scheduled Messages**: Schedule messages for future delivery.
- **Message Status**: Track sent, scheduled, and pending messages.

### Developer Integration

- **API Documentation**: Detailed API docs for integrating with third-party platforms.

---

## Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Tailwind CSS**

### State Management

- **Redux Toolkit**
- **React Query**

### Backend Interaction

- **Axios**

### Libraries and Tools

- **Form Handling**: React Hook Form, Yup
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Map**: Leaflet, D3
- **Carousel**: React Slick

---

## Installation and Setup

### Prerequisites

- Node.js and npm installed.
- Git installed.

### Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:

   ```bash
   cd <project-directory>
   ```

3. **Install dependencies**:

   ```bash
   yarn install
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory and add the necessary variables:

   ```env
   REACT_APP_API_URL=<your-api-url>
   ```

5. **Start the development server**:

   ```bash
   yarn run dev
   ```

6. **Build for production**:

   ```bash
   yarn run build
   ```

7. **Deploy to GitHub Pages**:
   ```bash
   yarn run deploy
   ```

---

## Folder Structure

```plaintext
src
├── components      # Reusable components
├── pages           # Application pages
├── store           # Redux store setup
├── hooks           # Custom React hooks
├── utils           # Utility functions
├── assets          # Images and static assets
└── styles          # CSS and Tailwind configurations
```

---

## Available Scripts

- `yarn run dev`: Start the development server.
- `yarn run build`: Build the application for production.
- `yarn run deploy`: Deploy to GitHub Pages.

---

## Dependencies

### Production

- **React**: ^18.2.0
- **Redux Toolkit**: ^2.2.7
- **React Router DOM**: ^6.22.3
- **Axios**: ^1.7.2
- **Tailwind CSS**: ^3.3.5
- **i18next**: ^23.10.1
- **React Hook Form**: ^7.52.1
- **Yup**: ^1.4.0

### Development

- **TypeScript**: ^5.3.3
- **Vite**: ^4.4.5
- **ESLint**: ^8.45.0
- **Prettier**: Optional for code formatting

---

## Contribution

Feel free to fork the repository and submit pull requests. Ensure your code adheres to the existing style and conventions.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For questions or support, please contact:

- **Email**: solomdev0@gmail.com
- **GitHub Issues**: Open an issue in the repository.
