package server

import (
	"fmt"
	"log"
	"os"
	core "server/server/core"

	"github.com/BurntSushi/toml"
)

type conf = core.Conf

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
	err = core.CreateSQL()
	if err != nil {
		log.Fatalf("error with create database")
	}
	err = core.AddBibloInfoSQL()
	if err != nil {
		log.Fatalf("error add biblio in database")
	}
	err = core.AddUsersSQL("admin", "admin")
	if err != nil {
		log.Fatalf("Error with add first user")
	}
	fmt.Println("Serveur Pret")
	return cfg
}
