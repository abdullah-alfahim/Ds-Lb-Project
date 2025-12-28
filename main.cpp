#include <iostream>
#include <string>
#include <sstream>
#include "httplib.h"

using namespace std;

struct Node {
    int data;
    Node* next;
    Node(int val) { data = val; next = NULL; }
};

Node* adj[100];
string cityNames[100];

void addEdge(int u, int v) {
    Node* newNode = new Node(v);
    newNode->next = adj[u];
    adj[u] = newNode;

    newNode = new Node(u);
    newNode->next = adj[v];
    adj[v] = newNode;
}

struct QueueNode {
    int data;
    QueueNode* next;
    QueueNode(int val) { data = val; next = NULL; }
};

QueueNode *frontQ = NULL, *rearQ = NULL;

void enqueue(int val) {
    QueueNode* newNode = new QueueNode(val);
    if (frontQ == NULL) frontQ = rearQ = newNode;
    else { rearQ->next = newNode; rearQ = newNode; }
}

void dequeue() {
    if (frontQ == NULL) return;
    QueueNode* temp = frontQ;
    frontQ = frontQ->next;
    if (frontQ == NULL) rearQ = NULL;
    delete temp;
}

bool isQueueEmpty() { return frontQ == NULL; }
int getFront() { return frontQ->data; }

string findShortestPath(int start, int end) {
    if (start == end) return "You are already there!";

    bool visited[100] = {false};
    int parent[100];
    for(int i=0; i<100; i++) parent[i] = -1;

    frontQ = rearQ = NULL;
    enqueue(start);
    visited[start] = true;
    
    bool found = false;

    while (!isQueueEmpty()) {
        int u = getFront();
        dequeue();

        if (u == end) { found = true; break; }

        Node* temp = adj[u];
        while (temp != NULL) {
            int v = temp->data;
            if (!visited[v]) {
                visited[v] = true;
                parent[v] = u;
                enqueue(v);
            }
            temp = temp->next;
        }
    }

    if (!found) return "No route found!";

    string path = "";
    int curr = end;
    while (curr != -1) {
        path = cityNames[curr] + (path == "" ? "" : " -> ") + path;
        curr = parent[curr];
    }
    return path;
}

int main() {
    for(int i=0; i<100; i++) adj[i] = NULL;

    cityNames[0] = "Dhaka"; cityNames[1] = "Comilla";
    cityNames[2] = "Chittagong"; cityNames[3] = "Sylhet";
    cityNames[4] = "CoxBazar"; cityNames[5] = "Rajshahi";
    cityNames[6] = "Khulna"; cityNames[7] = "Barisal";
    cityNames[8] = "Rangpur"; cityNames[9] = "Mymensingh";
    cityNames[10] = "Faridpur"; cityNames[11] = "Tangail";

    addEdge(0, 1);
    addEdge(1, 2);
    addEdge(2, 4);
    addEdge(0, 3);
    addEdge(0, 5);
    addEdge(3, 2);
    addEdge(5, 6);
    addEdge(6, 7);
    addEdge(7, 8);
    addEdge(8, 9);
    addEdge(9, 10);
    addEdge(10, 11);
    addEdge(11, 0);

    httplib::Server svr;
    cout << "✅ Route Finder Server running on port 8080..." << endl;

    svr.Get("/cities", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        
        string json = "[";
        for(int i=0; i<12; i++) {
            json += "{\"id\": " + to_string(i) + ", \"name\": \"" + cityNames[i] + "\"}";
            if(i < 11) json += ",";
        }
        json += "]";
        res.set_content(json, "application/json");
    });

    svr.Post("/search", [](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        
        stringstream ss(req.body);
        int u, v;
        ss >> u >> v;

        string resultPath = findShortestPath(u, v);
        
        string json = "{ \"path\": \"" + resultPath + "\" }";
        res.set_content(json, "application/json");
    });

    svr.Options("/search", [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "POST");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
        res.set_content("", "text/plain");
    });

    svr.listen("0.0.0.0", 8080);
    return 0;
}