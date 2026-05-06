package server

import (
	"fmt"
	"log"
	"os"

	"github.com/BurntSushi/toml"
)

type conf struct {
	Folder struct {
		VideoF   string `toml:"video_f"`
		WebtoonF string `toml:"webtoon_f"`
	} `toml:"folder"`
	Server struct {
		Port int    `toml:"port"`
		Host string `toml:"host"`
	} `toml:"server"`
	Path        string
	StartStatut int
}

type Conf = conf

func LoadConf(path string) (Conf, error) {
	var cfg conf
	_, err := toml.DecodeFile(path, &cfg)
	cfg.Path, err = os.Getwd()
	cfg.StartStatut = 0
	return cfg, err
}

func ServerStart() Conf {
	cfg, err := LoadConf("config/config.toml")
	if err != nil {
		log.Fatalf("error toml")
	}
	fmt.Printf("Debug: %+v\n", cfg)
	fmt.Println("Serveur Pret")
	return cfg
}
