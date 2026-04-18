package server

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Item struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

var items = []Item{
	{ID: 1, Name: "Item A"},
	{ID: 2, Name: "Item B"},
}

func itemsHandler(w http.ResponseWriter, r *http.Request) {
	// Allow the Vite dev server to read API responses from the browser.
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	switch r.Method {
	case http.MethodGet:
		// On renvoie la liste en JSON
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(items); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintln(w, "Erreur d'encodage JSON")
		}
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Méthode non autorisée"))
	}
}

func SimpleHost(cfg conf) {
	http.HandleFunc("/", itemsHandler)
	fmt.Println("API lancer")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		fmt.Println("error server")
	}
	fmt.Println("END FUNCTION")
}