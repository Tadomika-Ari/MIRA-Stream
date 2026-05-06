package api

import (
	"fmt"
	"net/http"

	srv "server/server"
)

func SimpleHost(cfg srv.Conf) {
	RequestFolder(cfg) // For take folder
	RequestFile(cfg) // take file

	fmt.Println("API lancer")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		fmt.Println("error server")
	}
}