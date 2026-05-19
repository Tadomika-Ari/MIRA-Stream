package api

import (
	"fmt"
	"encoding/json"
	"net/http"
	"time"

	serv "server/server"
	external "server/server/external"
)

func JikanHandler(w http.ResponseWriter, r *http.Request, cfg serv.Conf) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	name := r.PathValue("name")
	info := external.JikanInfo(name)

	switch r.Method {
	case http.MethodGet:
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(info); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			fmt.Fprintln(w, "Erreur d'encodage JSON")
		}
	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("Méthode non autorisée"))
	}
	Now := time.Now()
	fmt.Printf("LOG: Demand Bibliotheque %d:%d\n", Now.Hour(), Now.Minute())

}

func RequestJikan(cfg serv.Conf) {
	http.HandleFunc("/jikan/{name}", func(w http.ResponseWriter, r *http.Request) {
		JikanHandler(w, r, cfg)
	})
}