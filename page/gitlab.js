firebase.initializeApp(config);

// Function called when clicking the sign in button
function signIn() {
	if (!firebase.auth().currentUser) {
		document.getElementById('button').classList.replace('btn-success', 'btn-secondary'); // from [Sign in]
		document.getElementById('button').textContent = 'Please login... (pop-up)';
		var provider = new firebase.auth.OAuthProvider('oidc.gitlab.com');
		firebase.auth().signInWithPopup(provider).then(function(result) {
			// result.credential is a firebase.auth().OAuthCredential object.
			// result.credential.providerId is equal to 'oidc.myProvider'.
			// result.credential.idToken is the OIDC provider's ID token.
		}).catch(function(error) {
			// Handle Errors here.
			var errorCode = error.code;
			if (errorCode === 'auth/account-exists-with-different-credential') {
				alert('You have already signed up with a different auth provider for that email.');
			} else {
				console.error(error);
			}
		});
	}
}

// Function called when clicking the sign out button
function signOut() {
	if (firebase.auth().currentUser) {
		firebase.auth().signOut();
	}
}

// Retrieve JWT token
function getToken() {
	if (firebase.auth().currentUser) {
		firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
			// Send this JWT token to your backend via HTTPS
			document.getElementById('jwt-token').textContent = idToken;
			document.getElementById('button-jwt').setAttribute('href', 'https://jwt.io/#debugger-io?token=' + idToken);
			var userModal = new bootstrap.Modal(document.getElementById('user-modal'), {});
			userModal.show();
		}).catch(function(error) {
			// Handle error
			console.error(error);
		});
	}
}

/*
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 * - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
	// Listening for auth state changes.
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in
			// https://firebase.google.com/docs/reference/js/firebase.User
			var userId = user.providerData[0].uid;
			var userName = user.displayName;
			document.getElementById('user-name').textContent = userName;
			document.getElementById('user-id').textContent = userId;
			document.getElementById('hello').classList.replace('invisible', 'visible');
			// Show invite button
			document.getElementById('button').textContent = 'Show token';
			document.getElementById('button').classList.replace('btn-secondary', 'btn-primary'); // from [Loading...]
			document.getElementById('button').classList.replace('btn-success', 'btn-primary'); // from [Sign in]
			document.getElementById('button').addEventListener('click', getToken, false);
			// Show sign out button
			document.getElementById('sign-out').classList.replace('invisible', 'visible');
			document.getElementById('button-sign-out').addEventListener('click', signOut, false);
			document.getElementById('user').textContent = JSON.stringify(user, null, '  ');
		} else {
			// User is signed out
			// Show sign in button
			document.getElementById('button').addEventListener('click', signIn, false);
			document.getElementById('button').textContent = 'Sign in';
			document.getElementById('button').classList.replace('btn-secondary', 'btn-success');  // from [Loading...]
			document.getElementById('button').classList.replace('btn-primary', 'btn-success'); // from [Get invite]
			// Hide user info and sign out button
			document.getElementById('hello').classList.replace('visible', 'invisible');
			document.getElementById('sign-out').classList.replace('visible', 'invisible');
		}
		document.getElementById('button').disabled = false;
	});
}

window.onload = function() {
	initApp();
};