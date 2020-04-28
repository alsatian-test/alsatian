## Initial offering

- [x] load tests into separate tree view
- [x] indicator on file in tree view
- [x] trigger runs from tree view

- [x] load multiple .alsatianrc.json in tree view
- [ ] fix run icons for code lenses
- [x] show loading message on tree view

- [x] click on tree item navigates too file (and hopefully line)
- [ ] trigger fixture run from tree view
- [ ] run all tests from tree view
- [ ] batch test runs
- [ ] refresh tree view user function
- [ ] rename and move files about

- [ ] require before run e.g. enzyme (dep on broader alsatian feature)
- [ ] show failed to load tests message in tree view
- [ ] show failure message in tree view

- [ ] trigger debug from tree view
- [ ] update tree view on saves .alsatianrc.json / spec files / trace deps and run also (more of a tdd thing)

- [ ] add telemetry / error handling / find out what that random throw is all about
- [ ] tidy up / refactor
- [ ] document

## Next steps

- [ ] add unit test

- [ ] hover error shows details e.g. diff
- [ ] capture errors loading tests (currently exit 1 by default)

- [ ] break down test cases / properties
- [ ] run individual test case
- [ ] indicators on each test case

- [ ] tdd / watch task
- [ ] run automatically on save

 * Reduce the extension size and improve the startup time by [bundling your extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension).
 * [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VSCode extension marketplace.
 * Automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).

- [ ] get thrown error message on screen e.g. if there is a `throw new Error("bam")` in the test that should put that out
- [ ] get correct line number for error (show message where it was thrown from)

- [ ] speed up (potentially keep longing process to run tests and pass send info to it to keep typescript compilation rapid - perhaps one per tsconfig resolved? Also need to handle process dying unexpectedly)
- [ ] write progress to output window (deps on speed up as currently multiple workers processing unless we write different progress)

- [ ] consider being able to target alsatian version installed

- [ ] push declarations to @types

- [ ] fine tune animations for svgs
