### Setup Instructions

#### Option 1: Run the Setup Script

1. Open a terminal and navigate to the project directory.
2. Run the setup script:
   ```bash
   ./setup.sh
   ```
3. Follow the on-screen instructions to complete the setup.

#### Option 2: Manual Setup

1. **Install Dependencies**:
   - Navigate to the `web` directory and run:
     ```bash
     npm install
     ```
   - Navigate to the `server` directory and run:
     ```bash
     npm install
     ```

2. **Configure Environment Variables**:
   - Create a `.env` file in the `server` directory with the following content:
     ```
     LISTEN_PORT=3000
     WEB_IP=http://localhost:5173
     ```
   - Create a `.env` file in the `web` directory with the following content:
     ```
     VITE_API_URL="http://localhost:3000/api"
     ```

3. **Run Database Migrations**:
   - Navigate to the `server` directory and run:
     ```bash
     npm run db
     npm start -- -i
     ```

4. **Build the Web Application**:
   - Navigate to the `web` directory and run:
     ```bash
     npm run build
     ```

5. **Start the Server**:
   - Navigate back to the `server` directory and run:
    - ```bash
       npm start -- -b
       ```

6. The setup is complete. The application should now be running on http://localhost:3000.
