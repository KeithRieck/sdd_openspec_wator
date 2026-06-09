## Design specifications
* When creating a `design.md` file, include a section with class diagrams in Mermaid format for all classes that are involved in the latest change.

## Code comments
* All classes must have class level documentation comments (e.g. Javadoc for Java or JSDoc for Javascript or Documentation strings for Python)
* All static methods and public methods which exceed 8 lines should have documentation comments.

## File changes and git
* When deleting a file in a directory managed by git, always use `git rm` for the deletion.
* When moving or renaming a file in a directory managed by git, always use `git mv` for the operation.
* When OpenSpec archives files and directories, always use `git mv`.