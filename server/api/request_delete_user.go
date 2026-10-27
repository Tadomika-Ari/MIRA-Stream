package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	srv "server/server"
	core "server/server/core"
)

type request_delete_user struct {
	AllUser []string `json:"all_user"`
}

func RequestDeleteUser(cfg srv.Conf) {
	http.HandleFunc("/api/user/login/delete", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		switch r.Method {
		case http.MethodGet:
			w.Header().Set("Content-Type", "application/json")

			list_user := core.DeleteUser()

			var request_list request_delete_user

			request_list.AllUser = list_user
			fmt.Println("DEBUG PRINT :", request_list)

			if err := json.NewEncoder(w).Encode(request_list); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				fmt.Fprintln(w, "Erreur d'encodage JSON")
			}
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte("Méthode non autorisée"))
		}
		Now := time.Now()
		fmt.Printf("LOG: Demand User %d:%d\n", Now.Hour(), Now.Minute())

	})
}
