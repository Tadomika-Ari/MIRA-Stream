package sessionshare

import (
	"fmt"
	"os/exec"
	"strconv"
	"bufio"
	"regexp"

	core "server/server/core"
)

func StartSessionShare(cfg core.Conf) (string, error) {
	fmt.Println("Session Share Start")
	command := exec.CommandContext(cfg.SessionShare.Ctx, "bore", "local", strconv.Itoa(cfg.Server.Port), "--to", "bore.pub")
	stdout, err := command.StdoutPipe()
	if err != nil {
		fmt.Println("ERROR 1")
		cfg.SessionShare.CancelFunction()
		return "", err
	}
	command.Stderr = command.Stdout
	if err := command.Start(); err != nil {
		fmt.Println("ERROR 2")
		cfg.SessionShare.CancelFunction()
		return "", err
	}
	re := regexp.MustCompile(`bore\.pub:\d+`)
	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		if scanner.Err() != nil {
			cfg.SessionShare.CancelFunction()
			return "", scanner.Err()
		}
		line := scanner.Text()
		fmt.Println(line)
		if addr := re.FindString(line); addr != "" {
			url := "http://" + addr
			fmt.Println(url)
			return url, nil
		}
	}
	return "", nil
}