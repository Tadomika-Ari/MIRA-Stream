package server

import (
	"fmt"
	"log"

	"github.com/BurntSushi/toml"
)

type conf struct {
	VideoF   string `toml:"video_f"`
	WebtoonF string `toml:"webtoon_f"`
}

func LoadConf(path string) (conf, error) {
	var cfg conf
	_, err := toml.DecodeFile(path, &cfg)
	return cfg, err
}

func ChangeVFolder(cfg *conf) {
	var ChangePath string
	fmt.Println("Quelle est le nouveau path ?")
	fmt.Scan(&ChangePath)
	cfg.VideoF = ChangePath
}

func ServerStart() conf {
	cfg, err := LoadConf("config/config.toml")
	if err != nil {
		log.Fatalf("error toml")
	}
	fmt.Printf("Debug: %+v\n", cfg)
	fmt.Println("Serveur Pret")
	return cfg
}
