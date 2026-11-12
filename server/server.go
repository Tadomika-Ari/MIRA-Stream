package server

import (
	"fmt"
	"log"
	"os"
	core "server/server/core"
	sql "server/server/core/sql"
	"github.com/BurntSushi/toml"
)

type conf = core.Conf

type Conf = conf

func LoadConf(path string) (Conf, error) {
	var cfg conf
	_, err := toml.DecodeFile(path, &cfg)
	if err != nil {
		return cfg, err
	}
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
	err = sql.CreateSQL()
	if err != nil {
		log.Fatalf("error with create database")
	}
	err = sql.AddBibloInfoSQL()
	if err != nil {
		log.Fatalf("error add biblio in database")
	}
	for _, user := range cfg.Management.Users {
		err = sql.InitUsersSQL(user.Name, user.Name, user.Description, user.PP, user.NSFW)
		if err != nil {
			log.Fatalf("Error with add first user")
		}
	}
	fmt.Println("Serveur Pret")
	return cfg
}
