## Initial offering

- [x] run individual test
- [x] current state color indicator
- [x] clear require cache
- [x] move indicator in line with function name
- [x] don't show run / debug on non tests e.g. setup / teardown
- [x] debugging (try
                    * setup attach with port number
                    * fork process with debug argument setting defined port number
                    * use messaging to communicate between the two
                )
- [ ] write progress to output window
- [ ] add failure details to indicator / to respective line?
- [ ] speed up (potentially keep longing process to run tests and pass send info to it to keep typescript compilation rapid - perhaps one per tsconfig resolved? Also need to handle process dying unexpectedly)
- [ ] target tsconfig.json (may not be necessary)
- [x] add running indicator
- [ ] run all tests in file
- [ ] account for multiple fixtures per file
- [ ] add telemetry / error handling / find out what that random throw is all about
- [ ] fine tune animations for svgs
- [ ] tidy up
- [ ] document
- [ ] figure out publish

## Next steps

- [ ] consider being able to target alsatian version installed
- [ ] break down test cases / properties
- [ ] run automatically on save
- [ ] run individual test case
- [ ] indicators on each test case
- [ ] load tests into separate tree view
- [ ] indicator on file in tree view
- [ ] trigger runs from tree view
