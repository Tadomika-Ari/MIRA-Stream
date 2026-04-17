package main

import (
	"fmt"
	"log"
	"server/server"
)

func main() {
	fmt.Println("Démarage du serveur")
	cfg := server.ServerStart()
	fmt.Println("Terminal du serveur :")
	for {
		var rep string
		fmt.Print("$MIRA-Stream> ")
		_, err := fmt.Scan(&rep)
		if err != nil {
			log.Fatalln("error input")
		}
		if rep == "-exit" {
			break
		}
		if rep == "-vfolder" {
			server.ChangeVFolder(&cfg)
			fmt.Printf("After change : %+v\n", cfg)
			continue
		}
		if rep == "-list" {
			server.TakeFolder(&cfg)
			continue
		}
		if rep == "-config" {
			server.ViewConfig(cfg)
			continue
		}
		if rep == "-start" && cfg.StartStatut == 0 {
			go server.SimpleHost()
			cfg.StartStatut = 1
			continue
		}
		fmt.Println("Command not found.")
	}
}
