package sessionshare

import (
	"fmt"
	"os/exec"
	"strconv"
	"bufio"
	"context"
	"regexp"

	core "server/server/core"
)

func StartSessionShare(cfg core.Conf) error {
	fmt.Println("Session Share Start")
	ctx, cancel := context.WithCancel(context.Background())
	command := exec.CommandContext(ctx, "bore", "local", strconv.Itoa(cfg.Server.Port), "--to", "bore.pub")
	stdout, err := command.StdoutPipe()
	if err != nil {
		fmt.Println("ERROR 1")
		return err
	}
	command.Stderr = command.Stdout
	if err := command.Start(); err != nil {
		fmt.Println("ERROR 2")
		return err
	}
	re := regexp.MustCompile(`bore\.pub:\d+`)
	scanner := bufio.NewScanner(stdout)
	for scanner.Scan() {
		if scanner.Err() != nil {
			return scanner.Err()
		}
		line := scanner.Text()
		fmt.Println(line)
		if addr := re.FindString(line); addr != "" {
			url := "http://" + addr
			fmt.Println(url)
			cancel()
		}
	}
	return nil
}