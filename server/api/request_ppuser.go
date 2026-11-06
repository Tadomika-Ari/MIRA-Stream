package api

import (
	"net/http"
	"path/filepath"

	srv "server/server"
)

func RequestPPUser(cfg srv.Conf) {
	http.HandleFunc("/api/user/pp/{username}", func(w http.ResponseWriter, r *http.Request) {
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
			if user.PP == "" || user.PP == "default" {
				http.NotFound(w, r)
				return
			}
			http.ServeFile(w, r, filepath.Join(cfg.Path, user.PP))
			return
		}
		http.NotFound(w, r)
	})
}
