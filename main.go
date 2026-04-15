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
		}
		if rep == "-config" {
			fmt.Printf("Config actuel : %+v\n", cfg)
		}
	}
}