package main

import (
	"bufio"
	"fmt"
	"os"
	"server/server"
	"strings"
	api "server/server/api"
	sql "server/server/core/sql"
	cmd "server/server/terminal_cmd"
)

func main() {
	fmt.Println("Démarage du serveur...")
	cfg := server.ServerStart()
	fmt.Println("Terminal du serveur :")
	scanner := bufio.NewScanner(os.Stdin)
	for {
		fmt.Print("$MIRA-Stream> ")
		if !scanner.Scan() {
			break
		}
		args := strings.Fields(scanner.Text())
		if len(args) == 0 {
			continue
		}
		rep := args[0]
		argument := ""
		if len(args) > 1 {
			argument = args[1]
		}
		// command section
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
			cfg.StartStatut = 1
			go api.SimpleHost(cfg)
			continue
		}
		if rep == "test" {
			if argument == "" {
				fmt.Println("No argument")
				continue
			}
			if err := sql.AddUsersAnime("Wistoria", argument); err != nil {
				fmt.Printf("Error AddUserAnime: %v\n", err)
			}
			if err := sql.GetAnimeUserInfo(argument); err != nil {
				fmt.Printf("Error SQL: %v\n", err)
			}
			continue
		}
		if rep == "test_user" {
			if argument == "" {
				fmt.Println("No argument")
				continue
			}
			if err := sql.GetAnimeUserInfo(argument); err != nil {
				fmt.Println("ERROR : ", err)
			}
			continue
		}
		if rep == "all_users" {
			sql.GetAllUsersSQL()
			continue
		}
		if rep == "status" {
			if cfg.StartStatut == 1 {
				println("Server online")
			}
			if cfg.StartStatut == 0 {
				fmt.Println("Server offline")
			}
			continue
		}
		if rep == "cd" {
			if argument == "" {
				fmt.Println("No argument")
				continue
			}
			if err := os.Chdir(argument); err != nil {
				fmt.Printf("error cd: %v\n", err)
				continue
			}
			cfg.Path, _ = os.Getwd()
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

	if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error input: %v\n", err)
	}
}
