package api

import (
	"encoding/json"
	"fmt"
	"net/http"

	core "server/server/core"
	session "server/server/core/sessionshare"
)

type SessionRequest struct {
	url string
}

func CreateSession(cfg core.Conf) error {
	http.HandleFunc("/api/sessionshare/create", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		var request SessionRequest
		url, err := session.CreateSession(cfg)
		if url == "" || err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		request.url = url
		switch r.Method {
		case http.MethodGet:
			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(request); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintln(w, "Erreur d'encodage JSON")
			}
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte("Méthode non autorisée"))
		}
	})
	return nil
}
