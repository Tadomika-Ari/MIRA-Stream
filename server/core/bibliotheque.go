package core

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

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

func Check_Folder(cfg srv.Conf, name string, folder []Biblio) {
	content, err := os.ReadDir(cfg.Folder.VideoF + name)
	var nb_of_season int
	var nb_of_episode int
	var ext string

	if err != nil {
		return
	}
	for _, season := range content {
		if !season.IsDir() {
			continue
		}
		if !strings.HasPrefix(season.Name(), "season") {
			continue
		}
		path, _ := os.ReadDir(season.Name())
		for _, tmp_for_ep := range path {
			ext = filepath.Ext(tmp_for_ep.Name())
			if ext == ".mp4" || ext == ".mkv" {
				nb_of_episode++
			}
		}
		nb_of_season++;
	}
	folder = append(folder, Biblio{
		TotalSeason: nb_of_season,
		NbEpisode: nb_of_episode,
	})
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
	fmt.Printf("%+v\n", folders)
	return folders
}

func RegroupVideo(cfg srv.Conf) {
	CreateBiblio(cfg)
	fmt.Println("Regroup Video")
}