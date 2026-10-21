package core

import (
	"database/sql"
	"fmt"

	"github.com/BurntSushi/toml"
	_ "modernc.org/sqlite"
)

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
}

type Conf = conf

func GetDatabasePath() (string, error) {
	var conf conf
	_, err := toml.DecodeFile("config/config.toml", &conf)
	if err != nil {
		return "", err
	}
	path := conf.Server.Database
	return path, err
}

func CreateSQL() error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return fmt.Errorf("ouvrir la base de données: %w", err)
	}
	defer db.Close()
	_, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            account TEXT NOT NULL
        )
    `)
	if err != nil {
		fmt.Println("Error with exec")
		return err
	}
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS anime (
			id INTEGER PRiMARY KEY,
			animeName TEXT NOT NULL,
			nsfw BOOLEAN
		)
	`)
	if err != nil {
		fmt.Println("Error with table likeanime")
		return err
	}
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS user_anime (
			userid INTEGER NOT NULL REFERENCE user(id ) ON DELETE CASCADE,
			animeid INTEGER NOT NULL REFERENCE anime(id) ON DELETE CASCADE,
			status TEXT,
			timestamp INTEGER,
			PRIMARY KEY (userid, animeid)
		)
	`)
	return nil
}

func AddUsersSQL(name string, password string) error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return err
	}
	defer db.Close()
	_, err = db.Exec(`
		INSERT INTO users (account) 
		VALUES (?)
	`, "admin")
	return nil
}

func GetAllUsersSQL() error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return err
	}
	defer db.Close()
	rows, err := db.Query(`
		SELECT * FROM users
	`)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var account string
		if rows.Err() != nil {
			return rows.Err()
		}
		rows.Scan(&id, &account)
		println(id, account)
	}
	return nil
}

func AddBibloInfoSQL() error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return err
	}
	defer db.Close()
	_, err = db.Exec(`
		INSERT INTO anime (animeName, nsfw) 
		VALUES (?, ?)
	`, "Wisteria", false)
	return nil
}

func TakeInfoSQL() error {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return err
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return err
	}
	defer db.Close()
	rows, err := db.Query(`
		SELECT * FROM anime
	`)
	if err != nil {
		return err
	}
	defer rows.Close()
	for rows.Next() {
		var id int
		var animeName string
		var nsfw bool
		if rows.Err() != nil {
			return rows.Err()
		}
		rows.Scan(&id, &animeName, &nsfw)
		println(id, animeName, nsfw)
	}
	return nil
}
