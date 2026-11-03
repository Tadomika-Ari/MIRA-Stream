package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	srv "server/server"
	core "server/server/core"
)

func RequestAddUser(cfg srv.Conf) {
	http.HandleFunc("/api/user/add/{userName}", func(w http.ResponseWriter, r *http.Request) {
		setCORSHeaders(w, r)

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		switch r.Method {
		case http.MethodGet:
			w.Header().Set("Content-Type", "application/json")

			userName := r.PathValue("userName")
			core.AddUsersSQL(userName, userName)

			list_user := core.GetUsers()

			var request_list request_user

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
