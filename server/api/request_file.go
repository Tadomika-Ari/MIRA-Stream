package api

import (
	"net/http"
	"path/filepath"
	"time"
	"fmt"

	srv "server/server"
)

func RequestFile(cfg srv.Conf) {
	http.HandleFunc("/api/video/{filename}", func(w http.ResponseWriter, r *http.Request) {
		// Allow the frontend dev server to stream video from this API.
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Range")
		w.Header().Set("Access-Control-Expose-Headers", "Accept-Ranges, Content-Length, Content-Range")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		filename := r.PathValue("filename")
		videoPath := filepath.Join(cfg.Path, cfg.Folder.VideoF, filename)
		Now := time.Now()
		fmt.Printf("LOG: Demand File %d:%d\n", Now.Hour(), Now.Minute())
		http.ServeFile(w, r, videoPath)
	})
}
