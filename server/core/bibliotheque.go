package core

import (
	"fmt"
	"os"

	srv "server/server"
)

type Biblio struct {
	Name string `json:"name"`
	Type string `json:"type"`
	TotalSeason int `json:"totalseason"`
	NbEpisode int `json:"nbseason"`
	PathEpisode []string `json:"pathepisode"`
}

func get_nb_folder(cfg srv.Conf) int {
	var nb int

	nb = 0;
	entries, err := os.ReadDir(cfg.Folder.VideoF)
	if err != nil {
		fmt.Printf("Error: ReadDir Get Nb Folder\n")
		return -1
	}
	for _, entry := range entries {
		if entry.IsDir() {
			nb++
		}
	}
	return nb
}

func CreateBiblio(cfg srv.Conf) []Biblio {
	var nb_of_folder int

	entries, err := os.ReadDir(cfg.Folder.VideoF)
	if err != nil {
		fmt.Printf("Error: ReadDir Create Biblio\n")
		return nil
	}
	nb_of_folder = get_nb_folder(cfg)
	if nb_of_folder == -1 {
		fmt.Printf("Error: No folder Found Create Biblio")
		return nil
	}
	folders := make([]Biblio, 0, nb_of_folder)
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		entryType := "undefined"
		folders = append(folders, Biblio{
			Name: entry.Name(),
			Type: entryType,
		})
	}
	return folders
}

func RegroupVideo(cfg srv.Conf) {
	CreateBiblio(cfg)
	fmt.Println("Regroup Video")
}