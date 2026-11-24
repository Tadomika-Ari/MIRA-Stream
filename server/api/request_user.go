package api

import (
	"net/http"
	"fmt"
	"encoding/json"
	srv "server/server"
)

type UserConfig struct {
	Name        string `toml:"name" json:"name"`
	Description string `toml:"description" json:"description"`
	PP          string `toml:"pp" json:"pp"`
	NSFW        bool   `toml:"nsfw" json:"nsfw"`
}

func RequestUser(cfg srv.Conf) {
	http.HandleFunc("/api/user/{username}", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		username := r.PathValue("username")
		var usersend UserConfig 
		for _, user := range cfg.Management.Users {
			if user.Name != username {
				continue
			}
			usersend.Name = user.Name
			usersend.Description = user.Description
			usersend.PP = user.PP
			usersend.NSFW = user.NSFW
		}
		switch r.Method {
		case http.MethodGet:
			w.Header().Set("Content-Type", "application/json")
			if err := json.NewEncoder(w).Encode(usersend); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintln(w, "Erreur d'encodage JSON")
			}
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte("Méthode non autorisée"))
		}
	})
}
