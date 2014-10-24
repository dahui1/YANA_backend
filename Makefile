# Default target: run all the tests
.PHONY: all_tests
all_tests ::

# Run the functional tests
.PHONY: functional_tests
functional_tests: 
	@echo "\n=======  Running functional tests =========\n"
	mocha functional_tests/users_tests.js
	mocha functional_tests/friends_tests.js
	mocha functional_tests/request_tests.js
all_tests :: functional_tests

# Run the unit tests
.PHONY: unit_tests
unit_tests: 
	@echo "\n=======  Running unit tests =========\n"
	mocha unit_tests/users_test.js
	mocha unit_tests/request_test.js
	mocha unit_tests/friends_test.js
all_tests :: unit_tests
