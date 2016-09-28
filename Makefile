test: 
	./node_modules/.bin/mocha --reporter spec --recursive ./spec/unit

.PHONY: test
