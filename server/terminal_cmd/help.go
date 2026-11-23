package cmd

import "fmt"

func Help() {
	fmt.Print(`
MIRA-Stream commands
====================

Usage
-----
  help                         Show this help message
  exit                         Stop the application

Server and configuration
------------------------
  start                        Start the server with the current config
  status                       Show whether the server is online or offline
  config                       Display the current configuration
  vfolder                      Change the video folder (reset on restart)

Files and folders
-----------------
  list                         List media folders
  cd <directory>               Change the current directory
  ls                           Show files and folders in the current directory

Users and anime
---------------
  all_users                    Show all users
  anime_user <user>            Show the anime list for a user

Development
-----------
  test                         Run the development test command

`)
}
