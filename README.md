✈️ Smart Travel Planner

Smart Travel Planner finds the shortest route between cities using a manual implementation of Graph Data Structures and BFS Algorithm (No STL).

🚀 Features

Core Logic: Manual Breadth-First Search (BFS) for optimal paths.

Custom DS: Hand-written Linked Lists and Queues in C++.

Tech: Lightweight C++ backend + Modern React Frontend.

UI: Interactive step-by-step route visualization.

🛠️ Tech Stack

Backend: C++ (14/17), cpp-httplib.

Frontend: React.js, Vite.

⚙️ Quick Start

1. Backend (C++)

Runs on port 8080.

# Compile (Link pthread)
g++ server.cpp -o server -lpthread

# Run
./server


2. Frontend (React)

Runs on port 5173.

cd map-lab
npm install
npm run dev


3. Usage

Open http://localhost:5173 in your browser.

📂 Structure

smart-travel-planner/
├── server.cpp          # Backend (Graph + BFS logic)
├── httplib.h           # HTTP Library
├── map-lab/            # Frontend (React App)
└── README.md           # Documentation


🧠 Logic

Graph: Built using Adjacency Lists (Linked List).

Search: BFS explores layer-by-layer using a custom Queue.

Result: Returns JSON path reconstructed via backtracking.

📝 License

MIT License. Made by [Your Name].
