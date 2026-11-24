package sql

import (
	"github.com/BurntSushi/toml"
)

func GetDatabasePath() (string, error) {
	var conf conf
	_, err := toml.DecodeFile("config/config.toml", &conf)
	if err != nil {
		return "", err
	}
	path := conf.Server.Database
	return path, err
}