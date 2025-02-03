run-jupyter:
	jupyter lab

run-web:
	python3 -m http.server 8000 & open http://localhost:8000