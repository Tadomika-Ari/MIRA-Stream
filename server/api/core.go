package api

import (
	"fmt"
	"net/http"

	srv "server/server"
)

func SimpleHost(cfg srv.Conf) {
	var port string
	RequestFolder(cfg) // For take folder
	RequestFile(cfg) // take file
	RequestLibrary(cfg) // create library

	fmt.Println("API lancer")
	port = ":" + fmt.Sprintf("%d", cfg.Server.Port)
	err := http.ListenAndServe(port , nil)
	if err != nil {
		fmt.Println("error server")
	}
}