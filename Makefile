NAME =	MIRA-Stream

all:	$(NAME)

$(NAME):
	echo "Its OK"

dev:
	cd web-client && npm run dev &

build:
	echo "Its Ok again"