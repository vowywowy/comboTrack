// Initialize Firebase
var config = {
	apiKey: "AIzaSyC15DGMpE-u20cwbsn9smasKn5Ar2CdYUc",
	authDomain: "auth-5a063.firebaseapp.com",
	databaseURL: "https://auth-5a063.firebaseio.com",
	projectId: "auth-5a063",
	storageBucket: "auth-5a063.appspot.com",
	messagingSenderId: "957569156159"
};
firebase.initializeApp(config);

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('form').addEventListener('submit', (e) => {
		e.preventDefault();
		if(document.getElementById('submit').value == 'Login'){
			let auth = false;

			//firebase sign in
			firebase.auth().signInWithEmailAndPassword(
				document.getElementById('email').value,
				document.getElementById('password').value
			).catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(error);
			});

			//if successful sign in
			firebase.auth().onAuthStateChanged(function (user) {
				if (user && !auth) {
					console.log(user);
					auth = true;
					document.querySelectorAll('.text').forEach((e) => {
						e.remove();
					});
					document.getElementById('submit').value = 'Add';

					const add = document.createElement('input');
					add.setAttribute('type', 'number');
					add.setAttribute('min', '0');
					add.setAttribute('id', 'add');

					document.getElementById('form').prepend(add);

					//get db info
					let db = firebase.database().ref('/');
					db.on('value', (snapshot) => {
						let totals = [];
						for (user in snapshot.val()) {
							if (snapshot.val().hasOwnProperty(user)) {
								totals.push({
									name: user,
									total: snapshot.val()[user]
								});
							}
						}

						let result = totals.find((obj) =>
							obj.total == Math.min.apply(
								Math,
								totals.map((obj) => obj.total)
							)
						);
						result = `${result.name} owes ${
							(totals.find((obj) =>
								obj.name != result.name).total - result.total).toFixed(2)
							}`
						console.log(result);

						let display = document.getElementById('result');
						if (!display) {
							display = document.createElement('div');
							display.setAttribute('id', 'result');
							document.getElementById('form').prepend(display);
						}
						display.textContent = result;
					});
				}
			});
		} else if(document.getElementById('submit').value == 'Add') {
			firebase.database().ref().update(/*update object*/);
		}
	});
});