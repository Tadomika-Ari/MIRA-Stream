package main

import (
	"fmt"
	"log"
	"os"
	"server/server"
	cmd "server/server/terminal_cmd"
	api "server/server/api"
	test "server/server/core"
)

func main() {
	fmt.Println("Démarage du serveur...")
	cfg := server.ServerStart()
	fmt.Println("Terminal du serveur :")
	for {
		var rep string
		var path string
		fmt.Print("$MIRA-Stream> ")
		_, err := fmt.Scan(&rep)
		if err != nil {
			log.Fatalln("error input")
		}
		if rep == "exit" {
			break
		}
		if rep == "vfolder" {
			cmd.ChangeVFolder(&cfg)
			fmt.Printf("After change : %+v\n", cfg)
			continue
		}
		if rep == "list" {
			cmd.TakeFolder(&cfg)
			continue
		}
		if rep == "config" {
			cmd.ViewConfig(cfg)
			continue
		}
		if rep == "start" && cfg.StartStatut == 0 {
			go api.SimpleHost(cfg)
			cfg.StartStatut = 1
			continue
		}
		if rep == "test" {
			test.CreateBiblio(cfg)
			continue
		}
		if rep == "cd" {
			_, err := fmt.Scan(&path)
			if err != nil {
				log.Fatalln("error cd")
			}
			os.Chdir(path)
			cfg.Path, err = os.Getwd()
			fmt.Printf("DEBUG CD : %v\n", cfg.Path)
			continue
		}
		if rep == "ls" {
			folder, _ := os.ReadDir(cfg.Path)
			fmt.Printf("DEBUG LS : %+v\n", folder)
			continue
		}
		fmt.Println("Command not found.")
	}
}
