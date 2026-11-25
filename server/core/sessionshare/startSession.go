package sessionshare

import (
	"fmt"
	"os/exec"
	"strconv"

	core "server/server/core"
)

func ArgBuild(cfg core.Conf) string {
	arg := "-R 80:localhost:" + strconv.Itoa(cfg.Server.Port) + "localhost.run"
	return arg
}

func StartSessionShare(cfg core.Conf) error {
	fmt.Println("Session Share Start")
	build := ArgBuild(cfg)
	command := exec.Command("ssh", build)
	if err := command.Run(); err != nil {
		return err
	}
	return nil
}