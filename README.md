# 88thman - Helpers
## http://88thman.github.io/js.html JavaScript -> HTML
Test JavaScript with instant code execution. All settings (except auto-run) are stored in your browsers storage, so you can reload or close the window.
### Buttons
1. Loop-Protection

   Toggle while-loop protection on and off.
   Works only for
	 ```JavaScript
	 while (statement) {}
	 ```
	 and
	 ```JavaScript
	 do {} while (statement)
	 ```
2. Auto-Run

   After every keyup event, the code gets inserted in a new script-tag. Errors with correct line-numbers are shown.
   This is the only setting which is by default off to prevent crashes on reloading.
3. Orientation

   Rotate editor and console 90°
4. Light- or Darkmode
### Functions
* Errors will be shown instantly, also the executed code.
* `console.log(string)`
* `log(string)` = `console.log(string)`
* `logs(object)` = `console.log(JSON.stringify(object))`(Usefull for showing content of objects)
