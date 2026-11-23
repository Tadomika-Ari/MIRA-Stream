package api

import (
	"net/http"
	"encoding/json"
	"time"
	"fmt"

	srv "server/server"
	sql "server/server/core/sql"
)

type RequestAddAnime struct {
	Account string	`json:"account"`
	AnimeName string	`json:"animeName"`
}

func RequestAddFavoriteAnime(cfg srv.Conf) {
	http.HandleFunc("/api/user/favorite/add", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		fmt.Println("DEBUG")
		switch r.Method {
			case http.MethodPost:
				var request RequestAddAnime
				if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
					w.WriteHeader(http.StatusBadRequest)
					return
				}
				fmt.Println(request.Account, request.AnimeName)
				if err := sql.AddFavoriteAnime(request.AnimeName, request.Account); err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					fmt.Fprintf(w, "Erreur favori: %v", err)
					return
				}
				w.WriteHeader(http.StatusOK)
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
				w.Write([]byte("Méthode non autorisée"))
		}
		Now := time.Now()
		fmt.Printf("LOG: Demand Favorite Anime User %d:%d\n", Now.Hour(), Now.Minute())
	})
}
