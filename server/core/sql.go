package core

import (
	"context"
	_ "modernc.org/sqlite"
)
type UserConfig struct {
	Name        string `toml:"name" json:"name"`
	Description string `toml:"description" json:"description"`
	PP          string `toml:"pp" json:"pp"`
	NSFW        bool   `toml:"nsfw" json:"nsfw"`
}

type conf struct {
	Folder struct {
		VideoF   string `toml:"video_f"`
		WebtoonF string `toml:"webtoon_f"`
	} `toml:"folder"`
	Server struct {
		Port     int    `toml:"port"`
		Host     string `toml:"host"`
		Database string `toml:"database"`
	} `toml:"server"`
	Path        string
	StartStatut int
	Management  struct {
		Users []UserConfig `toml:"users"`
	} `toml:"management"`
	SessionShare struct {
		Ctx	context.Context
		CancelFunction context.CancelFunc
		SessionShareUrl string 
	}
}

type Conf = conf