package api

import (
	"net/http"
	"encoding/json"
	"time"
	"fmt"

	srv "server/server"
	sql "server/server/core/sql"
)

func RequestUserAnime(cfg srv.Conf) {
	http.HandleFunc("/api/user/favorite/{username}", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		username := r.PathValue("username")
		for _, user := range cfg.Management.Users {
			if user.Name != username {
				continue
			}
			switch r.Method {
				case http.MethodGet:
					w.Header().Set("Content-Type", "application/json")

					favoriteList, err := sql.GetFavoriteAnimeUser(username)
					if err != nil {
						return
					}

					if err := json.NewEncoder(w).Encode(favoriteList); err != nil {
						w.WriteHeader(http.StatusInternalServerError)
						fmt.Fprintln(w, "Erreur d'encodage JSON")
					}
				default:
					w.WriteHeader(http.StatusMethodNotAllowed)
					w.Write([]byte("Méthode non autorisée"))
				}
				Now := time.Now()
				fmt.Printf("LOG: Demand Favorite Anime User %d:%d\n", Now.Hour(), Now.Minute())
		}
		http.NotFound(w, r)
	})
}
