var gamme = function(){
	var notes = [
		"Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G"
	];
	var sevenths = [
		"", "7", "7maj"
	];
	var out = notes[Math.floor(Math.random() * notes.length)];
	out += (Math.random() > .5 ? "min" : "");
	out += sevenths[Math.floor(Math.random() * sevenths.length)];
	return out;
}