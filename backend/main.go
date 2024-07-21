package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

type Node struct {
	Name string `json:"name"`
}

type Pod struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

type Deployment struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

type Service struct {
	Name      string `json:"name"`
	Namespace string `json:"namespace"`
}

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

func getPodList(clientset *kubernetes.Clientset) ([]Pod, error) {
	podList, err := clientset.CoreV1().Pods("").List(context.Background(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	pods := make([]Pod, len(podList.Items))
	for i, p := range podList.Items {
		pods[i] = Pod{Name: p.Name, Namespace: p.Namespace}
	}
	return pods, nil
}

func getDeploymentList(clientset *kubernetes.Clientset) ([]Deployment, error) {
	deploymentList, err := clientset.AppsV1().Deployments("").List(context.Background(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	deployments := make([]Deployment, len(deploymentList.Items))
	for i, d := range deploymentList.Items {
		deployments[i] = Deployment{Name: d.Name, Namespace: d.Namespace}
	}
	return deployments, nil
}

func getServiceList(clientset *kubernetes.Clientset) ([]Service, error) {
	serviceList, err := clientset.CoreV1().Services("").List(context.Background(), metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	services := make([]Service, len(serviceList.Items))
	for i, s := range serviceList.Items {
		services[i] = Service{Name: s.Name, Namespace: s.Namespace}
	}
	return services, nil
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
	// Optional: Set the KUBECONFIG environment variable if needed
	kubeconfigPath := os.Getenv("KUBECONFIG")
	if kubeconfigPath == "" {
		kubeconfigPath = filepath.Join(os.Getenv("HOME"), ".kube", "config") // Default path
	}

	// Load Kubernetes configuration
	rules := clientcmd.NewDefaultClientConfigLoadingRules()
	rules.ExplicitPath = kubeconfigPath
	kubeconfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(rules, &clientcmd.ConfigOverrides{})
	config, err := kubeconfig.ClientConfig()
	if err != nil {
		fmt.Println("Error loading kubeconfig:", err)
		return
	}
	clientset := kubernetes.NewForConfigOrDie(config)

	// Define handlers
	http.HandleFunc("/api/nodes", func(w http.ResponseWriter, r *http.Request) {
		nodes, err := getNodeList(clientset)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(nodes)
	})

	http.HandleFunc("/api/pods", func(w http.ResponseWriter, r *http.Request) {
		pods, err := getPodList(clientset)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(pods)
	})

	http.HandleFunc("/api/deployments", func(w http.ResponseWriter, r *http.Request) {
		deployments, err := getDeploymentList(clientset)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(deployments)
	})

	http.HandleFunc("/api/services", func(w http.ResponseWriter, r *http.Request) {
		services, err := getServiceList(clientset)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(services)
	})

	// Serve the index.html file
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(".", "index.html"))
	})

	server := http.Server{
		Addr:    ":8080",
		Handler: withCORS(http.DefaultServeMux),
	}
	fmt.Println("Server is running on port 8080...")
	server.ListenAndServe()
}
