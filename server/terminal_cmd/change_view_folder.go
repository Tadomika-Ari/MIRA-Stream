package cmd

import (
	"fmt"

	srv "server/server"
)

func ChangeVFolder(cfg *srv.Conf) {
	var ChangePath string
	fmt.Println("Quelle est le nouveau path ?")
	fmt.Scan(&ChangePath)
	cfg.Folder.VideoF = ChangePath
}