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
- [x] add failure details to indicator / to respective line?
- [x] target tsconfig.json (may not be necessary)
- [x] add running indicator
- [x] run all tests in file
- [x] account for multiple fixtures per file
- [ ] git revert tests accidentally changed while testing
- [ ] add unit test
- [ ] standard linting
- [ ] tidy up deps
- [ ] add telemetry / error handling / find out what that random throw is all about
- [ ] tidy up
- [ ] document
- [ ] figure out publish

## Next steps

- [ ] fine tune animations for svgs

- [ ] get thrown error message on screen e.g. if there is a `throw new Error("bam")` in the test that should put that out
- [ ] get correct line number for error

- [ ] require before run e.g. enzyme (dep on broader alsatian feature)

- [ ] speed up (potentially keep longing process to run tests and pass send info to it to keep typescript compilation rapid - perhaps one per tsconfig resolved? Also need to handle process dying unexpectedly)
- [ ] write progress to output window (deps on speed up as currently multiple workers processing unless we write different progress)

- [ ] tdd / watch task
- [ ] consider being able to target alsatian version installed
- [ ] break down test cases / properties
- [ ] run automatically on save
- [ ] run individual test case
- [ ] indicators on each test case
- [ ] load tests into separate tree view
- [ ] indicator on file in tree view
- [ ] trigger runs from tree view
