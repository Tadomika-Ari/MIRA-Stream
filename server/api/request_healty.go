package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	srv "server/server"
)

type request_health struct {
	Running int `json:"running"`
}

func RequestHealth(cfg srv.Conf) {
	http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		switch r.Method {
		case http.MethodGet:
			w.Header().Set("Content-Type", "application/json")

			health := cfg.StartStatut

			var request_health request_health

			request_health.Running = health
			fmt.Println("DEBUG PRINT :", request_health.Running)

			if err := json.NewEncoder(w).Encode(request_health); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintln(w, "Erreur d'encodage JSON")
			}
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte("Méthode non autorisée"))
		}
		Now := time.Now()
		fmt.Printf("LOG: Get healty %d:%d\n", Now.Hour(), Now.Minute())

	})
}
