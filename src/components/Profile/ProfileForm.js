import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
	const newPasswordInputRef = useRef();
	const authCtx = useContext(AuthContext);

	const history = useHistory();
	const submitHandler = (event) => {
		event.preventDefault();

		const enteredNewPassword = newPasswordInputRef.current.value;

		// add validation

		fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBVsxMlTjN1TzTOZk_lG7QykVjgk4zNWwQ',
			{
				method: 'POST',
				body: JSON.stringify({
					idToken: authCtx.token,
					password: enteredNewPassword,
					returnSecureToken: false,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then((res) => {
			// assumption: Always succeeds!

			history.replace('/');
		});
	};

	return (
		<form className={classes.form} onSubmit={submitHandler}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input
					type="password"
					id="new-password"
					minLength="7"
					ref={newPasswordInputRef}
				/>
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;

/**
 * this feature allows user to send a request to the firebase to change the passoword.
 * @useRef - We get the user input via ref here.
 * @authCtx - to get the user IdToken for firebase verification.
 * enteredpass is the new password.
 * @body - This 'POST' object structure is the way firebase set their strucutre to set new password.You can always see these Docs on firebase auth rest API.

 */
