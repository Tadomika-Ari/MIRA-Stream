package api

import (
	"net/http"
	"encoding/json"
	"time"
	"fmt"

	srv "server/server"
	sql "server/server/core/sql"
)

type RequestDeleteAnime struct {
	Account string	`json:"account"`
	AnimeName string	`json:"animeName"`
}

func RequestDeleteFavoriteAnime(cfg srv.Conf) {
	http.HandleFunc("/api/user/favorite/delete", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		switch r.Method {
			case http.MethodPost:
				var request RequestDeleteAnime
				err := json.NewDecoder(r.Body).Decode(&request)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
				}
				fmt.Println(request.Account, request.AnimeName)
				err = sql.DeleteFavoriteAnime(request.AnimeName, request.Account)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
				}
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
				w.Write([]byte("Méthode non autorisée"))
		}
		Now := time.Now()
		fmt.Printf("LOG: Demand Delete Anime User %d:%d\n", Now.Hour(), Now.Minute())
	})
}
