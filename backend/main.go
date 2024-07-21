package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

// Node represents a Kubernetes node.
type Node struct {
	Name string `json:"name"`
}

// getNodeList fetches the list of nodes from the Kubernetes API.
func getNodeList(clientset *kubernetes.Clientset) ([]Node, error) {
	nodeList, err := clientset.CoreV1().Nodes().List(context.Background(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	nodes := make([]Node, len(nodeList.Items))
	for i, n := range nodeList.Items {
		nodes[i] = Node{Name: n.Name}
	}
	return nodes, nil
}

// Middleware to add CORS headers
func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	// Load Kubernetes configuration
	rules := clientcmd.NewDefaultClientConfigLoadingRules()
	kubeconfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(rules, &clientcmd.ConfigOverrides{})
	config, err := kubeconfig.ClientConfig()
	if err != nil {
		fmt.Println("Error loading kubeconfig:", err)
		return
	}
	clientset := kubernetes.NewForConfigOrDie(config)

	// Define handlers
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintln(w, `{"message": "Hello, World!"}`)
	})

	http.HandleFunc("/api/nodes", func(w http.ResponseWriter, r *http.Request) {
		nodes, err := getNodeList(clientset)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(nodes)
	})
	// commit
	// Start HTTP server
	server := http.Server{
		Addr:    ":8080",
		Handler: withCORS(http.DefaultServeMux),
	}
	fmt.Println("Server is running on port 8080...")
	server.ListenAndServe()
}
