package cmd

import (
	"fmt"

	srv "server/server"
)

func ViewConfig(cfg srv.Conf) {
	fmt.Println("\t\tCONFIG")
	fmt.Println("Serveur :")
	fmt.Printf("	- Port : %v\n", cfg.Server.Port)
	fmt.Printf("	- Host : %v\n", cfg.Server.Host)
	fmt.Println("Folders :")
	fmt.Printf("	- Folder for videos : %v\n", cfg.Folder.VideoF)
	fmt.Printf("	- Folder for Webtoon : %v\n", cfg.Folder.WebtoonF)
}
