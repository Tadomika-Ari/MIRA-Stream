package sql

import (
	"database/sql"
	"fmt"
	"server/server/core"

	_ "modernc.org/sqlite"
)

// add function for nsfw section
func AddBibloInfoSQL(cfg core.Conf) error {
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
	var biblio []core.Biblio
	biblio = core.CreateBiblio(cfg)
	for _, anime := range biblio {
		_, err = db.Exec(`
			INSERT INTO anime (animeName, nsfw) 
			VALUES (?, ?)
		`, anime.Name, false)
	}
	return nil
}