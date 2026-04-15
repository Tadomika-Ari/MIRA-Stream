package server

import (
	"fmt"
	"os"
)

func TakeFolder(cfg *conf) {
	fmt.Println(os.ReadDir(cfg.Folder.VideoF))
}