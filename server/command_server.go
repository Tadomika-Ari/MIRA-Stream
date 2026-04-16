package server

import (
	"fmt"
	"os"
)

func ChangeVFolder(cfg *conf) {
	var ChangePath string
	fmt.Println("Quelle est le nouveau path ?")
	fmt.Scan(&ChangePath)
	cfg.Folder.VideoF = ChangePath
}

func TakeFolder(cfg *conf) {
	fmt.Printf("Path : %v\n", cfg.Path)
	folder, _ := os.ReadDir(cfg.Folder.VideoF) 
	fmt.Printf("%+v\n", folder)
}

func ViewConfig(cfg conf) {
	fmt.Println("\t\tCONFIG")
	fmt.Println("Serveur :")
	fmt.Printf("	- Port : %v\n", cfg.Server.Port)
	fmt.Printf("	- Host : %v\n", cfg.Server.Host)
	fmt.Println("Folders :")
	fmt.Printf("	- Folder for videos : %v\n", cfg.Folder.VideoF)
	fmt.Printf("	- Folder for Webtoon : %v\n", cfg.Folder.WebtoonF)
}