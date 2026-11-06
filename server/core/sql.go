package core

import (
	"database/sql"
	"fmt"

	"github.com/BurntSushi/toml"
	_ "modernc.org/sqlite"
)

type UserConfig struct {
	Name        string `toml:"name" json:"name"`
	Description string `toml:"description" json:"description"`
	PP          string `toml:"pp" json:"pp"`
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
            account TEXT NOT NULL UNIQUE,
			description TEXT,
			pp TEXT
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
		INSERT OR IGNORE INTO users (account) 
		VALUES (?)
	`, name)
	return nil
}

func InitUsersSQL(name string, password string, description string, pp string) error {
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
		INSERT OR IGNORE INTO users (account, description, pp)
		VALUES (?, ?, ?)
	`, name, description, pp)
	return err
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
		var description string
		var pp string
		if err := rows.Scan(&id, &account, &description, &pp); err != nil {
			return err
		}
		println(id, account, description, pp)
	}
	return rows.Err()
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

func GetUsers() []UserConfig {
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return nil
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		fmt.Println("ERROR DEBUG 2")
		return nil
	}
	defer db.Close()
	rows, err := db.Query(`
		SELECT * FROM users
	`)
	if err != nil {
		fmt.Println("ERROR DEBUG 3")
		return nil
	}
	defer rows.Close()

	var list_users []UserConfig

	for rows.Next() {
		var id int
		var account string
		var description string
		var pp string
		var tmp UserConfig
		if err := rows.Scan(&id, &account, &description, &pp); err != nil {
			fmt.Println("ERROR DEBUG 4")
			return nil
		}
		tmp.Name = account
		tmp.Description = description
		tmp.PP = pp

		println(id, account)
		list_users = append(list_users, tmp)
	}
	if err := rows.Err(); err != nil {
		fmt.Println("ERROR DEBUG 5")
		return nil
	}
	return list_users
}

func DeleteUser(name string) []UserConfig {
	if name == "admin" {
		fmt.Println("Admin delete cancel")
		return nil
	}
	path, err := GetDatabasePath()
	if err != nil {
		fmt.Println("ERROR with get database path ")
		return nil
	}
	db, err := sql.Open("sqlite", path)
	if err != nil {
		fmt.Println("ERROR DEBUG 2")
		return nil
	}
	defer db.Close()
	_, err = db.Exec(`
		DELETE FROM users WHERE account == (?) 
	`, name)

	var list_users []UserConfig
	list_users = GetUsers()
	return list_users
}
