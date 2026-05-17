package core

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	srv "server/server"
)

type Biblio struct {
	Name        string   `json:"name"`
	Type        string   `json:"type"`
	TotalSeason int      `json:"totalseason"`
	NbEpisode   int      `json:"nbseason"`
	PathEpisode []string `json:"pathepisode"`
}

func get_nb_folder(cfg srv.Conf) int {
	var nb int

	nb = 0
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

func Check_Folder(cfg srv.Conf, name string) Biblio {
	content, err := os.ReadDir(filepath.Join(cfg.Folder.VideoF, name))
	var nb_of_season int
	var nb_of_episode int
	var ext string
	var episode_path []string

	if err != nil {
		return Biblio{Name: name, Type: "undefined"}
	}
	for _, season := range content {
		if !season.IsDir() {
			continue
		}
		if !strings.HasPrefix(season.Name(), "Season") {
			continue
		}
		seasonPath := filepath.Join(cfg.Folder.VideoF, name, season.Name())
		path, _ := os.ReadDir(seasonPath)
		for _, tmp_for_ep := range path {
			ext = filepath.Ext(tmp_for_ep.Name())
			if ext == ".mp4" || ext == ".mkv" {
				nb_of_episode++
			}
			episode_path = append(episode_path, filepath.Join(name, season.Name(), tmp_for_ep.Name()))
		}
		nb_of_season++
	}
	return Biblio{
		Name:        name,
		Type:        "undefined",
		TotalSeason: nb_of_season,
		NbEpisode:   nb_of_episode,
		PathEpisode: episode_path,
	}
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
		biblio := Check_Folder(cfg, entry.Name())
		folders = append(folders, biblio)
	}
	fmt.Printf("%+v\n", folders)
	return folders
}

func RegroupVideo(cfg srv.Conf) {
	CreateBiblio(cfg)
	fmt.Println("Regroup Video")
}
