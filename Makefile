# Default target: run all the tests
.PHONY: all_tests
all_tests ::

# Run the unit tests
.PHONY: unit_tests
unit_tests: 
	@echo "\n=======  Running unit tests =========\n"
	mocha unit_tests
all_tests :: unit_tests

# Run the functional tests
.PHONY: functional_tests
functional_tests: 
	@echo "\n=======  Running functional tests =========\n"
	mocha functional_tests
all_tests :: functional_tests