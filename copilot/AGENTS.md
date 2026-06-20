## OpenSpec
* When creating a `spec.md` file, assign numbers to each requirement.
* When creating a `design.md` file, include a section with class diagrams in Mermaid format for all classes that are involved in the latest change.  Whenever possible, design decisions should referencne the numbered requirements from a `spec.md` file.
* When creating any diagrams in markdown files, use Mermaid instead of ASCII diagrams, if possible.
* When archiving changes, move files and directories using `git mv`.

## Code comments
* Documentation comments should be Javadoc for Java or JSDoc for Javascript/Typescript or Documentation strings for Python.
* All classes must have class level documentation comments.
* All static methods and public methods which exceed 8 lines should have documentation comments.

## File changes and git
* When deleting a file in a directory managed by git, always use `git rm` for the deletion.
* When moving or renaming a file (or directory) in a directory managed by git, always use `git mv` for the operation.
