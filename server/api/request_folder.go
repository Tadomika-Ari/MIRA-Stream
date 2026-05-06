package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	srv "server/server"
)

type Item struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Folder struct {
	Name string `json:"name"`
	Type string `json:"type"`
}

var items = []Item{
	{ID: 1, Name: "Item A"},
	{ID: 2, Name: "Item B"},
}

func SearchInFolder(cfg srv.Conf) []Folder {
	entries, err := os.ReadDir(cfg.Folder.VideoF)
	if err != nil {
		return nil
	}
	folders := make([]Folder, 0, len(entries))
	for _, entry := range entries {
		entryType := "file"
		if entry.IsDir() {
			entryType = "dir"
		}
		folders = append(folders, Folder{
			Name: entry.Name(),
			Type: entryType,
		})
	}
	return folders
}


func itemsHandler(w http.ResponseWriter, r *http.Request, cfg srv.Conf) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	switch r.Method {
	case http.MethodGet:
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(SearchInFolder(cfg)); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintln(w, "Erreur d'encodage JSON")
		}
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Méthode non autorisée"))
	}
	Now := time.Now()
	fmt.Printf("LOG: Demand Folder %d:%d\n", Now.Hour(), Now.Minute())
}

func RequestFolder(cfg srv.Conf) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		itemsHandler(w, r, cfg)
	})
}
