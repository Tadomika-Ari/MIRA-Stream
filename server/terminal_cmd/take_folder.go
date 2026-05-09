package cmd

import (
	"fmt"
	"os"

	srv "server/server"
)


func TakeFolder(cfg *srv.Conf) {
	fmt.Printf("Path : %v\n", cfg.Path)
	folder, _ := os.ReadDir(cfg.Folder.VideoF)
	fmt.Printf("%+v\n", folder)
}
